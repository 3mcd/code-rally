<style lang="stylus">
  .cr-Room {

  }
</style>

<template>
  <div class="cr-Room">
    <h3>{{room.name}}</h3>
    <div v-repeat="editor: room.editors">
      <cr-code-editor editor="{{editor}}" room="{{room}}"></cr-code-editor>
    </div>
    <button v-on="click: addEditorClick">Add an editor</button>
    <iframe v-el="render" src="/render/{{room.name}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true" style="height: 100%; width: 724px;"></iframe>
  </div>
</template>

<script>
  var service = require('../../model-service');
  var proxy = require('../../racer-model-proxy');

  module.exports = {
    data: function () {
      return {
        room: {
          name: null,
          editors: [],
          main: ''
        },
        params: {
          room: null
        }
      }
    },
    watch: {
      'params.room': 'update'
    },
    components: {
      'cr-code-editor': require('./cr-code-editor.vue')
    },
    methods: {
      update: function () {
        var _this = this;
        service
          .get('rooms/' + this.params.room)
          .then(function (model) {
            _this.room = proxy(model.at('_page.room'));
          });
      },
      addEditorClick: function (e) {
        this.room.editors.$model
          .pass({
            local: true
          })
          .push({
            mode: 'text/html',
            text: ''
          });
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