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
      { "hue": "#b2d4ff" },
      { "saturation": 30 },
      { "lightness": 10 }
    ]
  },{
    "featureType": "landscape.natural.landcover",
    "stylers": [
      { "hue": "#d4ffb2" },
      { "saturation": 30 },
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
      { "hue": "#eaddcc"},
      { "visibility": "simplified" },
      { "saturation": 50 },
      { "lightness": -3 }
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
    zoom: 12,
    center: chico,
    mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID,
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  var styleMapOptions = {
    name: 'custom_style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styleMapOptions);
  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

google.maps.event.addDomListener(window, 'load', initialize);

// Button controls for hiding and expending the "about" panel.
var hide_about = document.getElementById("collapse_button");
var submit_button = document.getElementById("submit_button");
var ip_panel = document.getElementById("ip_panel");
var ip_input = document.getElementById("search_field");

var ip_counter = 0;


function test() {
  var button_toggled = false;
  $(document).ready(function(){
    $('#collapse_button').click(function(){
      if (!button_toggled){
        $('#ip_panel').animate({
         'left' : '-=188px'
        });
        button_toggled = true;
      }
      else{
        $('#ip_panel').animate({
         'left' : '+=188px'
        });
        button_toggled = false;
      }
    });
    $('#submit_button').click(function(){
      var text = ip_input.value;
      ip_input.value = "";
      $('#ip_list').append("<div class=\"ip\">" + text + "<input class=\"remove_button\" type=\"button\" value=\"x\"></div>");

      $('.remove_button').click(function(){
        $(this).parent().remove();
        $(this).remove();
      });
    });
  });
}
