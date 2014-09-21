from __future__ import absolute_import
from birdseye.api.traceroute import Traceroute

from flask import Flask, render_template
from flask.ext import restful

app = Flask(__name__, static_folder="static")
api = restful.Api(app)

@app.route("/")
def root():
    return render_template("outbreak.html") 

api.add_resource(Traceroute, '/traceroute/<string:dest>')
