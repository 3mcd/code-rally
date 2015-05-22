<!-- CrApp -->

<style lang="stylus">
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: normal;
    src: local('Source Sans Pro'), url('/fonts/source-sans-pro/SourceSansPro-Regular.otf') format('truetype');
  }
  
  .cr-App
    font-family 'Source Sans Pro'
</style>

<template>
  <div class="cr-App">
    <h3>{{room.name}}</h3>
    <cr-code-editor v-with="room.editors[0]"></cr-code-editor>
  </div>
</template>

<script type="text/javascript">
  module.exports = {
    components: {
      'cr-code-editor': require('./cr-code-editor.vue')
    }
  };
</script>