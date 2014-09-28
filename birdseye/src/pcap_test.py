#!/usr/bin/python
import subprocess


out = subprocess.Popen(["sudo", "./pcap"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

for line in iter(out.stdout.readline, ''):
	print line.rstrip()

for line in iter(out.stderr.readline, ''):
	print line.rstrip()
