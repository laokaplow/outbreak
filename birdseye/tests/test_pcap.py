"""
file: test_pcap.py
desc: TESTS FILE
"""
import unittest

from birdseye.src import core

class TestPCap(unittest.TestCase):

    def test_pcap_0_packets(self):
        packets = "0"
        return_value = core.pcap_test.pcap_funct(packets)
        self.assertTrue((return_value == 0)

if __name__ == '__main__':
    unittest.main()
