"""
file: traceroute.py
desc: TODO
"""

from subprocess import check_output, PIPE
from netaddr import IPAddress


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

        addr = {
            "ip": endpoint[1],
            "loss": endpoint[2],
            "ping": endpoint[3]
        }
        ip_list.append(addr)

    return ip_list

if __name__ == "__main__":
    import sys
    print run_traceroute(sys.argv[1])
