#include <stdio.h>
#include <pcap.h>
#include<netinet/in.h>
#include<sys/types.h>
#include <sys/socket.h>
#include <stdlib.h>

/* Current usage: sudo ./pcap "filter_expression"
   For valid filter expressions, you can use any capture 
   filter expression from Wireshark, TCPDump or LibPcap docs
*/


void packet_handler(u_char *param, const struct pcap_pkthdr *header, const u_char *pkt_data);

#define IP_HL(ip)               (((ip)->ip_vhl) & 0x0f)
#define PACKET_COUNT		500
#define SNAP_LENGTH		50
#define PROMISC			0
#define TIMEOUT			1000

 /* Structure that represents the IP address we grab */
 struct ip_address {
  u_char byte_1;
  u_char byte_2;
  u_char byte_3;
  u_char byte_4;
 } ip_address;



 /*Structure that represents a packet, used to grap IP address.*/
 struct get_ip {
	u_char  ip_vhl;                 /* version << 4 | header length >> 2 */
        u_char  ip_tos;                 /* type of service */
        u_short ip_len;                 /* total length */
        u_short ip_id;                  /* identification */
        u_short ip_off;                 /* fragment offset field */
        #define IP_RF 0x8000            /* reserved fragment flag */
        #define IP_DF 0x4000            /* dont fragment flag */
        #define IP_MF 0x2000            /* more fragments flag */
        #define IP_OFFMASK 0x1fff       /* mask for fragmenting bits */
        u_char  ip_ttl;                 /* time to live */
        u_char  ip_p;                   /* protocol */
        u_short ip_sum;                 /* checksum */
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
  char errbuf[100];  		     /* Error buffer */
  pcap_if_t *all_devices, *d;	     /* Network we're capturing on */
  int network;

  /* No filter results in segfault */
  if(argc < 2) {
   fprintf(stderr, "No filter. If no filter is wanted pass in %c%c.\n", '"', '"');
   exit(1);
  }

  /* Too many arguments also causes issues */
  if(argc > 2) {
   fprintf(stderr, "Error: To many arguments. Filter must be pased in a single string using");
   fprintf(stderr, "%c%c\n", '"', '"');
   fprintf(stderr, "Example: \"tcp or ip\" \n");
   exit(1);
  }

  /* Pass in filter expression argument in quotes, it's much easier. */
  strcpy(filter_expression, argv[1]);
  fprintf(stderr, "Filter Expression: %s\n", filter_expression);  
 
 
  /* Finding devices to sniff on. Returns an array of devices. */
  if(pcap_findalldevs(&all_devices, errbuf) < 0) {
    fprintf(stderr, "Error in findalldevs: %s\n", errbuf);
    exit(1);
  }

  /* Getting the devices to listen on */
  for(d = all_devices; d; d = d->next) {
   if(strcmp(d->name, "any") == 0) {
     device = d->name;
   }  
  }
  
  /* Get the netmask and network number */
  if(pcap_lookupnet(device, &network, &mask, errbuf) == -1) {
    fprintf(stderr, "Couldn't get netmask, %s\n", errbuf);
    network = 0;
    mask    = 0;
  }

  /* Open a pcap session. */
  if((handle = pcap_open_live(device, SNAP_LENGTH, PROMISC, TIMEOUT, errbuf)) == NULL) {
    fprintf(stderr, "Error in open_live %s\n", errbuf);
    exit(1);
  }
   
  /* Compiling the filter. */
  if(pcap_compile(handle, &filter_program, filter_expression, OPTIMIZE, mask) < 0) {
   pcap_perror(handle, errbuf);
   fprintf(stderr, "Error in pcap_compile!, Error: %s\n", errbuf);
   pcap_close(handle);
   exit(1);
   } 

   /* Setting the filter */  
   if(pcap_setfilter(handle, &filter_program) < 0) {
     pcap_perror(handle, errbuf);
     fprintf(stderr, "Error in pcap_setfilter()!\n Error: %s\n", errbuf);
     pcap_close(handle);
     exit(1);
   }
 
  /* Captures packets in a loop. Takes our session, the number of packets we 
     want to capture, and a callback function as arguments. NULL for fourth 
     argument would be a file to write packets to, which we're not using.
     Capture stops when it reaches PACKET_COUNT.
  */
  pcap_loop(handle, PACKET_COUNT, packet_handler, 0);
  
  /* Closing capture session. */
  pcap_close(handle);
  return 0;

}

void packet_handler(u_char *dumpfile, const struct pcap_pkthdr *header, const u_char *pkt_data)
{   

  struct get_ip *ip;               /* IP header */
  
  ip = (struct get_ip*)(pkt_data + 14); /* Get the Header */
 
  printf("%d.%d.%d.%d\n", ip->daddr.byte_1, ip->daddr.byte_2, ip->daddr.byte_3, ip->daddr.byte_4);
   
}
