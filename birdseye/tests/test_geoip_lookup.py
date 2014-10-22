"""
file: test_geoip_lookup.py
desc: TODO
"""
import unittest

from birdseye.src import core


class TestGeoIP(unittest.TestCase):

    def test_single_fake_ip(self):
        ip_collection = ["notAnIP"]
        node_list = core.geoip.geoip_lookup(ip_collection)
        self.assertTrue((node_list[0].ip == "notAnIP") and (node_list[0].lon == "void"))

    def test_list_with_fake_ips(self):
        ip_collection = ["NOPE", "176.32.98.166", "8.8.8.8", "FAKE"]
        node_list = core.geoip.geoip_lookup(ip_collection)
        self.assertTrue((node_list[0].ip == "NOPE") and (node_list[0].lon == "void"))
        self.assertTrue((node_list[1].ip == "176.32.98.166") and (node_list[1].lon == "-97"))
        self.assertTrue((node_list[2].ip == "8.8.8.8") and (node_list[2].lon == "-122.0838"))
        self.assertTrue((node_list[3].ip == "FAKE") and (node_list[3].lon == "void"))

if __name__ == "__main__":
    unittest.main()
