"""
file: test_pcap.py
desc: TESTS FILE
"""
import unittest

from birdseye.src import core


class TestPCap(unittest.TestCase):

    def test_pcap_0_packets(self):
        return_value = core.pcap_test.pcap_funct("0", "")
        self.assertTrue((return_value == 0))

    def test_pcap_500_packets(self):
        return_value = core.pcap_test.pcap_funct("500", "")
        self.assertTrue((return_value == 0))

    def test_pcap_no_filter(self):
        return_value = core.pcap_test.pcap_funct("", "10")
        self.assertTrue((return_value == 0))

    def test_pcap_bad_char_filter(self):
        return_value = core.pcap_test.pcap_funct("hf9wg", "10")
        self.assertTrue((return_value == 1))

    def test_pcap_bad_int_filter(self):
        return_value = core.pcap_test.pcap_funct("923840", "10")
        self.assertTrue((return_value == 1))

    def test_pcap_bad_int_num_filter(self):
        return_value = core.pcap_test.pcap_funct("9fwou23840", "10")
        self.assertTrue((return_value == 1))

    def test_pcap_bad_special_char_filter(self):
        return_value = core.pcap_test.pcap_funct("&@*@!%*@()", "10")
        self.assertTrue((return_value == 1))

    def test_pcap_bad_mixed_filter(self):
        return_value = core.pcap_test.pcap_funct("(%123647hd#@ z 9fwo u23840%)", "10")
        self.assertTrue((return_value == 1))

    def test_pcap_simple_filter(self):
        return_value = core.pcap_test.pcap_funct("tcp", "10")
        self.assertTrue((return_value == 0))

    def test_pcap_test_tcp_ip_filter(self):
        return_value = core.pcap_test.pcap_funct("tcp or ip", "10")
        self.assertTrue((return_value == 0))

    def test_pcap_port_filter(self):
        return_value = core.pcap_test.pcap_funct("port 53", "10")
        self.assertTrue((return_value == 0))

    def test_pcap_test_port_complex_filter(self):
        return_value = core.pcap_test.pcap_funct("(tcp or ip) and not port 53", "10")
        self.assertTrue((return_value == 0))

if __name__ == '__main__':
    unittest.main()
