/**
 * @file: views.js
 */


var AppView = Backbone.View.extend({
  el: $('body'),
  initialize: function () {
    this.manualRoutesView = new ManualRoutesView;
  }
});

var ManualRoutesView = Backbone.View.extend({
  el: $('#manual_routes'),
  initialize: function () {
  },
  render: function () {
  }
});

