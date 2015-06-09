var _ = require('lodash');

function findLang(langs, name) {
  return _.find(langs, function (x) {
    return x.mime == name || x.name == name || x.ext == name;
  });
}

module.exports = {
  find: findLang
};