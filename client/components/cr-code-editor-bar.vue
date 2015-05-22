<style lang="stylus">
  .cr-CodeEditorBar
    color #f00
</style>

<template>
  <div class="cr-CodeEditorBar">
    <select v-on="change : onModeChange" v-model="mode">
      <option value="text/html">html</option>
      <option value="text/javascript">js</option>
      <option value="text/css">css</option>
    </select>
  </div>
</template>

<script>
  module.exports = {
    ready: function () {
      this.select = this.$el.querySelector('select');
    },
    methods: {
      onModeChange: function (e) {
        this.$data.$model.set('mode', this.select.value);
      }
    }
  };
</script>