<style lang="stylus">
  .cr-CodeEditorBar
    height 30px
    background-color #e9e9e9

  .cr-CodeEditorBar > button
  .cr-CodeEditorBar > input
  .cr-CodeEditorBar > select
    height 100%
    border 0
    padding 3px
    margin 0
</style>

<template>
  <div class="cr-CodeEditorBar">
    <input v-racer-sync="editor.$model : name" v-live-text="editor.name" />
    <select v-el="select" v-on="change : onModeChange" v-model="editor.mode">
      <option value="text/html">html</option>
      <option value="text/javascript">js</option>
      <option value="text/css">css</option>
    </select>
    <button v-on="click: removeClicked">Delete</button>
    <button v-on="click: runClicked" v-show="editor.mode == 'text/javascript' && room.main == editor.name">Run</button>
    <label v-show="editor.mode == 'text/javascript'">Main
      <input type="checkbox" v-el="main" v-model="main" />
    </label>
  </div>
</template>

<script>
  module.exports = {
    paramAttributes: ['editor', 'room', 'langs'],
    computed: {
      main: {
        get: function () {
          return this.room.main == this.editor.name;
        },
        set: function (value) {
          this.$dispatch('main', value ? this.editor.name : null);
        }
      }
    },
    methods: {
      removeEditor: function () {
        this.$dispatch('remove', this);
        this.editor.$model.remove();
      },
      onModeChange: function (e) {
        console.log(this.editor.mode);
        this.editor.$model.set('mode', this.$$.select.value);
      },
      removeClicked: function (e) {
        this.removeEditor();
      },
      runClicked: function (e) {
        this.$dispatch('run', this);
      }
    }
  };
</script>