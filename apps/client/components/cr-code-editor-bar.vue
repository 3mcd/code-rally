<style lang="stylus">
  .cr-CodeEditorBar
    background #e9e9e9
    font-size 0
    height 30px
    position relative
    z-index 10
    -webkit-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    -moz-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)

  .cr-CodeEditorBar-controls
    position absolute

  .cr-CodeEditorBar-controls--left
    left 0

  .cr-CodeEditorBar-controls--right
    right 0

  .cr-CodeEditorBar-controls > button,
  .cr-CodeEditorBar-controls > input,
  .cr-CodeEditorBar-controls > select,
  .cr-CodeEditorBar-controls > label
    border 0
    display inline-block
    font-size 13px
    height 30px
    margin 0
    outline 0
    padding 5px

  .cr-CodeEditorBar-controls > select,
  .cr-CodeEditorBar-controls > input
    background #f4f4f4
    
  .cr-CodeEditorBar-controls > select
    cursor pointer
  
  .cr-CodeEditorBar-controls > select:hover,
  .cr-CodeEditorBar-controls > select:focus
    background #fafafa

  .cr-CodeEditorBar-controls > input[type=checkbox]
    position absolute

  .cr-CodeEditorBar-controls > button
    background #ccc

  .cr-CodeEditorBar-controls--right > button
    background #aaa
    color #fff
    &:hover
      background #bbb

  .cr-CodeEditorBar-run
    padding 0 8px
    transition all ease-out 225ms

  .cr-CodeEditorBar-run.is-active
    background #0084c5;

  .cr-CodeEditorBar-run.is-active:hover
    background #51baed !important

  .cr-CodeEditorBar-name
    background #fff !important
    border-right 1px solid #eee
    width 100px

  .cr-CodeEditorBar-name:hover,
  .cr-CodeEditorBar-name:focus
    margin-top -2px
    border-bottom 2px solid #a7adba
</style>

<template>
  <div class="cr-CodeEditorBar">
    <div class="cr-CodeEditorBar-controls cr-CodeEditorBar-controls--left">
      <input class="cr-CodeEditorBar-name" v-racer-sync="editor.$model : name" v-live-text="editor.name" />
      <select v-el="select" v-racer-sync="editor.$model : mode" v-model="editor.mode">
        <option value="text/html">html</option>
        <option value="text/javascript">js</option>
        <option value="text/css">css</option>
      </select>
      <label v-show="isJS">Main</label>
      <input type="checkbox" v-show="isJS" v-model="isMain" />
    </div>
    <div class="cr-CodeEditorBar-controls cr-CodeEditorBar-controls--right">
      <button v-attr="disabled: !roomHasJS" v-class="is-active: roomHasJS && room.main" class="cr-CodeEditorBar-run" v-on="click: runClicked">Run</button>
    </div>
  </div>
</template>

<script>
  var _ = require('lodash');
  var lang = require('../lang');

  module.exports = {
    paramAttributes: ['editor', 'room', 'meta'],
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