<style lang="stylus">
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
  <div class="cr-Room" v-if="loaded">
    <h3>{{room.name}}</h3>
    <div class="cr-Room-options">
      <ul>
        <li>
          <label>Reload on run</label>
          <input type="checkbox" v-racer-sync="room.$model : reload" v-model="room.reload" />
        </li>
      </ul>
    </div>
    <cr-tabs tabs="{{tabs}}" v-ref="tabs"></cr-tabs>
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
    components: {
      'cr-tabs': require('./cr-tabs.vue'),
      'cr-code-editor': require('./cr-code-editor.vue'),
      'cr-render': require('./cr-render.vue')
    },
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
        loaded: false,
        active: null,
        previousEditor: null
      }
    },
    computed: {
      tabs: {
        get: function () {
          var _this = this;
          return _.map(this.room.editors, function (x) {
            return {
              ref: x,
              name: x.name,
              ext: _.find(_this.langs, function (y) {
                return x.mode == y.mime;
              }).ext
            };
          });
        }
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
            mode: _.find(this.langs, function (x) {
              return x.name == 'html';
            }).mime,
            text: ''
          });
        this.active = _.last(this.room.editors);
      },
      'tab:change': function (ref) {
        this.active = ref;
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
            _this.active = _this.room.editors[0];
            _this.loaded = true;
          });
      },
      activeUpdate: function (newVal, oldVal) {
        this.$.tabs.select(newVal);
        this.previousEditor = oldVal;
      },
      findEditor: function (name) {
        return _.find(this.room.editors, function (x) {
          return x.name == name;
        });
      }
    },
    watch: {
      'params.room': 'roomUpdate',
      'active': 'activeUpdate'
    }
  };
</script>