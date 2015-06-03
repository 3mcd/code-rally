<style lang="stylus">
  cr-render
    flex 1
    display block
    
  cr-render > iframe
    border 0
    width 100%
    height 100%
    min-height 300px
</style>

<template>
  <iframe v-el="render" src="/render/{{room.name}}?ts={{room.reload ? room.ts : ''}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true"></iframe>
</template>

<script>
  module.exports = {
    props: ['room']
  };
</script>