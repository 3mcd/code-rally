<style lang="stylus">
  cr-room
    height 100%
  
  .cr-Room-editors
    position relative
    z-index 99
    -webkit-box-shadow 1px 1px 1px rgba(0,0,0,0.10)
    -moz-box-shadow 1px 1px 1px rgba(0,0,0,0.10)
    box-shadow 1px 1px 1px rgba(0,0,0,0.10)

  .cr-Room-title
    font-size 1em
    margin 0
    height 100%
    line-height 30px
    font-weight 200
    
  .cr-Room-render
    flex-grow 0
    flex-basis 30px
    flex-shrink 0
    
  .cr-Room-render.is-active
    flex-grow 5
    flex-basis 200px
  
  .cr-Room-renderBar
    background-color #e9e9e9

  .cr-Room-title
    padding-left 4px
</style>

<template>
  <v-panel-bar size="auto">
    <cr-tabs tabs="{{tabs}}" v-ref="tabs"></cr-tabs>
  </v-panel-bar>
  <v-panel grow="1" wrap="wrap" align-items="stretch">
    <v-panel grow="2" basis="300px" direction="column" class="cr-Room-editors">
      <template v-repeat="editor: room.editors">
        <cr-editor editor="{{editor}}" room="{{room}}" meta="{{meta}}" v-if="editor == meta.active"></cr-editor>
      </template>
    </v-panel>
    <v-panel class="cr-Room-render" v-class="is-active: meta.render.visible" direction="column">
      <v-panel-bar class="cr-Room-renderBar" size="2em">
        <v-panel grow="2">
          <h2 v-show="meta.render.visible" class="cr-Room-title">rooms/{{room.name}}</h2>
        </v-panel>
        <v-panel grow="0">
          <button v-on="click: meta.render.visible = !meta.render.visible">
            <cr-icon type="{{meta.render.visible ? 'left4' : 'right4'}}"></cr-icon>
          </button>
        </v-panel>
      </v-panel-bar>
      <v-panel grow="1">
        <cr-render room="{{room}}"></cr-render>
      </v-panel>
    </v-panel>
  </v-panel>
</template>

<script>
  var _ = require('lodash');

  var lang = require('../lang');
  var proxy = require('../../racer-model-proxy');
  var service = require('../../model-service');
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

  module.exports = {
    props: ['params'],
    components: {
      'cr-editor': require('./cr-editor.vue'),
      'cr-render': require('./cr-render.vue'),
      'cr-tabs': require('./cr-tabs.vue'),
      'cr-icon': require('./cr-icon.vue')
    },
    data: function () {
      return {
        room: {
          name: null,
          main: {},
          reload: false
        },
        editors: [],
        params: {
          room: null
        },
        meta: {
          langs: langs,
          loaded: false,
          active: null,
          previous: null,
          render: {
            visible: true
          }
        }
      }
    },
    computed: {
      tabs: function () {
        var _this = this;
        return _.map(this.room.editors, function (x) {
          return {
            ref: x,
            name: x.name,
            ext: lang.find(_this.meta.langs, x.mode).ext,
            important: _this.room.main == x.id
          };
        });
      }
    },
    events: {
      'tab:add': function () {
        this.room.editors.$model
          .pass({
            local: true
          })
          .push({
            name: '(new)',
            mode: lang.find(this.meta.langs, 'html').mime,
            text: '',
            id: this.room.editors.$model.id()
          });
        console.log('add tab');
        this.meta.active = _.last(this.room.editors);
      },
      'tab:change': function (ref) {
        this.meta.active = ref;
      },
      'tab:remove': function (ref) {
        ref.$model.remove();
      },
      'run': function (child) {
        this.room.$model.set('ts', new Date().getTime() / 1000);
      },
      'main': function (id) {
        this.room.$model.set('main', id);
      }
    },
    methods: {
      roomUpdate: function (newVal, oldVal) {
        var _this = this;
        service
          .get('rooms/' + newVal)
          .then(function (model) {
            _this.room = window.room = proxy(model.at('_page.room'));
            setTimeout(function () {
              _this.meta.active = _this.room.editors[0];
            }, 0);
            _this.meta.loaded = true;
          });
      },
      activeUpdate: function (newVal, oldVal) {
        this.$.tabs.select(newVal);
        this.meta.previous = oldVal;
      },
      findEditor: function (name) {
        return _.find(this.room.editors, function (x) {
          return x.name == name;
        });
      }
    },
    watch: {
      'params.room': 'roomUpdate',
      'meta.active': 'activeUpdate'
    },
    replace: true
  };
</script>