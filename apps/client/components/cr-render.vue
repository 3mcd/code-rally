<style lang="stylus">
  cr-render
    flex 1
    display flex
    flex-direction column
    position relative
    
  .cr-Render-frame
    border 0
    flex 1
</style>

<template>
    <cr-spinner v-if="loading"></cr-spinner>
    <iframe v-el="render" src="/render/{{room.name}}?ts={{room.reload ? room.ts : ''}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true" class="cr-Render-frame"></iframe>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        loading: true
      }
    },
    props: ['room'],
    ready: function () {
      var _this = this;
      this.$$.render.onload = function () {
        _this.loading = false;
      }
    },
    watch: {
      'room.ts': function () {
        this.loading = true;
      }
    }
  };
</script>