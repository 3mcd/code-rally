<style lang="stylus">
  cr-panel
    flex-grow 1
</style>

<template>
  <content></content>
</template>

<script>
  module.exports = {
    paramAttributes: ['flex'],
    data: function () {
      return {
        flex: 1
      };
    },
    methods: {
      updateFlex: function (value) {
        this.$el.style.flex = value;
      }
    },
    watch: {
      flex: 'updateFlex'
    }
  };
</script>