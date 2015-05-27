<style lang="stylus">
  .cr-CodeEditorBar
    height 30px
    background-color #e9e9e9
    font-size 0

  inputs = 'button,input,select,label'

  .cr-CodeEditorBar-controls
    position absolute

  .cr-CodeEditorBar-controls--left
    left 0

  .cr-CodeEditorBar-controls--right
    right 0

  for input in inputs
    .cr-CodeEditorBar-controls > {input}
      border 0
      display inline-block
      font-size 13px
      height 30px
      margin 0
      outline 0
      padding 5px

  .cr-CodeEditorBar-controls > select,
  .cr-CodeEditorBar-controls > input
    background-color #fafafa

  .cr-CodeEditorBar-controls > select:hover,
  .cr-CodeEditorBar-controls > input:hover,
  .cr-CodeEditorBar-controls > select:focus,
  .cr-CodeEditorBar-controls > input:focus
    background-color #fff

  .cr-CodeEditorBar-controls > input[type=checkbox]
    position absolute

  .cr-CodeEditorBar-controls > button
    background #ccc

  .cr-CodeEditorBar-controls--right > button
    color #fff
    background #aaa
    &:hover
      background #bbb

  .cr-CodeEditorBar-name
    width 100px
    border-right 1px solid #eee
</style>

<template>
  <div class="cr-CodeEditorBar">
    <div class="cr-CodeEditorBar-controls cr-CodeEditorBar-controls--left">
      <input class="cr-CodeEditorBar-name" v-racer-sync="editor.$model : name" v-live-text="editor.name" />
      <select v-el="select" v-racer-sync="editor.$model : mode">
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
    main: {
      get: function () {
        return this.room.main == this.editor.name;
      },
      set: function (value) {
        this.$dispatch('main', value ? this.editor.name : null);
      }
    },
    computed: {
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
        console.log(this);
        this.$dispatch('run', this);
      }
    }
  };
</script>