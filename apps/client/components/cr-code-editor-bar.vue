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
    background #fafafa
    
  .cr-CodeEditorBar-controls > select
    cursor pointer

  .cr-CodeEditorBar-controls > select:hover,
  .cr-CodeEditorBar-controls > input:hover,
  .cr-CodeEditorBar-controls > select:focus,
  .cr-CodeEditorBar-controls > input:focus
    background #fff

  .cr-CodeEditorBar-controls > input[type=checkbox]
    position absolute

  .cr-CodeEditorBar-controls > button
    background #ccc

  .cr-CodeEditorBar-controls--right > button
    background #aaa
    color #fff
    &:hover
      background #bbb

  .cr-CodeEditorBar-name
    background #fff !important
    border-right 1px solid #eee
    width 100px
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
      <input type="checkbox" v-show="isJS" v-model="main" />
    </div>
    <div class="cr-CodeEditorBar-controls cr-CodeEditorBar-controls--right">
      <button v-on="click: runClicked">Run</button>
    </div>
  </div>
</template>

<script>
  var _ = require('lodash');

  module.exports = {
    paramAttributes: ['editor', 'room', 'langs'],
    computed: {
      main: {
        get: function () {
          return this.room.main == this.editor.name;
        },
        set: function (checked) {
          this.$dispatch('main', checked ? this.editor.name : null);
        }
      },
      isJS: {
        get: function () {
          return this.editor.mode == _.find(this.langs, function (x) {
            return x.name == 'javascript';
          }).mime;
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