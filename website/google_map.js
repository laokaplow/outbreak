var map;
var chico = new google.maps.LatLng(39.728494, -121.837478);

var MY_MAPTYPE_ID = 'custom_style';

function initialize() {

	var featureOpts = [
	{
    "featureType": "water",
    "stylers": [
      { "hue": "#ff0000" },
      { "saturation": -100 },
      { "lightness": -50 }
    ]
  },{
    "featureType": "landscape.natural.landcover",
    "stylers": [
      { "saturation": -100 },
      { "lightness": 58 }
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
      { "visibility": "simplified" },
      { "saturation": -100 },
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

var hide_about = document.getElementById("collapse_button");
var about_div = document.getElementById("about_pannel");
var expend_about = document.getElementById("expend_button");

hide_about.onclick = function() {
  about_div.style.visibility = "hidden";
}

expend_about.onclick = function() {
  about_div.style.visibility = "visible";
}

