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

  cr-editor-bar button
    flex-grow 0
    flex-basis auto
    
  cr-editor-bar label
    min-width 80px

  cr-editor-bar label > *
    vertical-align middle
    padding-right 0.25em
</style>

<template>
  <cr-editor-bar>
    <v-panel grow="2">
      <input type="text" v-racer-model="editor.$model : name" v-live-text="editor.name" />
      <select v-el="select" v-racer-model="editor.$model : mode" v-model="editor.mode">
        <option value="text/html">html</option>
        <option value="text/javascript">js</option>
        <option value="text/css">css</option>
      </select>
      <label v-show="isJS">
        <span>Main</span>
        <input type="checkbox" v-show="isJS" v-model="isMain" />
      </label>
    </v-panel>
    <v-panel grow="0" basis="auto">
      <button v-on="click: toggleSettings">
        <cr-icon type="cog"></cr-icon>
      </button>
      <button v-attr="disabled: !hasJS" v-class="is-active: hasJS && room.main, is-inactive: !hasJS || !room.main" v-on="click: runClicked">Run</button>
    </v-panel>
  </cr-editor-bar>
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
      'cr-icon': require('./cr-icon.vue')
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
    },
    replace: true
  };
</script>