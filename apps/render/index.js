var roomId = document.querySelector('script').getAttribute('data-room-id');
var Vue = require('vue');
var service = require('../model-service');

window.Loader = require('./module-loader');

var app = new Vue(require('./components/cr-render.vue')).$mount('#app');

service.get('rooms/' + roomId)
  .then(function (model) {
    app.room = model.get('_page.room');
  });