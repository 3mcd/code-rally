<style lang="stylus">
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: normal;
    src: local('Source Sans Pro'), url('/fonts/source-sans-pro/SourceSansPro-Regular.otf') format('truetype');
  }
  
  .cr-App
    font-family 'Source Sans Pro'
    position absolute
    height 100%
    width 100%
</style>

<template>
  <div class="cr-App" v-component="{{view}}" v-with="params:params" v-transition></div>
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