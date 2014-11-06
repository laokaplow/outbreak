/**
 * @file: models.js
 */


var Endpoint = Backbone.Model.extend({
  defaults: {
    lat: 0.0,
    lon: 0.0,
    ip: ""
  }
});

var Pcap = Backbone.Model.extend({
  defaults: {
   packets: 0,
   filter: ""
  }
});

var Traceroute = Backbone.Collection.extend({
  model: Endpoint,
  initialize: function (models, options) {
    this.id = options.id;
  },
  url: function () {
    return "/traceroute/" + this.id;
  },
  parse: function (resp) {
    console.log("Woo!");
    console.log(resp);
  }
});
