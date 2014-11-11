/**
 * @file: views.js
 */


var AppView = Backbone.View.extend({
  el: $('body'),

  events: {
    "click #submit_button": "startTraceroute"
  },

  initialize: function () {
    this.traceroutes = [];
    this.routeslistview = new RoutesListView;
    this.googlemapView = new GoogleMapView;

    _.bindAll(this, "startTraceroute");
    _.bindAll(this, "drawTraceroute");
  },

  startTraceroute: function () {
    var self = this;
    var r = new Traceroute({
      id: $("#search_field").val(),
      color: randomColor()
    });

    r.fetch({
      success: function () {
        r.drawRoute(self.googlemapView.map);
      },
      fail: function () {
        console.log("Traceroute failed");
      }
    });
    this.traceroutes.push(r);
  }
});


var RoutesListView = Backbone.View.extend({
  el: $('#manual_routes'),
  initialize: function () {
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
