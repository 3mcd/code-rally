<style lang="stylus">
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: normal;
    src: local('Source Sans Pro'), url('/fonts/source-sans-pro/SourceSansPro-Regular.otf') format('truetype');
  }
  
  @font-face {
    font-family: 'IcoMoon';
    font-style: normal;
    font-weight: normal;
    src: local('IcoMoon'), url('/fonts/ico-moon/IcoMoon-Free.ttf') format('truetype');
  }
  
  cr-app
    display block
    font-family 'Source Sans Pro'
    font-size inherit
    height 100%
    width 100%
    overflow hidden
    display flex

  cr-app *, cr-app *:before, cr-app *:after {
    box-sizing: border-box;
  }
</style>

<template>
  <cr-panel direction="column">
    <cr-panel flex="1">
      <component is="{{view}}" params="{{params}}"></component>
    </cr-panel>
  </cr-panel>
</template>

<script type="text/javascript">
  module.exports = {
    data: {
      view: '',
      params: {}
    },
    components: {
      'cr-panel': require('./cr-panel.vue'),
      'cr-panels': require('./cr-panels.vue'),
      'room': require('./cr-room.vue')
    }
  };
</script>