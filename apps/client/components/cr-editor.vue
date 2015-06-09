<style lang="stylus">
  @font-face {
      font-family: 'Bitstream Vera Sans Mono';
      src: url('/fonts/bitstream-vera-sans-mono/VeraMono-webfont.eot');
      src: url('/fonts/bitstream-vera-sans-mono/VeraMono-webfont.eot?#iefix') format('embedded-opentype'),
           url('/fonts/bitstream-vera-sans-mono/VeraMono-webfont.woff') format('woff'),
           url('/fonts/bitstream-vera-sans-mono/VeraMono-webfont.ttf') format('truetype'),
           url('/fonts/bitstream-vera-sans-mono/VeraMono-webfont.svg#Bitstream Vera Sans Mono') format('svg');
      font-weight: normal;
      font-style: normal;
  }

  .CodeMirror
    flex 1
    display flex
    flex-direction column
    height 100%
    font-family "Bitstream Vera Sans Mono"
    font-size 0.9em
    -webkit-font-smoothing antialiased

  .CodeMirror-scroll
    flex 1

  cr-editor
    width 100%
    display flex
    flex-direction column
    flex 1
</style>

<template>
  <cr-panel grow="0" basis="30px">
    <cr-editor-bar editor="{{editor}}" room="{{room}}" meta="{{meta}}"></cr-editor-bar>
  </cr-panel>
  <cr-panel grow="1" align="stretch" direction="column">
    <textarea v-el="editor">{{editor.text}}</textarea>
  </cr-panel>
</template>

<script>
  var _ = require('lodash');
  var CodeMirror = require('codemirror');

  module.exports = {
    components: {
      'cr-editor-bar': require('./cr-editor-bar.vue')
    },
    props: ['editor', 'room', 'meta'],
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
        theme: 'code-rally'
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
    }
  };
</script>