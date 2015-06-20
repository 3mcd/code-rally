<style lang="stylus">
  cr-room
    display flex
    flex-grow 1
  
  .cr-Room-editors
    position relative
    min-width 26em
    z-index 99

  .cr-Room-title
    font-size 1em
    margin 0
    height 100%
    line-height 2em
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
    
  .cr-Room-instructions
    color #fff
</style>

<template>
  <cr-spinner v-if="meta.loading"></cr-spinner>
  <cr-room v-show="!meta.loading">
    <v-panel  grow="1" direction="column">
      <v-panel-bar size="auto">
        <cr-tabs tabs="{{tabs}}" v-ref="tabs"></cr-tabs>
      </v-panel-bar>
      <v-panel grow="1">
        <v-panel v-resize="resize" class="cr-Room-editors" basis="400px" direction="column" >
          <v-panel v-if="room.editors.length === 0" grow="1">
            <h2 class="cr-Room-instructions">Add a new editor using the '+' button above</h2>
          </v-panel>
          <template v-repeat="editor: room.editors">
            <cr-editor editor="{{editor}}" room="{{room}}" meta="{{meta}}" v-if="editor == meta.active"></cr-editor>
          </template>
        </v-panel>
        <v-panel grow="1" class="cr-Room-render" v-class="is-active: meta.render.visible" direction="column">
          <v-panel-bar class="cr-Room-renderBar" size="2em">
            <h2 v-show="meta.render.visible" class="cr-Room-title">rooms/{{room.name}}</h2>
          </v-panel-bar>
          <v-panel grow="1">
            <cr-render room="{{room}}"></cr-render>
          </v-panel>
        </v-panel>
      </v-panel>
    </v-panel>
  </cr-room>
</template>

<script>
  var _ = require('lodash');

  function processHandles(handle) {
    handle.$el.classList.add('Handle');
    handle.$el.classList.add('Handle--' + handle.type);
  }

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
    replace: true,
    props: [
      { name: 'room', type: Object },
      { name: 'params', type: Object }
    ],
    components: {
      'cr-editor': require('./cr-editor.vue'),
      'cr-render': require('./cr-render.vue'),
      'cr-tabs': require('./cr-tabs.vue'),
      'cr-icon': require('./cr-icon.vue'),
      'cr-spinner': require('./cr-spinner.vue')
    },
    data: function () {
      return {
        room: {
          name: '',
          main: '',
          reload: false,
          ts: new Date().getTime() / 1000
        },
        params: {
          room: ''
        },
        meta: {
          langs: langs,
          loading: true,
          active: {},
          activeIndex: 0,
          render: {
            visible: true
          }
        },
        resize: {
          before: processHandles,
          handles: [
            { type: 'right' }
          ]
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
        this.addRoom();
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
      addRoom: function () {
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
      },
      roomUpdate: function (newVal, oldVal) {
        var _this = this;
        service
          .get('rooms/' + newVal)
          .then(function (model) {
            _this.room = window.room = proxy(model.at('_page.room'));
            setTimeout(function () {
              _this.meta.active = _this.room.editors[0];
            }, 0);
            _this.meta.loading = false;
          });
      },
      activeUpdate: function (newVal, oldVal) {
        this.$.tabs.select(newVal);
        this.activeIndex = this.room.editors.indexOf(newVal);
      },
      editorsUpdate: function (newVal, oldVal) {
        var _this = this;

        var selectedPresent = _.any(this.room.editors, function (x) {
          return x.id === _this.meta.active.id;
        });

        if (!selectedPresent) {
          _this.meta.active = this.room.editors[(this.activeIndex || 1) - 1];
        }
      }
    },
    watch: {
      'room.editors': 'editorsUpdate',
      'params.room': 'roomUpdate',
      'meta.active': 'activeUpdate'
    }
  };
</script>