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
    display flex

  cr-app, cr-app *, cr-app *:before, cr-app *:after 
    box-sizing border-box
    
  cr-app button,
  cr-app input,
  cr-app select,
  cr-app label
    border 0
    display inline-block
    font-size 1em
    margin 0
    outline 0
    padding 5px

  cr-app select,
  cr-app input
    background-color #f4f4f4
    
  cr-app select
    cursor pointer
  
  cr-app select:hover,
  cr-app select:focus
    background-color #fafafa

  cr-app button
    background-color #aeaeae
    color #fff
    padding 0 8px
    transition all ease-out 225ms
    &:hover
      background-color #bbb

  cr-app button.is-active
    background-color #0084c5;

  cr-app button.is-active:hover
    background-color #2699D1 !important
    
  cr-app button.is-inactive
    background-color #ccc
    cursor auto

  cr-app input[type=text]
    background-color #fff !important
    border-right 1px solid #eee
    width 8em
</style>

<template>
  <cr-app>
    <v-panel grow="1" direction="column">
      <component is="{{view}}" params="{{params}}"></component>
    </v-panel>
  </cr-app>
</template>

<script type="text/javascript">
  module.exports = {
    data: {
      view: '',
      params: {}
    },
    components: {
      'room': require('./cr-room.vue')
    },
    replace: true
  };
</script>