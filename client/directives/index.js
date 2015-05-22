/**
 * Vue Directives
 */
var _ = require('lodash');
var Vue = require('vue');

_.forOwn({
  'live-text': require('./live-text'),
  'racer-sync': require('./racer-sync')
}, function (value, key) {
  Vue.directive(key, value);
});