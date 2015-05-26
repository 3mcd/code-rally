<style lang="stylus">

</style>

<template>
  <style v-repeat="room.editors | filterBy 'text/css' in 'mode'">
    {{{text}}}
  </style>
  <div v-repeat="room.editors | filterBy 'text/html' in 'mode'">
    {{{text}}}
  </div>
</template>

<script type="text/javascript">
  module.exports = {
    data: function () {
      return {
        room: {
          name: '',
          editors: []
        }
      }
    },
    computed: {
      js: function () {
        return this.room.editors.filter(function (x) {
          return x.mode = 'text/javascript';
        });
      }
    },
    watch: {
      'js': 'jsUpdate'
    },
    methods: {
      jsUpdate: function () {
        console.log('dude');
      }
    }
  };
</script>