/**
 * @file: views.js
 */


var AppView = Backbone.View.extend({
  el: $('body'),
  initialize: function () {
    this.manualRoutesView = new ManualRoutesView;
  }
});

/*
var MonitoringView = Backbone.View.extend({
  el: $('#monitoring_button'),
  initialize: function () {
    console.log("Here!");
  },
  render: function() {
  }


});
*/

var ManualRoutesView = Backbone.View.extend({
  el: $('#manual_routes'),
  initialize: function () {
  },
  render: function () {
  }
});

