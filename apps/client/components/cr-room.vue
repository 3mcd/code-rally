<style lang="stylus">
  .cr-Room-tabs
    font-size 0
    position relative
    z-index 1

  .cr-Room-tabs > button
    background #aaa
    border 0
    color #fff
    font-size 12px
    font-weight 200
    outline 0
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
    
  .cr-Room-options
    font-size 12px
    margin-bottom 1em

  .cr-Room-options > ul
    list-style-type none
    margin 0
    padding 0
    
  .cr-Room-options ul > li
    background #e9e9e9
    display inline-block
    padding 3px
    width auto
    
  .cr-Room-options > ul > li > *
    vertical-align middle
</style>

<template>
  <div class="cr-Room">
    <h3>{{room.name}}</h3>
    <div class="cr-Room-options" v-if="loaded">
      <ul>
        <li>
          <label>Reload on run</label>
          <input type="checkbox" v-racer-sync="room.$model : reload" v-model="room.reload" />
        </li>
      </ul>
    </div>
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
        previous: '',
        loaded: false
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
            _this.active = _this.room.editors[0];
            _this.loaded = true;
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
        this.active = this.previous;
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
    }
  };
</script>