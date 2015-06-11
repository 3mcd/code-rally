<style lang="stylus">
  cr-tabs
    position relative
    z-index 1
    display table

  cr-tabs > button
    background-color #aaa
    border 0
    color #fff
    font-weight 200
    outline 0
    &:hover
      background-color #bbb
    &:last-child
      margin-left 3px

  cr-tabs > button.is-active
    background-color #e9e9e9
    color #0084c5
    border-top 2px solid #0084c5
    
  cr-tabs > button.is-important
    border-top 2px solid #2fbcb2

  cr-tabs > button.is-important.is-active
    color #2fbcb2

  cr-tabs > button.is-active + button.is-active
    padding-left 0
    &:hover
      color #ff0040
</style>

<template>
  <template v-repeat="tabs">
    <button v-on="click: change(ref)" v-class="is-active: ref == active, is-important: important">{{name}}.{{ext}}</button>
    <button v-on="click: removeTab(ref)" v-if="ref == active" v-class="is-active: ref == active, is-important: important">x</button>
  </template>
  <button v-on="click: addTab">+</button>
</template>

<script>
  var _ = require('lodash');
  
  module.exports = {
    props: ['tabs'],
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