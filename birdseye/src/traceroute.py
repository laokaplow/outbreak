"""
  Traceroute.py
  adapted wholesale from https://blogs.oracle.com/ksplice/entry/learning_by_doing_writing_your
  with code from https://github.com/leonidg/Poor-Man-s-traceroute/blob/master/traceroute.py

  could use a lot of work (especially error handeling) ...

  must be run as root
"""

import socket


icmp = socket.getprotobyname('icmp')
udp = socket.getprotobyname('udp')


def create_sockets(ttl):
    """
    Sets up sockets necessary for the traceroute.  We need a receiving
    socket and a sending socket.
    """
    recv_socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, icmp)
    send_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, udp)
    send_socket.setsockopt(socket.SOL_IP, socket.IP_TTL, ttl)
    return recv_socket, send_socket


def traceroute(dest_name, port=33434, max_hops=30):
    route = []
    dest_addr = socket.gethostbyname(dest_name)

    # find route
    for ttl in range(1, max_hops):
        recv_socket, send_socket = create_sockets(ttl)
        recv_socket.bind(("", port))
        send_socket.sendto("", (dest_name, port))
        curr_addr = None
        curr_name = None
        try:
            # socket.recvfrom() gives back (data, address), but we
            # only care about the latter.
            _, curr_addr = recv_socket.recvfrom(512)
            curr_addr = curr_addr[0]  # address is given as tuple
            try:
                curr_name = socket.gethostbyaddr(curr_addr)[0]
            except socket.error:
                curr_name = curr_addr
        except socket.error:
            pass
        finally:
            send_socket.close()
            recv_socket.close()

        # add this leg to our route
        leg = (curr_name, curr_addr if curr_addr is not None else "*")
        route.append(leg)

        # stop traceroute if we have reached the end
        if curr_addr == dest_addr:
            break

        # todo: annotate route with pings
        # todo: annotate route with locations

    return route
