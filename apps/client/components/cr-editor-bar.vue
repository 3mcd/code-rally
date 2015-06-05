<style lang="stylus">
  cr-editor-bar
    display flex
    flex-direction row
    align-items stretch
    width 100%
    background #e9e9e9
    position relative
    z-index 10
    -webkit-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    -moz-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)

  cr-editor-bar-controls
    display flex
    flex 1

  cr-editor-bar-controls > *
    display flex
    flex 1

  cr-editor-bar-controls.right
    justify-content flex-end

  cr-editor-bar-controls > button,
  cr-editor-bar-controls > input,
  cr-editor-bar-controls > select,
  cr-editor-bar-controls > label
    border 0
    display inline-block
    font-size 1em
    margin 0
    outline 0
    padding 5px

  cr-editor-bar-controls > select,
  cr-editor-bar-controls > input
    background #f4f4f4
    
  cr-editor-bar-controls > select
    cursor pointer
  
  cr-editor-bar-controls > select:hover,
  cr-editor-bar-controls > select:focus
    background #fafafa

  cr-editor-bar-controls > input[type=checkbox]
    position absolute

  cr-editor-bar-controls > button
    flex-grow 0
    flex-basis auto
    background #aaa
    color #fff
    padding 0 8px
    transition all ease-out 225ms
    &:hover
      background #bbb

  cr-editor-bar-controls > button.is-active
    background #0084c5;

  cr-editor-bar-controls > button.is-active:hover
    background #51baed !important

  cr-editor-bar-controls > input[type=text]
    background #fff !important
    border-right 1px solid #eee
    width 8em

  cr-editor-bar-controls > input[type=text]:hover,
  cr-editor-bar-controls > input[type=text]:focus
    border-bottom 2px solid #a7adba
</style>

<template>
  <cr-editor-bar-controls class="left">
    <input type="text" class="cr-CodeEditorBar-name" v-racer-sync="editor.$model : name" v-live-text="editor.name" />
    <select v-el="select" v-racer-sync="editor.$model : mode" v-model="editor.mode">
      <option value="text/html">html</option>
      <option value="text/javascript">js</option>
      <option value="text/css">css</option>
    </select>
    <label v-show="isJS">Main<input type="checkbox" v-show="isJS" v-model="isMain" /></label>
  </cr-editor-bar-controls>
  <cr-editor-bar-controls class="right">
    <button v-attr="disabled: !roomHasJS" v-class="is-active: roomHasJS && room.main" v-on="click: runClicked">Run</button>
  </cr-editor-bar-controls>
</template>

<script>
  var _ = require('lodash');
  var lang = require('../lang');

  module.exports = {
    props: ['editor', 'room', 'meta'],
    computed: {
      isMain: {
        get: function () {
          return this.room.main == this.editor.name;
        },
        set: function (checked) {
          this.$dispatch('main', checked ? this.editor.name : null);
        }
      },
      roomHasJS: function () {
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
      }
    }
  };
</script>