<style lang="stylus">
  cr-tabs
    position relative
    z-index 1
    display table

  cr-tabs > a
    background-color #aaa
    border 0
    color #fff
    font-weight 200
    outline 0
    transition none
    cursor pointer
    padding 0 0.4em
    &:hover
      background-color #bbb
    &:last-child
      margin-left 3px

  cr-tabs > a.is-selected
    background-color #e9e9e9
    color #0084c5
    border-top 2px solid #0084c5
    
  cr-tabs > a.is-important
    border-top 2px solid #2fbcb2

  cr-tabs > a.is-important.is-selected
    color #2fbcb2

  cr-tabs > a.is-selected + a.is-selected
    padding-left 0
    &:hover
      color #ff0040
</style>

<template>
  <template v-repeat="tabs">
    <a v-on="click: change(ref)" v-class="is-selected: ref == active, is-important: important">{{name}}.{{ext}}</a>
    <a v-on="click: removeTab(ref)" v-if="ref == active" v-class="is-selected: ref == active, is-important: important">x</a>
  </template>
  <a v-on="click: addTab">+</a>
</template>

<script>
  var _ = require('lodash');
  
  module.exports = {
    props: [
      { name: 'tabs', type: Array }
    ],
    data: function () {
      return {
        active: null,
        tabs: [],
        history: []
      };
    },
    methods: {
      addTab: function () {
        this.$dispatch('tab:add', this);
      },
      removeTab: function (ref) {
        var _this = this;

        var selected = _.find(this.tabs, function (x) {
          return x.ref === ref;
        });

        var selectedIndex = this.tabs.indexOf(selected) || 1;

        this.history = _.filter(this.history, function (x) {
          return x !== ref;
        });

        this.$dispatch('tab:remove', ref);
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