/**
 * @file: main.js
 */


(function ($) {

//  var pcap = new Pcap("10", "tcp");
//  pcap.print();

  var app = new AppView;
})(jQuery);


var randomColor = function() {
  var rand = Math.floor(Math.random() * 16777215);
  var hex = rand.toString(16);
  var color = '#' + hex;
  return color;
}
