#!/usr/bin/python
import subprocess


out = subprocess.Popen(["sudo", "./pcap", "tcp or ip", "50"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

for line in iter(out.stdout.readline, ''):
    print line.rstrip()

for line in iter(out.stderr.readline, ''):
    print line.rstrip()
