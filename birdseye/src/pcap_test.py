#!/usr/bin/python
import subprocess
import sys


def pcap_funct(filter, packets):

    pcapProcess = subprocess.Popen(["sudo", "./birdseye/src/pcap", filter, packets],
                  stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    listOfIps = []
    i = 0
    while True:
        nextLine = pcapProcess.stdout.readline()
        listOfIps.insert(i, nextLine)
        if nextLine == '' and pcapProcess.poll() is not None:
            break
        sys.stdout.write(nextLine)
        sys.stdout.flush()
        i += 1
    print pcapProcess.returncode
    return pcapProcess.returncode
    # return listOfIps
