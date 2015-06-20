<style lang="stylus">
  cr-render
    flex 1
    display flex
    flex-direction column
    position relative
    
  .cr-Render-frame
    border 0
    flex 1
    
  .cr-Render-frame.is-canceled
    pointer-events none
    -webkit-touch-callout none
    -webkit-user-select none
    -khtml-user-select none
    -moz-user-select none
    -ms-user-select none
    user-select none
</style>

<template>
    <cr-spinner v-if="loading"></cr-spinner>
    <iframe v-el="render" v-class="is-canceled: disabled" src="/render/{{room.name}}?ts={{room.reload ? room.ts : ''}}" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true" class="cr-Render-frame"></iframe>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        loading: true,
        disabled: false,
        room: {}
      }
    },
    props: [
      { name: 'room', type: Object }
    ],
    ready: function () {
      var _this = this;
      window.addEventListener('mousedown', this.disableMouse);
      this.$$.render.onload = function () {
        _this.loading = false;
      }
    },
    methods: {
      disableMouse: function () {
        this.disabled = true;
        window.addEventListener('mouseup', this.enableMouse);
      },
      enableMouse: function () {
        this.disabled = false;
        window.removeEventListener('mouseup', this.enableMouse);
      }
    },
    watch: {
      'room.ts': function () {
        this.loading = true;
      }
    }
  };
</script>