<style lang="stylus">
  .cr-Room
    height 100%
    
  .cr-Room-editors
    position relative
    z-index 10
    
  .cr-Room-options
    color #fff
    margin-bottom 1em

  .cr-Room-options > ul
    list-style-type none
    margin 0
    padding 0
    
  .cr-Room-options ul > li
    background #aaa
    display inline-block
    padding 3px
    width auto
    
  .cr-Room-options > ul > li > *
    vertical-align middle
</style>

<template>
  <div class="cr-Room" v-if="meta.loaded">
    <h3>{{room.name}}</h3>
    <div class="cr-Room-options">
      <ul>
        <li>
          <label>Reload on run</label>
          <input type="checkbox" v-racer-sync="room.$model : reload" v-model="room.reload" />
        </li>
      </ul>
    </div>
    <cr-panels>
      <cr-panel flex="2 0 0">
        <cr-tabs tabs="{{tabs}}" v-ref="tabs"></cr-tabs>
        <div class="cr-Room-editors">
          <template v-repeat="editor: room.editors">
            <cr-code-editor editor="{{editor}}" room="{{room}}" meta="{{meta}}" v-if="editor == meta.active"></cr-code-editor>
          </template>
        </div>
      </cr-panel>
      <cr-panel flex="1 0 0">
        <div class="cr-Room-render">
          <cr-render room="{{room}}"></cr-render>
        </div>
      </cr-panel>
    </cr-panels>
  </div>
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
    paramAttributes: ['params'],
    components: {
      'cr-code-editor': require('./cr-code-editor.vue'),
      'cr-panel': require('./cr-panel.vue'),
      'cr-panels': require('./cr-panels.vue'),
      'cr-render': require('./cr-render.vue'),
      'cr-tabs': require('./cr-tabs.vue')
    },
    data: function () {
      return {
        room: {
          name: null,
          editors: [],
          main: '',
          reload: false
        },
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
            text: ''
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