<style lang="stylus">
  @font-face {
      font-family: 'M+ 1m regular';
      src: url('/fonts/m+ 1m/mplus-1m-regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
  }

  .CodeMirror
    flex 1
    display flex
    flex-direction column
    height 100%
    font-family "M+ 1m regular"
    font-size 0.9em
    -webkit-font-smoothing antialiased

  .CodeMirror-scroll
    flex 1
    
  .CodeMirror-gutters
    height 100% !important

  cr-editor
    width 100%
    display flex
    flex-direction column
    flex 1
    position relative
    
  .cr-Editor-settings
    background-color rgba(0,0,0,0.7)
    color #fff
    opacity 0
    display none
    visibility hidden
    position absolute
    right 0
    z-index 100
    font-size 0.7em
    min-width 50%
    
  .cr-Editor-settings.is-active
    opacity 1
    flex 1
    visibility visible
    display block
    
  .cr-Editor-settings > ul
    display table
    margin 0
    padding 0
    list-style-type none
    width 100%
    
  .cr-Editor-settings > ul > li
    display table-row
    cursor pointer
    
  .cr-Editor-settings > ul > li > *
    display table-cell
    vertical-align middle
    padding 1em
    margin 1em 0 1em 1em
</style>

<template>
  <cr-editor>
    <v-panel-bar size="2em">
      <cr-editor-bar editor="{{editor}}" room="{{room}}" meta="{{meta}}"></cr-editor-bar>
    </v-panel-bar>
    <v-panel direction="row" grow="1">
      <v-panel grow="1" basis="200px" align="stretch" direction="column">
        <textarea v-el="editor">{{editor.text}}</textarea>
      </v-panel>
      <div class="cr-Editor-settings" v-class="is-active: settings.visible">
        <ul>
          <li>
            <label for="reload-on-run">Reload on run</label>
            <input id="reload-on-run" type="checkbox" v-racer-model="room.$model : reload" v-model="room.reload" />
          </li>
        </ul>
      </div>
    </v-panel>
  </cr-editor>
</template>

<script>
  var _ = require('lodash');
  var CodeMirror = require('codemirror');

  module.exports = {
    replace: true,
    components: {
      'cr-editor-bar': require('./cr-editor-bar.vue')
    },
    props: ['editor', 'room', 'meta'],
    data: function () {
      return {
        settings: {
          visible: false
        },
        editor: {},
        room: {},
        meta: {}
      };
    },
    methods: {
      check: function () {
        var _this = this;
        setTimeout(function () {
          var cmText = _this.cm.getValue();
          var otText = _this.editor.$model.get('text') || '';
          var cursor = _this.cm.getCursor();

          if (cmText != otText) {
            _this.supress = true;
            _this.cm.setValue(otText);
            _this.supress = false;
            _this.cm.setCursor(cursor)
          }
        }, 0);
      },
      cmModelHandler: function (newVal, oldVal, passed) {
        if (passed.local) return;

        var stringInsert = passed.$stringInsert;
        var stringRemove = passed.$stringRemove;

        if (stringInsert && stringInsert.text) {
          this.supress = true;
          cm.replaceRange(stringInsert.text, cm.posFromIndex(stringInsert.index));
          this.supress = false;
          this.check();
        } else if (stringRemove && stringRemove.howMany) {
          this.supress = true;
          var from = cm.posFromIndex(stringRemove.index);
          var to = cm.posFromIndex(stringRemove.howMany);
          cm.replaceRange('', from, to);
          this.supress = false;
        } else {
          var cursor = this.cm.getCursor();
          this.supress = true;
          this.cm.setValue(newVal);
          this.supress = false;
          this.cm.setCursor(cursor);
        }
      },
      cmDomHandler: function(cm, change) {
        var debounce;
        var model = this.editor.$model;

        if (this.supress) return;

        if (debounce) {
          clearTimeout(debounce);
          debounce = null;
        } 

        debounce = setTimeout(function(){
          var value = cm.getValue();
          model.pass({ local: true }).setDiff('text', value);
        }, model.get('debounce'));
      },
      updateMode: function (mode) {
        var info, mode;
        if (mode) {
          if (/\//.test(mode)) {
            info = CodeMirror.findModeByMIME(mode);
            if (info) {
              mode = info.mode;
            }
          }
          CodeMirror.autoLoadMode(this.cm, mode);
          this.cm.setOption('mode', mode);
        }
      },
      onModeChange: function () {
        this.updateMode(this.$data.editor.mode);
      }
    },
    ready: function () {
      var cm = this.cm = CodeMirror.fromTextArea(this.$$.editor, {
        lineNumbers: true,
        tabSize: 2,
        extraKeys: {
          'Tab': function (cm) { cm.execCommand('insertSoftTab'); }
        },
        theme: 'code-rally',
        lineWrapping: true
      });

      this.updateMode(this.editor.mode);

      _.bindAll(this, 'cmModelHandler', 'cmDomHandler');

      this.$watch('editor.mode', this.onModeChange);
      this.editor.$model.on('change', 'text', this.cmModelHandler);

      cm.on('change', this.cmDomHandler);
    },
    detached: function () {
      // Throws an error (why?):
      // this.editor.$model.removeListener('change', this.cmModelHandler);
      this.cm.off('change', this.cmDomHandler);
    },
    events: {
      'settings:toggle': function () {
        this.settings.visible = !this.settings.visible;
      }
    }
  };
</script>