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
    padding 0 0.5em

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

  .Handle
    z-index 999

  .Handle:before
    content ''
    position absolute
    background-color #ccc
    
  .Handle:hover:before
    background-color #bbb

  .Handle--right,
  .Handle--left
    cursor ew-resize

  .Handle--bottom,
  .Handle--top
    cursor ns-resize

  .Handle--bottom:before,
  .Handle--top:before
    width 100%
    height 2px
    top 8px

  .Handle--right:before,
  .Handle--left:before
    height 100%
    width 2px
    left 7px
    
  v-panel
    overflow auto
</style>

<template>
  <cr-app>
    <component is="{{view}}" params="{{params}}"></component>
  </cr-app>
</template>

<script type="text/javascript">
  function processHandles(handle) {
    handle.$el.classList.add('Handle');
    handle.$el.classList.add('Handle--' + handle.type);
  }

  module.exports = {
    data: {
      view: '',
      params: {},
      test: {
        before: processHandles,
        handles: [
          { type: 'right' }
        ]
      }
    },
    components: {
      'room': require('./cr-room.vue')
    },
    replace: true
  };
</script>