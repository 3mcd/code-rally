<style lang="stylus">
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: normal;
    src: local('Source Sans Pro'), url('/fonts/source-sans-pro/SourceSansPro-Regular.otf') format('truetype');
  }
  
  cr-app
    display block
    font-family 'Source Sans Pro'
    font-size inherit
    height 100%
    width 100%
    overflow hidden

  cr-app *, cr-app *:before, cr-app *:after {
    box-sizing: border-box;
  }
</style>

<template>
  <cr-panels direction="column">
    <cr-panel>
      <cr-view view="{{view}}" params="{{params}}"></cr-view>
    </cr-panel>
  </cr-panels>
</template>

<script type="text/javascript">
  module.exports = {
    data: {
      view: '',
      params: {}
    },
    components: {
      'cr-view': require('./cr-view.vue'),
      'cr-panel': require('./cr-panel.vue'),
      'cr-panels': require('./cr-panels.vue'),
      'room': require('./cr-room.vue')
    }
  };
</script>