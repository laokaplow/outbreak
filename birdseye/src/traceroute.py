"""
file: traceroute.py
desc: TODO
"""

from subprocess import check_output, PIPE
from netaddr import IPAddress

class Address:
    def __init__(self, ip, loss, ping):
        self.ip = ip
        self.loss = loss
        self.ping = ping

def run_traceroute(dest):
    report = check_output(
        ['mtr', '-wb4n', '-o LA', str(dest)],
        stdin=None,
        stderr=PIPE,
        shell=False
    )

    ip_list = []
    report = report.split('\n')[2:-1]
    for endpoint in report:
        endpoint = endpoint.split()
        if endpoint[2] == "100%":
            continue
        elif endpoint[1] == "???" or not endpoint:
            continue
        elif IPAddress(endpoint[1]).is_private():
            continue
        addr = Address(
            endpoint[1],
            endpoint[2],
            endpoint[3],
        )
        ip_list.append(addr.__dict__)

    return ip_list 

if __name__ == "__main__":
    import sys
    print run_traceroute(sys.argv[1])

