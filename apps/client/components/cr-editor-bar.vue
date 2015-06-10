<style lang="stylus">
  cr-editor-bar
    display flex
    flex-direction row
    align-items stretch
    width 100%
    background-color #e9e9e9
    position relative
    z-index 10
    -webkit-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    -moz-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)

  .cr-EditorBar-controls--right
    justify-content flex-end

  .cr-EditorBar-controls > button,
  .cr-EditorBar-controls > input,
  .cr-EditorBar-controls > select,
  .cr-EditorBar-controls > label
    border 0
    display inline-block
    font-size 1em
    margin 0
    outline 0
    padding 5px

  .cr-EditorBar-controls > select,
  .cr-EditorBar-controls > input
    background-color #f4f4f4
    
  .cr-EditorBar-controls > select
    cursor pointer
  
  .cr-EditorBar-controls > select:hover,
  .cr-EditorBar-controls > select:focus
    background-color #fafafa

  .cr-EditorBar-controls > input[type=checkbox]
    position absolute

  .cr-EditorBar-controls > button
    flex-grow 0
    flex-basis auto
    background-color #aeaeae
    color #fff
    padding 0 8px
    transition all ease-out 225ms
    &:hover
      background-color #bbb

  .cr-EditorBar-controls > button.is-active
    background-color #0084c5;

  .cr-EditorBar-controls > button.is-active:hover
    background-color #2699D1 !important
    
  .cr-EditorBar-controls > button.is-inactive
    background-color #ccc
    cursor auto

  .cr-EditorBar-controls > input[type=text]
    background-color #fff !important
    border-right 1px solid #eee
    width 8em
    
  .cr-EditorBar-controls > label > *
    vertical-align middle
    padding-right 0.25em
</style>

<template>
  <cr-panel grow="2" class="cr-EditorBar-controls cr-EditorBar-controls--left">
    <input type="text" class="cr-CodeEditorBar-name" v-racer-model="editor.$model : name" v-live-text="editor.name" />
    <select v-el="select" v-racer-model="editor.$model : mode" v-model="editor.mode">
      <option value="text/html">html</option>
      <option value="text/javascript">js</option>
      <option value="text/css">css</option>
    </select>
    <label v-show="isJS">
      <span>Main</span>
      <input type="checkbox" v-show="isJS" v-model="isMain" />
    </label>
  </cr-panel>
  <cr-panel grow="0" basis="auto" class="cr-EditorBar-controls cr-EditorBar-controls--right">
    <button v-on="click: toggleSettings">
      <cr-icon type="cog"></cr-icon>
    </button>
    <button v-attr="disabled: !hasJS" v-class="is-active: hasJS && room.main, is-inactive: !hasJS || !room.main" v-on="click: runClicked">Run</button>
  </cr-panel>
</template>

<script>
  var _ = require('lodash');
  var lang = require('../lang');

  module.exports = {
    data: function () {
      return {
        settingsVisible: false,
        editor: {},
        room: {},
        meta: {}
      };
    },
    components: {
      'cr-icon': require('./cr-icon.vue'),
      'cr-panel': require('./cr-panel.vue')
    },
    props: ['editor', 'room', 'meta'],
    computed: {
      isMain: {
        get: function () {
          return this.room.main == this.editor.id;
        },
        set: function (checked) {
          this.$dispatch('main', checked ? this.editor.id : null);
        }
      },
      hasJS: function () {
        var _this = this;
        return _.any(this.room.editors, function (x) {
          return x.mode == lang.find(_this.meta.langs, 'js').mime;
        });
      },
      isJS: {
        get: function () {
          return this.editor.mode == lang.find(this.meta.langs, 'js').mime;
        }
      }
    },
    methods: {
      runClicked: function (e) {
        this.$dispatch('run', this);
      },
      toggleSettings: function (e) {
        this.$dispatch('settings:toggle');
      }
    }
  };
</script>