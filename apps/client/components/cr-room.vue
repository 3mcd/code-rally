<style lang="stylus">

</style>

<template>
  <div class="cr-Room">
    <h3>{{room.name}}</h3>
    <cr-code-editor v-repeat="room.editors"></cr-code-editor>
    <button v-on="click: addEditorClick">Add an editor</button>
    <iframe src="/render/{{room.name}}"></iframe>
  </div>
</template>

<script>
  var service = require('../../model-service');

  module.exports = {
    data: function () {
      return {
        model: null,
        room: {
          name: null,
          editors: []
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
            _this.model = model.at('_page.room');
            _this.room = _this.model.get();
          });
      },
      addEditorClick: function (e) {
        this.model.at('editors')
          .pass({
            local: true
          })
          .push({
            mode: 'text/html',
            text: '<p>Some content</p>'
          });
      }
    }
  };
</script>