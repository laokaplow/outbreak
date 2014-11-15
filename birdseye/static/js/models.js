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


// better way to do this: wrap Traceroute in TracerouteView
var Traceroute = Backbone.Collection.extend({
  model: Endpoint,

  el: null,

  initialize: function (options) {
    this.id = options.id;
    this.color = options.color;
    this.markers = []
    this.path = null;
    this.highlight = null;
    this.focused = false;
    this.hidden = false;

    this.el = $(".ip-list-template").clone(true, true)
      .removeClass("ip-list-template").appendTo("#ip_container");

    this.el.find(".par").append(this.id);
    this.el.find(".badge").after($(".loading-template")
        .clone(true, true).removeClass("loading-template"));
    this.el.attr("id", this.id);

    _.bindAll(this, "drawRoute");
    _.bindAll(this, "drawFailedRoute");
    _.bindAll(this, "removeRoute");
    _.bindAll(this, "focusRoute");
    _.bindAll(this, "unfocusRoute");
    _.bindAll(this, "hideRoute");
    _.bindAll(this, "unhideRoute");
    _.bindAll(this, "zoomRoute");
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

      if(a.city == "") var city_name = "unknown location";
        else var city_name = a.city;

      self.markers.push(new google.maps.Marker({
        position: c,
        map: map,
        title: city_name,
        color: self.color
      }));

      coords.push(c);
    });

    this.el.find(".spinner").remove();
    this.el.find(".badge").append(this.markers.length);
    this.el.find(".badge").css("background-color", this.color);
    this.el.find(".badge").before(
        "<span class='icon remove-route glyphicon glyphicon-remove'></span>");
    this.el.find(".badge").before(
        "<span class='icon hide-route glyphicon glyphicon-eye-open'></span>");

    this.path = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: self.color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        optimized: false,
        zIndex: 3
    });

    this.highlight = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: self.color,
        strokeOpacity: 0.3,
        strokeWeight: 9,
        optimized: false,
        zIndex: 3
    });

    this.path.setMap(map);
    google.maps.event.addListener(this.path, 'mouseover', function() {
      if (!self.focused && !self.hidden)
        self.showHighlight(map);
    });

    google.maps.event.addListener(this.path, 'mouseout', function() {
      if (!self.focused && !self.hidden)
        self.hideHighlight(map);
    });

    google.maps.event.addListener(this.highlight, 'mouseover', function() {
      if (!self.focused && !self.hidden)
        self.showHighlight(map);
    });

    google.maps.event.addListener(this.highlight, 'mouseout', function() {
      if (!self.focused && !self.hidden)
        self.hideHighlight(map);
    });

    this.el.on("mouseover", function() {
      if (!self.focused && !self.hidden)
        self.showHighlight(map);
    });

    this.el.on("mouseout", function() {
      if (!self.focused && !self.hidden)
        self.hideHighlight(map);
    });

  },

  drawFailedRoute: function () {
    this.el.find(".spinner").remove();
    this.el.find(".badge").append("Failed!");
    this.el.find(".badge").before(
        "<span class='icon remove-route glyphicon glyphicon-remove'></span>");
  },

  removeRoute: function () {
    if (this.path)
      this.path.setMap(null);

    if (this.highlight)
      this.highlight.setMap(null);

    if (this.markers) {
      for (var i = 0; i < this.markers.length; i++)
        this.markers[i].setMap(null);
    }

    this.el.remove();
  },

  focusRoute: function (map) {
    this.focused = true;
    this.zoomRoute(map);
  },

  unfocusRoute: function (map) {
    this.focused = false;
  },

  hideRoute: function (map) {
    this.path.setMap(null);
    this.highlight.setMap(null);
    for (var i = 0; i < this.markers.length; i++)
      this.markers[i].setMap(null);
    this.el.find(".hide-route").first().removeClass("glyphicon-eye-open");
    this.el.find(".hide-route").first().addClass("glyphicon-eye-close");
    this.hidden = true;
  },

  unhideRoute: function (map) {
    this.path.setMap(map);
    this.highlight.setMap(map);
    for (var i = 0; i < this.markers.length; i++)
      this.markers[i].setMap(map);
    this.el.find(".hide-route").first().removeClass("glyphicon-eye-close");
    this.el.find(".hide-route").first().addClass("glyphicon-eye-open");
    this.hidden = false;
  },

  zoomRoute: function (map) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++)
      bounds.extend(this.markers[i].position);
    map.fitBounds(bounds);
  },

  showHighlight: function (map) {
    if (this.highlight != null) {
      this.highlight.setMap(map);
      this.path.setOptions({ zIndex: 4 });
      this.highlight.setOptions({ zIndex: 4 });
    }
  },

  hideHighlight: function (map) {
    if (this.highlight != null) {
      this.highlight.setMap(null);
      this.path.setOptions({ zIndex: 3 });
      this.highlight.setOptions({ zIndex: 3 });
    }
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

