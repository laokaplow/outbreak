/**
 * @file: views.js
 */


var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    "click #search_field": "emptyAddRouteField",
    "click #submit_button": "startTraceroute"
  },

  initialize: function () {
    this.traceroutes = [];
    this.googlemapView = new GoogleMapView;

    _.bindAll(this, "startTraceroute");
    _.bindAll(this, "removeTraceroute");
    _.bindAll(this, "handleRouteClick");
  },

  emptyAddRouteField: function () {
    $("#search_field").val("");
  },

  startTraceroute: function () {
    var self = this;

    var id = $("#search_field").val();

    // Need to add, if ID exists in this.tracerouts RETURN

    var r = new Traceroute({
      id: id,
      color: randomColor()
    });

    r.el.on("click", ".remove-route", function () {
      self.removeTraceroute(r);
    });

    r.el.on("click", ".hide-route", function () {
      if (!r.hidden)
        r.hideRoute(self.googlemapView.map);
      else
        r.unhideRoute(self.googlemapView.map);
    });

    r.fetch({
      success: function () {
        r.drawRoute(self.googlemapView.map);
        r.el.on("click", r.el, function (e) {
          self.handleRouteClick(r, e);
        });
      },
      error: function () {
        r.drawFailedRoute();
      }
    });
    this.traceroutes.push(r);
  },

  removeTraceroute: function (r) {
    r.removeRoute();

    var index = this.traceroutes.indexOf(r);
    if (index > -1)
      this.traceroutes.splice(index, index+1)
  },

  handleRouteClick: function (r, e) {
    if ($(e.target).hasClass("remove-route"))
      return;

    if ($(e.target).hasClass("hide-route"))
      return;

    if (!r.focused) {
      r.focusRoute(this.googlemapView.map);
      r.el.find("a").first().addClass("focus");
    }
    else if (r.focused) {
      r.unfocusRoute(this.googlemapView.map);
      r.el.find("a").first().removeClass("focus");
    }
  }

});


var GoogleMapView = Backbone.View.extend({
  el: $('#map_canvas'),
  initialize: function () {
    this.featureOpts = [
      {
        "featureType": "water",
        "stylers": [
          { "hue": "#a7c5bd" },
          { "lightness": -50},
          { "saturation": -60}
        ]
      },
      {
        "featureType": "landscape.natural.landcover",
        "stylers": [
          { "hue": "#eb7b59" },
          { "saturation": 0 },
          { "lightness": 0 }
        ]
      },
      {
        "featureType": "administrative.locality",
        "stylers": [
          { "visibility": "on" }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "road.highway",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "landscape.natural",
        "stylers": [
          { "hue": "#eb7b59"},
          { "visibility": "simplified" },
          { "saturation": 70 },
          { "lightness": 10 }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ];

    this.mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(40.6,-95.665),
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, "custom_style"]
      },
      mapTypeId: "custom_style",
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.$el.get(0), this.mapOptions);
    this.customMapType = new google.maps.StyledMapType(this.featureOpts, { name: "custom_style" });
    this.map.mapTypes.set("custom_style", this.customMapType);
  }
});
