// Google map script
// Contains the basic style elements for the map.
// Centers the map at Chico on startup.

var map;
var chico = new google.maps.LatLng(39.728494, -121.837478);

var MY_MAPTYPE_ID = 'custom_style';

function initialize() {
  // This is the style options for the google map. You can set up your own and
  // and import the JSON @ http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
  var featureOpts = [
  {
    "featureType": "water",
    "stylers": [
      { "hue": "#a7c5bd" },
      { "lightness": -50},
      { "saturation": -60}
    ]
  },{
    "featureType": "landscape.natural.landcover",
    "stylers": [
      { "hue": "#eb7b59" },
      { "saturation": 0 },
      { "lightness": 0 }
    ]
  },{
    "featureType": "administrative.locality",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "administrative.neighborhood",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road.highway",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.natural",
    "stylers": [
      { "hue": "#eb7b59"},
      { "visibility": "simplified" },
      { "saturation": 70 },
      { "lightness": 10 }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  }
  ];

  var mapOptions = {
    zoom: 3,
    center: chico,
    mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID,
    disableDefaultUI: true
  };

  // Create the map
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  // Assign the syle options
  var styleMapOptions = {
    name: 'custom_style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styleMapOptions);
  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

google.maps.event.addDomListener(window, 'load', initialize);


// Handles to different DOM elements.
var hide_about = document.getElementById("collapse_button");
var submit_button = document.getElementById("submit_button");
var ip_panel = document.getElementById("ip_panel");
var ip_input = document.getElementById("search_field");
var index = 0;

// Array that will hold the cities of the current route
var city_array = [];
// Array that will hold all of the complete path currently displayed
var routes_array = [];

// toggle vriable for the sliding button, not used right now.
//var button_toggled = false;
$(document).ready(function(){

  // Collapse button is not in the page right now, Keeping this code right now
  // if we want to use that functionality later.

  /*$('#collapse_button').click(function(){
    if (!button_toggled){
      $('#ip_panel').animate({
       'left' : '-=191px'
      });
      button_tggled = true;
    }
    else{
      $('#ip_panel').animate({
       'left' : '+=191px'
      });
      button_toggled = false;
    }
  });*/

  var add_route = function(destination) {
    var color = randomColor();
    var call = $.ajax("traceroute/" + destination);
    routes_array.push(new Route(map, destination, index,color, call));
    index++;
  }

  // When the user clicks the 'add' button
  $('#submit_button').click(function() {
    add_route(ip_input.value);
  });

 $('#monitoring_button').click(function() {
   console.log("starting sample packet capture....");
   var call = $.ajax("pcap_test/" + "100/" + "tcp");
   console.log(call);
 });


  $('#sample_button').click(function() {

    console.log("starting sample traceroutes...");
    // Grab the input
    var sample_routes = [
      "yahoo.jp",
      "rtbf.be",
      "nist.gov",
      "whitehouse.gov",
      "amazon.com",
      "google.com",
      "china.org.cn",
      "bbc.com",
      "reddit.com"
    ];

    for(var i = 0; i < sample_routes.length; i++) {
      add_route(sample_routes[i]);
    }
    
  });
});

// City Class
// Used to store and access the data from the ajax call.
var City = function(name, lat, lon, ip, country) {
  this._name = name;
  this._lat = lat;
  this._lon = lon;
  this._ip = ip;
  this._country = country;
}

City.prototype.print = function() {
  console.log("Name: " + this._name);
  console.log("Longitude: " + this._lon);
  console.log("Latitude: " + this._lat);
  console.log("IP: " + this._ip);
  console.log("Country: " + this._country);
  console.log(" ");
}

City.prototype.getName = function() {
  return this._name;
}

City.prototype.getLongitude = function() {
  return this._lon;
}

City.prototype.getLatitude = function() {
  return this._lat;
}

// Route Class
// This class store all of the relavant points for one path. It also creates
// the line with a set color and creates the markers. Path, markers and city points
// are all stored within this class.
var Route = function(map, destination, index, color, call) {
  this._map = map;
  this._cities = [];
  this._color = color;
  this._path;
  this._destination = destination;
  this._index = index;
  this._call = call;

  this._coordinates = [];
  this._markers = [];

  self = this;

  console.log("starting traceroute...");

  // Send ajax request
  this._call

    .done(function(data) { 
      console.log("traceroute finished!");
      // Variable used to check for any duplicate city.
      var last_city = "";

      for(var i = 0; i < data.destinations.length; i++) {
         // Add the city in the array if it is defined and if it is not a duplicate.
        if(data.destinations[i].city != "" && data.destinations[i].city != last_city) {
          self._cities.push(new City(data.destinations[i].city,
          data.destinations[i].lat,
          data.destinations[i].lon,
          data.destinations[i].ip,
          data.destinations[i].country)
        );

        last_city = data.destinations[i].city;
      }
    }

  // create a random color hex value for the path.
  //self._color = randomColor();

  // creates markers and gather coordinates for the path.
  for(var i = 0; i < self._cities.length; i++) {
    var lat = self._cities[i].getLatitude();
    var lon = self._cities[i].getLongitude();

    var city_coord = new google.maps.LatLng(lat,lon);
    self._coordinates.push(city_coord);

    var name = self._cities[i].getName();

    var marker = new google.maps.Marker({
       position: city_coord,
       map: self._map,
       title: name,
       color: self._color
    });

    self._markers.push(marker);
  }

  // create the path.
  var z_index = Math.floor(Math.random()*100);
  self._path = new google.maps.Polyline({
        path: self._coordinates,
        geodesic: true,
        strokeColor: self._color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        optimized: false,
        zIndex: z_index
      });
  // display the path.
  self._path.setMap(self._map);

  console.log("deleting: " + "#loading" + self._index);
  $("#loading" + self._index).remove();
  $("#" + self.destination).append("<img class=\"success\" id=\"success" + self._index + "\" src=\"../static/check.png\" height=\"12\" width=\"12\">")
  })

  .fail(function(data) {
    console.log("traceroute failed.");
  });

  $('#ip_list').append("<div class=\"ip\" id=\"" + self._destination + "\">" + self._destination
    + "<input class=\"remove_button\" id=\"" + self._index +"_remove_button\" type=\"button\" value=\"x\">"
    + "<img class=\"loading\" id=\"loading" + self._index + "\" src=\"../static/loading.gif\" height=\"16\" width=\"16\">"
    + "</div>");

  var button_handle = "#" + self._index + "_remove_button";
  console.log(button_handle);
  if($(button_handle).length) console.log("button_exists!");

  $(button_handle).click(function(){
    console.log("click");
    self.hide();
    $(this).parent().remove();
    $(this).remove();
  });
}

Route.prototype.getDestination = function() {
  return this._destination;
}

// remove the path and markers from the map. It doesn't delete any
// data from the object, it is still possible to switch it back on.
// See the unHide function below.
Route.prototype.hide = function() {
  console.log("hidding route");
  this._path.setMap(null);
  for(var i = 0; i < this._markers.length; i++) {
    this._markers[i].setMap(null);
  }
}

// Re-display the path and markers on the map.
Route.prototype.unHide = function() {
  this._path.setMap(this._map);
  for(var i = 0; i < this._markers.length; i++) {
    this._markers[i].setMap(this._map);
  }
}

// Utility function to create a random hex color.
var randomColor = function() {
  var rand = Math.floor(Math.random() * 16777215);
  var hex = rand.toString(16);
  var color = '#' + hex;

  return color;
}
