from __future__ import absolute_import
from birdseye.api.traceroute import Traceroute

from flask import Flask, render_template, send_from_directory

from flask.ext import restful


app = Flask(__name__)
api = restful.Api(app)


# Main entrypoint into our app
@app.route("/")
def root():
    return render_template("birdseye.html", js_path='/static/js',
            css_path='/static/css', lib_path='/static/lib')


# Static file path for javascript
@app.route('/static/js/<path:filename>')
def static_js(filename):
    return send_from_directory(app.root_path + '/static/js/', filename)


# Static file path for css
@app.route('/static/css/<path:filename>')
def static_css(filename):
    return send_from_directory(app.root_path + '/static/css/', filename)


# Static file path for external JS libraries
@app.route('/static/lib/<path:filename>')
def static_lib(filename):
    return send_from_directory(app.root_path + '/lib/bower_components/', filename)


api.add_resource(Traceroute, '/traceroute/<string:dest>')
