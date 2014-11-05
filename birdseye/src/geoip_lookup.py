"""
file: geoip_lookup.py
desc: TODO
"""

import requests
import json


def geoip_lookup(ip_list):
    geoip_list = []

    if ip_list is None or not ip_list:
        return geoip_list

    for ip in ip_list:
        r = requests.get("http://freegeoip.net/json/" + ip["ip"])
        if r.status_code == 404:
            continue
        json_object = json.loads(r.text)
        geoip = dict(ip)
        geoip["lon"] = json_object["longitude"]
        geoip["lat"] = json_object["latitude"]
        geoip["country"] = json_object["country_name"]
        geoip["region"] = json_object["region_name"]
        geoip["city"] = json_object["city"]
        geoip_list.append(geoip)
    return geoip_list
