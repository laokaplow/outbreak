/**
 * @file: models.js
 */

var Endpoint = Backbone.Model.extend({
  defaults: {
    city: "",
    country: "",
    ip: "",
    lat: 0.0,
    lon: 0.0,
    loss: "",
    ping: "",
    region: ""
  },

  initialize: function () {
  }
});


var Traceroute = Backbone.Collection.extend({
  model: Endpoint,

  initialize: function (options) {
    this.id = options.id;
    this.color = options.color;
    this.markers = []
    this.path = null;
    this.highlight = null;

    _.bindAll(this, "drawRoute");
    _.bindAll(this, "showHighlight");
    _.bindAll(this, "hideHighlight");
  },

  url: function () {
    return "/traceroute/" + this.id;
  },

  parse: function (resp) {
    return resp.destinations;
  },

  drawRoute: function (map) {
    var self = this;
    var coords = [];

    this.each(function (obj) {
      var a = obj.attributes;
      var c = new google.maps.LatLng(a.lat, a.lon);

      self.markers.push(new google.maps.Marker({
        position: c,
        map: map,
        title: obj.cid,
        color: self.color
      }));

      coords.push(c);
    });

    this.path = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: self.color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        optimized: false,
        zIndex: 50
    });

    this.highlight = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: self.color,
        strokeOpacity: 0.3,
        strokeWeight: 7,
        optimized: false,
        zIndex: 50
    });

    this.path.setMap(map);
    google.maps.event.addListener(this.path, 'mouseover', function() {
      self.showHighlight(map);
    });

    google.maps.event.addListener(this.path, 'mouseout', function() {
      self.hideHighlight(map);
    });
  },

  showHighlight: function (map) {
    this.highlight.setMap(map);
  },

  hideHighlight: function (map) {
    this.highlight.setMap(null);
  }

});


/*
var Pcap = Backbone.Model.extend({
  defaults: {
   packets: 0,
   filter: ""
  }
});
*/

