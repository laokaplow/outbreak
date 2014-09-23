#! /usr/bin/env python

# This program makes requests to the website: http://freegeoip.net/ Under CreativeCommons 3.0:
# http://creativecommons.org/licenses/by/3.0/legalcode

import requests
import json


class IpNode:
    def __init__(self, ip, lon, lat, country, region, city):
        self.ip = ip
        self.lon = lon
        self.lat = lat
        self.country = country
        self.region = region
        self.city = city

    def __str__(self):
        return ", ".join(map(str, [self.ip, self.lon, self.lat, self.country, self.region, self.city]))


def get_locations(ip_collection):
    node_list = []
    for ip in ip_collection:
        r = requests.get('http://freegeoip.net/json/' + ip)
        # TODO: This errors out if an invalid IP is called. wrap json.loads in a try-"catch"
        json_object = json.loads(r.text)
        node = IpNode(json_object['ip'], json_object['longitude'], json_object['latitude'], 
            json_object['country_name'], json_object['region_name'], json_object['city'])
        node_list.append(node)
    return node_list
