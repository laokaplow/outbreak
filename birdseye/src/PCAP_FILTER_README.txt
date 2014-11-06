So here's the filter README ya'll have been eagerly demanding and I've long promised to
deliver. So without further ado I will live up to that promise. 

Anyways, capture filtering basics.

Note that this is "CAPTURE FILTERING". Thus, this capturing is done at, imagine that,
capture time. Thus, any packets that do not meet the criteria of the filter will not,
well, be captured. Think if it as a fishnet, and if your net strings are to big,
you won't capture the little fish and they'll happily swim right through. Same with
pcap capture filtering. If you don't have a tight enough filter, it won't capture
what you want. 

To put it simply, it is not a display filter, NOR does it use display filter syntax.


There are three basic ways to filter packets. We can filter on 'type', which would
allos you to filter on groovy things such as "host" "port" number
and "portrange".

We can also filter on direction. Source packets "src", destination packets "dst". 

Finally there is the capibility of filtering based on protocol, such as  tcp, ip, ether
udp, arp, decnet, fddi--whatever that is-- ect..ect..

Anyways, here are some sample filters:

Example 1: "tcp"
 --Simple as it gets. It grabs all tcp packets. This is an example of a protocol filter.

Example 2: "tcp or ip"
 --Notice we can use logical or, and "and", ect.

Example 3: src "128.8.8.42"
 --This will caputure all packets coming from "128.8.8.42"

Example 4: src or dst "128.42.42.42"
 --This will capture all packets coming from or going to "128.42.42.42".

Example 5: "portrange 6000-7000"
 --Captures all packets that come into these ports. Example of a "type" filter.


Of course we can come up with some pretty complex expressions using 
ands and or's and what not. As an example, here's one from the Wireshark wiki:

 (tcp dst port 135 or tcp dst port 4444 or udp dst port 69) and ip[2:2]==48

And yeah. Here's some useful links for more infor on capture filtering:

http://wiki.wireshark.org/CaptureFilters

http://www.tcpdump.org/manpages/pcap-filter.7.html
