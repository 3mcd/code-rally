var racer = require('racer');
var http = require('superagent');

window.Promise = require('es6-promise').Promise;

var cache = {};

function get(uri) {
  var deferred = 'object' == typeof cache[uri] ?
    Promise.resolve(cache[uri]) :
      new Promise(function (resolve, reject) {
        http.get('/model/' + uri).end(function (err, res) {
          resolve(res);
        });
      })
      .then(resolveModel)
      .then(modelAdder(uri));

  return deferred;
}

function resolveModel(res) {
  var data = JSON.parse(res.text);
  return racer.createModel(data);
}

function modelAdder(uri) {
  return function (model) {
    cache[uri] = model;
    return model;
  };
}

module.exports = {
  get: get
};