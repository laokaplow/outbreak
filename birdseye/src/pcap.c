#include <stdio.h>
#include <pcap.h>
#include<netinet/in.h>
#include<sys/types.h>
#include <sys/socket.h>
#include <stdlib.h>

/* Current usage: sudo ./pcap (MANDATORY) "FILTER_EXPRESSION" (OPTIONAL) PACKET_COUNT 
   For valid filter expressions, you can use any capture 
   filter expression from Wireshark, TCPDump or LibPcap docs.

   FILTER_EXPRESSION: A mandatory argument. It represents the capture
   filter the session will filter on. See the Wireshark documentation for
   an overview of capture filters, the syntax is the same. 
   
   ***NOTE***
   
   CAPTURE FILTERS != DISPLAY_FILTERS. They are completely different, syntax
   and everything. Make sure you look at CAPTURE_FILTERS. 
   
   ***END NOTE***

   PACKET_COUNT: An optional argument. It is an integer value that 
   represents the number of packets the session will capture before quitting.
   Default value for PACKET_COUNT is 500.
*/


void packet_handler(u_char *param, const struct pcap_pkthdr *header, const u_char *pkt_data);

#define IP_HL(ip)               (((ip)->ip_vhl) & 0x0f)
#define SNAP_LENGTH		50
#define PROMISC			0
#define TIMEOUT			1000

 /* Structure that represents the IP address we grab. */
 struct ip_address {
  u_char byte_1;
  u_char byte_2;
  u_char byte_3;
  u_char byte_4;
 } ip_address;



 /* Structure that represents a packet, used to grap IP address. */
 struct get_ip {
	u_char  ip_vhl;                    /* version << 4 | header length >> 2 */
        u_char  ip_tos;                    /* type of service */
        u_short ip_len;                    /* total length */
        u_short ip_id;                     /* identification */
        u_short ip_off;                    /* fragment offset field */   
        u_char  ip_ttl;                    /* time to live */
        u_char  ip_p;                      /* protocol */
        u_short ip_sum;                    /* checksum */
        struct ip_address source_address;  /* source and dest address */
        struct ip_address daddr;
};

