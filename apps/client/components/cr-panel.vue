<style lang="stylus">
  cr-panel
    display flex
    flex-grow 1

  cr-panel > component
    flex 1
</style>

<template>
  <content></content>
</template>

<script>
  module.exports = {
    props: ['grow', 'shrink', 'basis', 'direction', 'wrap', 'flex', 'align'],
    data: function () {
      return {
        flex: 1
      };
    },
    methods: {
      updateFlex: function (value) {
        var props = value.toString().split(' ');
        this.grow = props[0] || this.grow;
        this.shrink = props[1] || this.shrink;
        this.basis = props[2] || this.basis;
      },
      updateBasis: function (value) {
        this.$el.style.flexBasis = value;
      },
      updateGrow: function (value) {
        this.$el.style.flex = value;
      },
      updateShrink: function (value) {
        this.$el.style.flexShrink = value;
      },
      updateDirection: function (value) {
        this.$el.style.flexDirection = value;
      },
      updateWrap: function (value) {
        this.$el.style.flexWrap = value;
      },
      updateAlign: function (value) {
        console.log(value);
        this.$el.style.alignItems = value;
      }
    },
    watch: {
      basis: 'updateBasis',
      direction: 'updateDirection',
      grow: 'updateGrow',
      shrink: 'updateShrink',
      wrap: 'updateWrap',
      flex: 'updateFlex',
      align: 'updateAlign'
    }
  };
</script>