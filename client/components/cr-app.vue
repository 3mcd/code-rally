<style lang="stylus">
.cr-App
  color #f00;
</style>

<template lang="jade">
h3 {{name}}
div.cr-App
  div(v-component="cr-code-editor")
input(v-live-text="name", v-racer-sync="name", value="{{name}}")
</template>

<script type="text/javascript">
module.exports = {
  components: {
    'cr-code-editor': require('./cr-code-editor.vue')
  }
};
</script>