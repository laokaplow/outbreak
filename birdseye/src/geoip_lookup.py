"""
file: geoip_lookup.py
desc: TODO
"""

import requests
import json


class Endpoint:
    def __init__(self, ip, lon, lat, country, region, city):
        self.ip = str(ip)
        self.lon = str(lon)
        self.lat = str(lat)
        self.country = str(country)
        self.region = str(region)
        self.city = str(city)


def geoip_lookup(ip_collection):
    node_list = []
    for ip in ip_collection:
        r = requests.get('http://freegeoip.net/json/' + ip)
        # TODO: This errors out if an invalid IP is called. wrap json.loads in a try-"catch"
        json_object = json.loads(r.text)
        node = Endpoint(
            json_object['ip'],
            json_object['longitude'],
            json_object['latitude'],
            json_object['country_name'],
            json_object['region_name'],
            json_object['city']
        )
    node_list.append(node.__dict__)
    return node_list
