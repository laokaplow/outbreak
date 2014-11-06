#!/usr/bin/python
import subprocess
import sys
from array import array

def pcap_funct(packets, filter):
    pcapProcess = subprocess.Popen(["sudo", "./pcap", filter, packets], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    arrayofIps = array('i')
    i = 0
    while True:
        nextLine = pcapProcess.stdout.readline()
        arrayofIps[i] = nextLine
        if nextLine == '' and pcapProcess.poll() is not None:
            break
        sys.stdout.write(nextLine)
        sys.stdout.flush()
        i+=1
    print pcapProcess.returncode
    return pcapProcess.returncode
pcap_funct("10", "tcp")
