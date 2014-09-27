"""
file: traceroute.py
desc: TODO
"""

from subprocess import check_output, PIPE
from re import findall


def run_traceroute(dest):
    """
    Takes in a destination IP address and execs the traceroute
    program on the system. May take up to 5 seconds per
    traceroute (default timeout). IPs are gathered into a listwith quick
    and dirty regex, all other info (name, ping, etc) is discarded.
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
    hops.pop(0)

    return hops
