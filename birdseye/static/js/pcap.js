/**
 * @file: pcap.js
 */

print = function() {
 
 console.log("Num packets: " + this._packets);
 console.log("filter string: " + this._filter_string);

}

$('#monitoring_button').click(function() {
 Pcap("10", "tcp");
 Pcap.prototype.print();
}
