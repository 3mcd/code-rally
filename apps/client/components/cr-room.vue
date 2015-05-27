<style lang="stylus">
  .cr-Room-tabs
    position relative
    font-size 0
    z-index 1

  .cr-Room-tabs > button
    background #aaa
    color #fff
    border 0
    outline 0
    font-size 12px
    font-weight 200
    &:hover
      background #bbb
    &:last-child
      margin-left 3px

  .cr-Room-tabs > button.is-active
    background #f0f0f0
    color #0084c5
    margin-top -2px
    border-top 2px solid #0084c5

  .cr-Room-tabs > button.is-active + button.is-active
    padding-left 0
    &:hover
      color #ff0040

  .cr-Room-editors
    position relative
    z-index 10
</style>

<template>
  <div class="cr-Room">
    <h3>{{room.name}}</h3>
    Reload <input type="checkbox" v-model="room.reload" />
    <div class="cr-Room-tabs">
      <template v-repeat="editor: room.editors">
        <button v-on="click: active = editor" v-class="is-active: editor == active">{{getTabName(editor.name, editor.mode)}}</button>
        <button v-on="click: removeEditor(editor)" v-if="editor == active" v-class="is-active: editor == active">x</button>
      </template>
      <button v-on="click: addEditorClick">+</button>
    </div>
    <div class="cr-Room-editors">
      <template v-repeat="editor: room.editors">
        <cr-code-editor editor="{{editor}}" room="{{room}}" langs="{{langs}}" v-if="editor == active"></cr-code-editor>
      </template>
    </div>
    <div class="cr-Room-render">
      <cr-render room="{{room}}"></cr-render>
    </div>
  </div>
</template>

<script>
  var _ = require('lodash');
  var langs = [
    {
      ext: 'html',
      name: 'html',
      mime: 'text/html'
    },
    {
      ext: 'css',
      name: 'css',
      mime: 'text/css'
    },
    {
      ext: 'js',
      name: 'javascript',
      mime: 'text/javascript'
    }
  ];
  var proxy = require('../../racer-model-proxy');
  var service = require('../../model-service');

  module.exports = {
    data: function () {
      return {
        room: {
          name: null,
          editors: [],
          main: '',
          reload: false
        },
        langs: langs,
        params: {
          room: null
        },
        active: '',
        previous: ''
      }
    },
    watch: {
      'params.room': 'roomUpdate',
      'active': 'activeUpdate'
    },
    components: {
      'cr-code-editor': require('./cr-code-editor.vue'),
      'cr-render': require('./cr-render.vue')
    },
    methods: {
      roomUpdate: function () {
        var _this = this;
        service
          .get('rooms/' + this.params.room)
          .then(function (model) {
            _this.room = proxy(model.at('_page.room'));
            _this.active = _this.room.editors[0].name;
          });
      },
      activeUpdate: function (previous, value) {
        this.previous = value;
      },
      addEditorClick: function (e) {
        this.room.editors.$model
          .pass({
            local: true
          })
          .push({
            name: '(new)',
            mode: _.find(this.langs, function (x) {
              return x.name == 'html';
            }).mime,
            text: ''
          });
        this.room.active = _.last(this.room.editors);
      },
      getTabName: function (name, mode) {
        return name + '.' + _.find(this.langs, function (x) {
          return x.mime == mode;
        }).ext;
      },
      removeEditor: function (editor) {
        editor.$model.remove();
      }
    },
    created: function () {
      var _this = this;
      this.$on('run', function (child) {
        this.room.$model.set('ts', new Date().getTime() / 1000);
      });
      this.$on('main', function (id) {
        this.room.$model.set('main', id);
      });
      this.$on('remove', function (child) {
        this.active = this.previous;
      });
    }
  };
</script>