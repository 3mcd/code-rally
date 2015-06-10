var Vue = require('vue');
var Router = require('director').Router;

require('./directives');
require('codemirror/addon/mode/loadmode');
require('codemirror/mode/meta');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/css/css');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');

var app = window.app = new Vue(require('./components/cr-app.vue')).$mount('#app');

var router = new Router().configure();

router.on('/rooms/:name', function (name) {
  app.view = 'room';
  app.params.room = name;
});

function handleLinks(e) {
  var el = e.target;
  for (; el && el !== document.body; el = el.parentElement) {
    if (el.tagName === 'A') {
      e.preventDefault();
      return router.setRoute(el.attributes.href.value);
    }
  }
}

window.addEventListener('click', handleLinks);

router.init();