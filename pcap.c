#include <stdio.h>
#include <string.h>
#include <pcap.h>

void packet_handler(u_char *param, const struct pcap_pkthdr *header, const u_char *pkt_data);

int main(int argc, char* argv[])
{
	
  int OPTIMIZE = 1;
  pcap_t *handle; 
  char *device = NULL;
  struct bpf_program filter_program;    /* Currently Unused */
  char filter_expression[50]; 	
  bpf_u_int32 mask;			/* Currently Unused */
  bpf_u_int32 net;                      /* Currently Unused */
  struct pcap_pkthdr packet_header;
  const u_char *packet;  
  char errbuf[100];  
  pcap_if_t *all_devices, *d;
  int i = 0;
  pcap_dumper_t *dump_file;

 /*   if((device = pcap_lookupdev(errbuf)) == NULL) {       
     printf("Found no device, errorbuf %s\n", errbuf);
    }
 */

  if(argc > 2) {
    printf("Too many arguments!\n");
    return -1;
  }
 
  strcpy(filter_expression, argv[1]);

  if(pcap_findalldevs(&all_devices, errbuf) < 0) {
    printf("Error in findalldevs: %s\n", errbuf);
    return -1;
  }

  for(d = all_devices; d; d = d->next) {
 //  printf("%d  %s\n", ++i, d->name);
   if(strcmp(d->name, "any") == 0) {
    // printf("Found any\n");
     device = d->name;
   }  
  }

  if(device == NULL) {
    printf("No device found!\n");
    return -1;
  } 
  
  if((handle = pcap_open_live(device, 100, 1, 1000, errbuf)) == NULL) {
    printf("Error in pcap_open_live() %s\n", errbuf);
    return -1;
  }

  if(pcap_compile(handle, &filter_program, filter_expression, OPTIMIZE, mask) < 0) {
   pcap_perror(handle, errbuf);
   printf("Error in pcap_compile!, Error: %s\n", errbuf);
   return -1;
   } 
  
   if(pcap_setfilter(handle, &filter_program) < 0) {
     pcap_perror(handle, errbuf);
     printf("Error in pcap_setfilter()!\n Error: %s\n", errbuf);
     return -1;
   }


 /* packet = pcap_next(handle, &packet_header);
  printf("Here's packet length: %d\n", packet_header.len);
 */
 
  if((dump_file = pcap_dump_open(handle, "./file.pcap")) == NULL) {
    printf("Error opening dump file!\n");
    return -1;  
  }
 
  /* Calls packet_handler sub routine to dump packets to file */
  pcap_loop(handle, 0, packet_handler, (unsigned char *) dump_file);

  return 0;

}

void packet_handler(u_char *dumpfile, const struct pcap_pkthdr *header, const u_char *pkt_data)
{ 
  pcap_dump(dumpfile, header, pkt_data);
}
