<style lang="stylus">

</style>

<template>
  <style v-repeat="room.editors | filterBy 'text/css' in 'mode'">
    {{{text}}}
  </style>
  <template v-repeat="room.editors | filterBy 'text/html' in 'mode'">
    {{{text}}}
  </template>
</template>

<script type="text/javascript">
  module.exports = {
    data: function () {
      return {
        room: {
          name: '',
          main: '',
          editors: [],
          ts: 0
        }
      }
    },
    computed: {
      js: function () {
        return this.room.editors.filter(function (x) {
          return x.mode == 'text/javascript';
        });
      }
    },
    watch: {
      'room.ts': 'jsUpdate'
    },
    methods: {
      jsUpdate: function () {
        var injected = Array.prototype.slice.call(document.querySelectorAll('[data-injected]'));

        for (var i = 0; i < injected.length; i++) {
          injected[i].parentElement.removeChild(injected[i]);
        }

        var g = document.createElement('script');
        var s = document.getElementsByTagName('script')[0];

        g.text = '\n;(function(loader) {\n\n';
        
        g.setAttribute('data-injected', true);

        window.require = null;

        for (var i = 0; i < this.js.length; i++) {
          g.text += '  loader.define("' + this.js[i].name + '", function (module, require) {\n'
          g.text += this.js[i].text.split('\n').map(function (x) {
            return '    ' + x;
          }).join('\n') + '\n';
          g.text += '  });\n\n'
        }

        g.text += '}(window.loader));\n';

        s.parentNode.insertBefore(g, s);

        if (this.room.main)
          window.loader.require(this.room.main);
      }
    }
  };
</script>