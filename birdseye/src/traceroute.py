#!/usr/bin/env python

from subprocess import check_output, PIPE
from re import findall


def traceroute(dest):
    """
    Finds IP adresses along route to dest.
    Shells out to existing 'traceroute' program on system.
    May take up to 5 seconds per traceroute (default timeout).
    IPs are gathered with quick and dirty regex,
    all other info (like name, ping) is discarded.
    """

    raw_result = check_output(
        ['traceroute', '-n', str(dest)],
        stdin=None,
        stderr=PIPE,  # stops subprocess from writting its stderr to our own
        shell=False
    )

    # extract IP adresses
    ipv4_pattern = r"(\d+\.\d+\.\d+\.\d+)"  # close enough for our purpose
    hops = findall(ipv4_pattern, raw_result)

    return hops

if __name__ == '__main__':
    import sys
    # run traceroute on all given arguments
    for dest in sys.argv[1:]:
        print "{}: {}".format(dest, traceroute(dest))
