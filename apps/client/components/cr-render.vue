<style lang="stylus">
  cr-render
    flex 1
    display flex
    flex-direction column
    
  .cr-Render-frame
    border 0
    flex 1
</style>

<template>
    <iframe v-el="render" src="/render/{{room.name}}?ts={{room.reload ? room.ts : ''}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true" class="cr-Render-frame"></iframe>
</template>

<script>
  module.exports = {
    props: ['room']
  };
</script>