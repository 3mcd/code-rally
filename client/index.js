var Vue = require('vue');
var http = require('superagent');
var racer = require('racer');
var modelProxy = require('./racer-model-proxy');

require('./directives');

var appOptions = require('./components/cr-app.vue');

http.get('/model/home').end(function (err, res) {
  var data = JSON.parse(res.text);
  var model = window.model = racer.createModel(data);
  var store = window.store = modelProxy(model.at('_page.store'));
  appOptions.data = store;
  var app = new Vue(appOptions).$mount('#app');
});

