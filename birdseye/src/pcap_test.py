#!/usr/bin/python
import subprocess
import sys

pcapProcess=subprocess.Popen(["sudo", "./pcap", "", "5000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE) 

while True:
       nextLine = pcapProcess.stdout.readline()
       if nextLine == '' and pcapProcess.poll() != None:
           break
       sys.stdout.write(nextLine)
       sys.stdout.flush()
