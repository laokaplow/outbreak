#!/usr/bin/python
import subprocess
import sys

def pcap_funct(packets, filter):
    pcapProcess = subprocess.Popen(["sudo", "./pcap", filter, packets], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    while True:
        nextLine = pcapProcess.stdout.readline()
        if nextLine == '' and pcapProcess.poll() is not None:
            break
        sys.stdout.write(nextLine)
        sys.stdout.flush()
    print pcapProcess.returncode
    return pcapProcess.returncode
#pcap_funct("10")
