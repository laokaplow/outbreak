"""
file: test_geoip_lookup.py
desc: TODO
"""

import unittest, mock, json
from birdseye.src import core


class TestGeoIP(unittest.TestCase):
    def setUp(self):
        self.invalid_list = [
            { "ip": "invalid_ip_xyz" },
            { "ip": "herpaderpa_imaIP" }
        ]
        self.somevalid_list = [
            { "ip": "123ipyoup" },
            { "ip": "google.com" }
        ]
        self.valid_list = [
            { "ip": "google.com" },
            { "ip": "reddit.com" }
        ]
        self.base_url = "http://freegeoip.net/json/"
        self.empty_geoip = json.dumps({
            "longitude": "",
            "latitude": "",
            "country_name": "",
            "region_name": "",
            "city": ""
        })

    def test_none_ip_list(self):
        ret = core.geoip.geoip_lookup(None)
        self.assertTrue(ret == [])

    def test_empty_ip_list(self):
        ret = core.geoip.geoip_lookup([])
        self.assertTrue(ret == [])

    @mock.patch("requests.get")
    def test_invalid_ip_list(self, patched_get):
        r = mock.Mock(status_code=404)

        patched_get.side_effect = [r, r]
        ret = core.geoip.geoip_lookup(self.invalid_list)

        self.assertTrue(patched_get.call_count == 2)
        self.assertTrue(ret == [])

    @mock.patch("requests.get")
    def test_somevalid_ip_list(self, patched_get):
        bad_r = mock.Mock(status_code=404)
        good_r = mock.Mock(status_code=200, text=self.empty_geoip)

        patched_get.side_effect = [bad_r, good_r]
        ret = core.geoip.geoip_lookup(self.somevalid_list)

        self.assertTrue(patched_get.call_count == 2)
        self.assertTrue(len(ret) == 1)

    @mock.patch("requests.get")
    def test_valid_ip_list(self, patched_get):
        good_r = mock.Mock(status_code=200, text=self.empty_geoip)

        patched_get.side_effect = [good_r, good_r]
        ret = core.geoip.geoip_lookup(self.valid_list)

        expected = [
            mock.call(self.base_url + self.valid_list[0]["ip"]),
            mock.call(self.base_url + self.valid_list[1]["ip"])
        ]

        self.assertTrue(patched_get.call_args_list == expected)
        self.assertTrue(patched_get.call_count == 2)
        self.assertTrue(len(ret) == 2)


if __name__ == "__main__":
    unittest.main()
