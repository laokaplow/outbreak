/**
 * @file: main.js
 */


(function ($) {

  var route = new Traceroute([], {id:'google.com'});
  route.fetch();

  var app = new AppView;
})(jQuery);
