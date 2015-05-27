var roomId = document.querySelector('script').getAttribute('data-room-id');
var Vue = require('vue');
var service = require('../model-service');

window.Loader = require('./module-loader');

var app = new Vue(require('./components/cr-render.vue')).$mount('#app');

service.get('rooms/' + roomId)
  .then(function (model) {
    app.room = model.get('_page.room');
  });

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}