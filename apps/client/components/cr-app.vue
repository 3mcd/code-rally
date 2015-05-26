<!-- CrApp -->

<style lang="stylus">
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: normal;
    src: local('Source Sans Pro'), url('/fonts/source-sans-pro/SourceSansPro-Regular.otf') format('truetype');
  }
  
  .cr-App
    font-family 'Source Sans Pro'
</style>

<template>
  <a href="/rooms/home">Home</a>
  <div class="cr-App">
    <div v-component="{{view}}" v-with="params:params" v-transition></div>
  </div>
</template>

<script type="text/javascript">
  module.exports = {
    data: {
      view: '',
      params: {}
    },
    components: {
      /**
       * Register all top-level components
       */
      'room': require('./cr-room.vue')
    }
  };
</script>