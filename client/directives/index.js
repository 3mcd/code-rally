/**
 * Vue Directives
 */
var _ = require('lodash');
var Vue = require('vue');

var directives = {
  'live-text': require('./live-text'),
  'racer-sync': require('./racer-sync')
};

_.forOwn(directives, function (value, key) {
  Vue.directive(key, value);
});