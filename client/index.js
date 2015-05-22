var Vue = require('vue');
var http = require('superagent');
var racer = require('racer');
var modelProxy = require('./racer-model-proxy');

require('./directives');
require('codemirror/addon/mode/loadmode');
require('codemirror/mode/meta');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/css/css');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');

var app = require('./components/cr-app.vue');

http.get('/model/home').end(function (err, res) {
  var data = JSON.parse(res.text);
  var model = window.model = racer.createModel(data);
  var room = window.room = modelProxy(model.at('_page.room'));
  app.data = {
    room: room
  };
  var cr_app = new Vue(app).$mount('#app');
});