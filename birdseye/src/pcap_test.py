#!/usr/bin/python
import subprocess
import sys

def pcap_funct(packets):
    pcapProcess = subprocess.Popen(["sudo", "./pcap", "", packets], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    while True:
        nextLine = pcapProcess.stdout.readline()
        if nextLine == '' and pcapProcess.poll() is not None:
            break
        sys.stdout.write(nextLine)
        sys.stdout.flush()
    return pcapProcess
#pcap_funct("10")
