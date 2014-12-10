"""
file: application.py
desc: TODO
"""

from flask import Flask, render_template, send_from_directory
from flask.ext import restful
from birdseye.src import core


app = Flask(__name__)
api = restful.Api(app)


@app.route("/")
def root():
    """ Entrypoint to application """
    return render_template("birdseye.html", js_path='/static/js',
            css_path='/static/css', lib_path='/static/lib',
            image_path='/static/images')


@app.route('/static/js/<path:filename>')
def static_js(filename):
    """ Static file path for javascript """
    return send_from_directory(app.root_path + '/static/js/', filename)


@app.route('/static/css/<path:filename>')
def static_css(filename):
    """ Static file path for css """
    return send_from_directory(app.root_path + '/static/css/', filename)


@app.route('/static/lib/<path:filename>')
def static_lib(filename):
    """ Static file path for external libraries """
    return send_from_directory(app.root_path + '/lib/bower_components/', filename)


@app.route('/static/images/<path:filename>')
def static_img(filename):
    """ Static file path for images """
    return send_from_directory(app.root_path + '/static/images/', filename)


class Traceroute(restful.Resource):
    def get(self, dest):
        """ TODO """
        ip_list = core.traceroute.run_traceroute(dest)
        geoip_response = core.geoip.geoip_lookup(ip_list)
        return { 'destinations': geoip_response }


api.add_resource(Traceroute, '/traceroute/<string:dest>')


class Pcap(restful.Resource):
    def get(self, pack, pFilter):
        capture_list = core.pcap_test.pcap_funct(pack, pFilter)
        return { 'capture_list': capture_list }


api.add_resource(Pcap, '/pcap_test/<string:pack>/<string:pFilter>')
