<style lang="stylus">
  cr-render
    flex 1
    display flex
    flex-direction column
    
  .cr-Render-frame
    border 0
    flex 1
    
  .cr-Render-bar
    flex-direction row
    align-items stretch
    width 100%
    background-color #e9e9e9
    position relative
    z-index 10
    -webkit-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    -moz-box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
    box-shadow 0 1px 1px rgba(0,0,0,0.12), -1px 0 0 rgba(0,0,0,0.03), 1px 0 0 rgba(0,0,0,0.03), 0 1px 0 rgba(0,0,0,0.1)
</style>

<template>
  <cr-panel flex="0 0 30px" class="cr-Render-bar">
    <p style="margin: 0; height: 100%; line-height: 30px; padding-left: 4px;">
      <em>rooms/{{room.name}}</em>
    </p>
  </cr-panel>
  <cr-panel>
    <iframe v-el="render" src="/render/{{room.name}}?ts={{room.reload ? room.ts : ''}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true" class="cr-Render-frame"></iframe>
  </cr-panel>
</template>

<script>
  module.exports = {
    props: ['room']
  };
</script>