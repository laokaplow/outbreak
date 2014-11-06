/**
 * @file: main.js
 */


(function ($) {

  var route = new Traceroute([], {id:'google.com'});
  route.fetch();

  var pcap = new Pcap("10", "tcp");
  pcap.print();
  var app = new AppView;
})(jQuery);
