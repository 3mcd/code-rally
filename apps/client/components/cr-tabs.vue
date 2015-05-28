<style lang="stylus">
  .cr-Tabs
    font-size 0
    position relative
    z-index 1

  .cr-Tabs > button
    background #aaa
    border 0
    color #fff
    font-size 12px
    font-weight 200
    outline 0
    &:hover
      background #bbb
    &:last-child
      margin-left 3px

  .cr-Tabs > button.is-active
    background #f0f0f0
    color #0084c5
    margin-top -2px
    border-top 2px solid #0084c5

  .cr-Tabs > button.is-active + button.is-active
    padding-left 0
    &:hover
      color #ff0040
</style>

<template>
  <div class="cr-Tabs">
    <template v-repeat="tab:tabs">
      <button v-on="click: change(tab.ref)" v-class="is-active: tab.ref == active">{{tab.name}}.{{tab.ext}}</button>
      <button v-on="click: removeTab(tab.ref)" v-if="tab.ref == active" v-class="is-active: tab.ref == active">x</button>
    </template>
    <button v-on="click: addTab">+</button>
  </div>
</template>

<script>
  var _ = require('lodash');
  
  module.exports = {
    paramAttributes: ['tabs'],
    data: function () {
      return {
        active: null,
        previous: null,
        tabs: [],
        history: []
      };
    },
    methods: {
      addTab: function () {
        this.$dispatch('tab:add', this);
      },
      removeTab: function (ref) {
        this.history = _.filter(this.history, function (x) {
          return x !== ref;
        });
        this.$dispatch('tab:remove', ref);
        this.$dispatch('tab:change', this.history.length > 0 ? this.history.pop() : _.find(this.tabs, function (x) {
          return x !== ref;
        }));
      },
      change: function (ref) {
        this.$dispatch('tab:change', ref);
        this.active = ref;
      },
      select: function (ref) {
        this.active = ref;
      },
      activeUpdate: function (newVal, oldVal) {
        this.history.push(newVal);
      }
    },
    watch: {
      'active': 'activeUpdate'
    }
  };
</script>