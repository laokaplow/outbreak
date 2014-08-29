#include <stdio.h>
#include <pcap.h>

void packet_handler(u_char *param, const struct pcap_pkthdr *header, const u_char *pkt_data);

int main()
{
	
  pcap_t *handle; 
  char *device;
  struct bpf_program filter_program;
  char filter_expression[] = "tcp";
  bpf_u_int32 mask;
  bpf_u_int32 net;
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

  if(pcap_findalldevs(&all_devices, errbuf) < 0) {
    printf("Error in findalldevs: %s\n", errbuf);
  }

  for(d = all_devices; d; d = d->next) {
 //  printf("%d  %s\n", ++i, d->name);
   if(strcmp(d->name, "any") == 0) {
     printf("Found any\n");
     device = d->name;
   }  
  }
  
  if((handle = pcap_open_live(device, 100, 1, 1000, errbuf)) == NULL) {
    printf("error in open_live %s\n", errbuf);
    return;
  }
  
  packet = pcap_next(handle, &packet_header);
  printf("Here's packet length: %d\n", packet_header.len);
  
  if((dump_file = pcap_dump_open(handle, "./file.pcap")) == NULL) {
    printf("Error opening dump file!\n");
    return;  
  }
 
  pcap_loop(handle, 0, packet_handler, (unsigned char *) dump_file);

  return 0;

}

void packet_handler(u_char *dumpfile, const struct pcap_pkthdr *header, const u_char *pkt_data)
{ 
  pcap_dump(dumpfile, header, pkt_data);
}