int main(int argc, char* argv[])
{
  int OPTIMIZE = 1;	             /* Optimize code */
  pcap_t *handle;                    /* PCap session */
  char *device;			     /* Device to capture on */
  struct bpf_program filter_program; /* The compiled filter program */
  char filter_expression[500];       /* Our filter expression */
  bpf_u_int32 mask;  		     /* IPv4 netmask of the network */	     
  char errbuf[500];  		     /* Error buffer */
  pcap_if_t *all_devices, *d;	     /* Network we're capturing on */
  int network;
  int PACKET_COUNT = 500; 

  /* 
     Having a mandatory filter argument just makes life easier. Also,
     an uninitialized filter_expression argument is bad, and causes
     undefined bevior (for obvious reasons). It makes life easier because
     if we are to make the filter_expression arg optional, then I need to
     account for the cases of the PACKET_COUNT arg. And I have a headache,
     so, this works just fine. 
  */
  if(argc < 2) {
   fprintf(stderr, "Filter expression MUST be passed in as an argument.!\n");
   fprintf(stderr, "If no filter is wanted simply pass in %c%c.\n", '"', '"');
   exit(1);
  }

  /*
     Pass in filter expression argument in quotes, it's much easier.
     This is assuming that the second argument will ALWAYS be the filter
     expression. I will just go ahead and make that the standard.
  */
  if(argc >= 2) {
    strcpy(filter_expression, argv[1]);
    fprintf(stderr, "Filter Expression: %s\n", filter_expression);  
  }
 
  /*
     Gives us the option to allow the user to specify the numbr of packets
     they want to capture. By default it is 500, regardless of the number
     of arguments passes in. This is assuming that the second arg will 
     ALWAYS be the number of packets we want to capture.
  */
  if(argc >= 3) {
    PACKET_COUNT = atoi(argv[2]); /* Convert to int */
  }
  
  if(PACKET_COUNT <= 0) {
   exit(0);
  }
  /* 
     Finding devices to sniff on. Populates that list on return. 
     
     Return: int. 0 on success -1 on failure.
    
     Args: 
     
       all_devices: Pcap_if_t*, basically a list of devices. Enters the 
                    function as null, returns as a list of devices.
  
       errbuf:      char[]. On return is a char buffer containing the error message, 
                    if any.  
  */
 
  if((pcap_findalldevs(&all_devices, errbuf)) < 0) {
    fprintf(stderr, "Error in pcap_findalldevs().\n Error: %s\n", errbuf);
    exit(1);
  }

  /* 
     Getting the devices to listen on. For now, and for simplicity, I
     just have it listening on "any device". So, right now this is just a 
     placeholder if any specific devices want to be sniffed on...
  */
  for(d = all_devices; d; d = d->next) {
   if(strcmp(d->name, "eth1") == 0) {
     device = d->name;
   }  
  }
  
  /* 
    This finds the IPv4 network number and netmask for the specified device. 
    
    Return: int. 0 on success, -1 on failure.

    Args:

      device:  char*. The device we are sniffing on (default == "any").
      
      network: bpf_u_int32. The network we are sniffing on.  
  
      mask:    bpf_u_int32. The netmask for the network.

      errbuf:  char[]. On return is a char buffer containing the error message, 
               if any.
   */
  if((pcap_lookupnet(device, &network, &mask, errbuf)) < 0) {
    fprintf(stderr, "Error in pcap_lookupnet().\n Error: %s\n", errbuf);
    network = 0;
    mask    = 0;
  }

  /*
     Creates a packet capture handle to sniff packets on the network.
     device is the device we are sniffing on.
   
     Returns: pcap_t. handle or NULL on failure.
   
     Args:
   
      SNAP_LENGTH: int. The length of the snapshot we are getting of the packet.
                   Basically how many bytes of the packet do we want to grab.
   
      PROMISC:     int. 1 == listening on promiscuous mode. 0 == not listening on 
                   promiscuous mode.
   
      TIMEOUT:     int. The read timeout for a packet, in milliseconds.
   
      err:         char[]. Error message on failure.
  */
  if((handle = pcap_open_live(device, SNAP_LENGTH, PROMISC, TIMEOUT, errbuf)) == NULL) {
    fprintf(stderr, "Error in pcap_open_live().\n Error: %s\n", errbuf);
    exit(1);
  }
   
  /* 
     Compiles the char array "filter_expression" into a filter program, 
     "filter_program". 
  
      Returns: int. 0 on success, -1 on failure.

      Args: 
   
       handle:            pcap_t. Our pcap handle for current session.
 
       filter_program:    struct bpf_program. An uninitialized filter_program. 
                          On success is returned as a compiled filter struct.

       filter_expression: char[]. The expression filter as a char array.

       OPTIMIZE:          int. Controls whether optimization on the resulting 
                          filter_program code is performed. 1 == optimize
                          code, 0 == dont optimize code.

       mask:              bpf_u_int32. IPv4 netmask of the network we are 
                          capturing packets on. Apparently it is only checked
                          when checking for IPv4 broadcast addresses in the 
                          filter program.  
  */
  if(pcap_compile(handle, &filter_program, filter_expression, OPTIMIZE, mask) < 0) {
   fprintf(stderr, "Error in pcap_compile().\n Error:\n");
   pcap_perror(handle, errbuf);			/* Get the error message. */
   pcap_close(handle);
   exit(1);
   } 

   /* 
     Sets the compiled filter program into our pcap session.

     Return: int. 0 on success, -1 on failure.

     Args:
      
      handle:         pcap_t. Our pcap session handle.
     
      filter_program: struct bpf_program. Our compiled filter program.
   */  
   if(pcap_setfilter(handle, &filter_program) < 0) {
     fprintf(stderr, "Error in pcap_setfilter(). Error:\n");
     pcap_perror(handle, errbuf);		/* Get the error message. */
     pcap_close(handle);
     exit(1);
   }
 
  /* 
     Captures packets in a loop. Takes our session, the number of packets we 
     want to capture, and a callback function as arguments. NULL for fourth 
     argument would be a file to write packets to, which we're not using.
     Capture stops when it reaches PACKET_COUNT.

     Return: void.

     Args:

      handle:       pcap_t. Our pcap session handle.
     
      PACKET_COUNT: int. Number of packets to capure. Onc reached, the session 
                    stops.
      
      0:            u_char*. Unused.
  */ 
  pcap_loop(handle, PACKET_COUNT, packet_handler, 0);
      
  /* 
     Frees a list of devices used by findalldevs.
    
     Return: void.

     Args:
  
      all_devices: Pcap_if_t*, basically a list of devices to be freed.
  */
  pcap_freealldevs(all_devices);
  
  /* 
     Closing capture session. Closes all files and deallocated session
     resources.
     
     Return: void.

     Args: 

      handle: pcap_t*. Our pcap session.
  */
  pcap_close(handle);
  return 0;

}

/* 
   The callback for pcap_loop() above. 

   Return: void.

   Args:

     dump_file: Unsed. It being there makes the compiler/program happy.
                Can be used to specify a file to dump the data to, if need
                be.
     
     header:    The header of the packet in question.

     pkt_data:  The data of the packet passed in.

*/
void packet_handler(u_char* dump_file, const struct pcap_pkthdr *header, const u_char *pkt_data)
{   

  struct get_ip *ip;               /* IP header */
  
  ip = (struct get_ip*)(pkt_data + 14); /* Get the destination IP address */
 
  /* Print the destination IP to stdout */
  printf("%d.%d.%d.%d,", ip->daddr.byte_1, ip->daddr.byte_2, ip->daddr.byte_3, ip->daddr.byte_4);
   
}
