<style lang="stylus">
  .cr-Room-tabs > button
    background #aaa
    color #fff
    border 0
    outline 0
    font-size 12px

  .cr-Room-tabs > button.is-active
    background #f0f0f0
    color #aaa
</style>

<template>
  <div class="cr-Room">
    <h3>{{room.name}}</h3>
    <div class="cr-Room-tabs">
      <button v-repeat="room.editors" v-on="click: active = name" v-class="is-active: name == active">{{getTabName(name, mode)}}</button>
      <button v-on="click: addEditorClick">+</button>
    </div>
    <div class="cr-Room-editors">
      <template v-repeat="editor: room.editors">
        <cr-code-editor editor="{{editor}}" room="{{room}}" langs="{{langs}}" v-if="editor.name == active"></cr-code-editor>
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
      name: 'js',
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
          main: ''
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
        this.room.active = '(new)';
      },
      getTabName: function (name, mode) {
        return name + '.' + _.find(this.langs, function (x) {
          return x.mime == mode;
        }).ext;
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