<style lang="stylus">
  cr-view
    flex-grow 1
</style>

<template>
  <div v-component="{{view}}" params="{{params}}"></div>
</template>

<script>
  module.exports = {
    paramAttributes: ['view', 'params'],
    data: function () {
      return {
        view: '',
        params: {}
      };
    }
  };
</script>