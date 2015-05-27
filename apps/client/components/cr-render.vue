<style lang="stylus">
  .cr-Render > iframe
    border 0
    width 100%
    height 100%
    min-height 300px
</style>

<template>
  <div class="cr-Render">
    <iframe v-el="render" src="/render/{{room.name}}{{room.reload ? '?=' + ts : ''}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true"></iframe>
  </div>
</template>

<script>
  module.exports = {
    paramAttributes: ['room']
  };
</script>