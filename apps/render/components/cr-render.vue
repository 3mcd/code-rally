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
  var _ = require('lodash');
  
  function uuid() {
      var d = new Date().getTime();
      return 'xxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
  };

  module.exports = {
    data: function () {
      return {
        room: {
          name: '',
          main: '',
          ts: 0
        },
        editors: []
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
        var _this = this;

        var loaderId = 'loader$' + uuid(); 
        var injected = Array.prototype.slice.call(document.querySelectorAll('[data-injected]'));

        for (var i = 0; i < injected.length; i++) {
          injected[i].parentElement.removeChild(injected[i]);
        }

        var g = document.createElement('script');
        var s = document.getElementsByTagName('script')[0];

        g.text = '\n;(function(' + loaderId + ') {\n\n';
        
        g.setAttribute('data-injected', true);

        window.require = null;

        for (var i = 0; i < this.js.length; i++) {
          g.text += '  ' + loaderId + '.define("' + this.js[i].name + '", function (exports, require, module) {\n'
          g.text += this.js[i].text.split('\n').map(function (x) {
            return '    ' + x;
          }).join('\n') + '\n';
          g.text += '  });\n\n'
        }

        g.text += loaderId + '.require("' + _.find(this.room.editors, function (x) { return x.id == _this.room.main; }).name + '");\n\n';

        g.text += '}(new window.Loader()));\n';

        s.parentNode.insertBefore(g, s);
      }
    }
  };
</script>