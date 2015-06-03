<style lang="stylus">
  cr-panels
    display flex
    height 100%
</style>

<template>
  <content></content>
</template>

<script>
  module.exports = {
    props: ['direction'],
    data: function () {
      return {
        direction: 'row'
      }
    },
    methods: {
      updateDirection: function (value) {
        this.$el.style.flexDirection = value;
      }
    },
    watch: {
      'direction': 'updateDirection'
    }
  };
</script>