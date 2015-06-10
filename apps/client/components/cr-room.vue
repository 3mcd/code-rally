<style lang="stylus">
  cr-room
    height 100%
    
  cr-room-editors
    position relative
    z-index 10
    
  cr-room-options
    display block
    color #fff
    margin-bottom 1em

  cr-room-options > ul
    list-style-type none
    margin 0
    padding 0
    
  cr-room-options ul > li
    background #aaa
    display inline-block
    padding 3px
    width auto
    
  cr-room-options > ul > li > *
    vertical-align middle
</style>

<template>
  <h3>{{room.name}}</h3>
  <cr-room-options>
    <ul>
      <li>
        <label>Reload on run</label>
        <input type="checkbox" v-racer-sync="room.$model : reload" v-model="room.reload" />
      </li>
    </ul>
  </cr-room-options>
  <cr-panel wrap="wrap" align="stretch">
    <cr-panel grow="1" basis="400px" direction="column">
      <cr-panel flex="0">
        <cr-tabs tabs="{{tabs}}" v-ref="tabs"></cr-tabs>
      </cr-panel>
      <cr-panel align="stretch">
        <template v-repeat="editor: room.editors">
          <cr-editor editor="{{editor}}" room="{{room}}" meta="{{meta}}" v-if="editor == meta.active"></cr-code-editor>
        </template>
      </cr-panel>
    </cr-panel>
    <cr-panel grow="2" basis="500px">
      <cr-render room="{{room}}"></cr-render>
    </cr-panel>
  </cr-panel>
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
      'cr-panel': require('./cr-panel.vue'),
      'cr-panels': require('./cr-panels.vue'),
      'cr-render': require('./cr-render.vue'),
      'cr-tabs': require('./cr-tabs.vue')
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
          previous: null
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
            ext: lang.find(_this.meta.langs, x.mode).ext
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
            _this.room = proxy(model.at('_page.room'));
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
    }
  };
</script>