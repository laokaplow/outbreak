from flask.ext import restful
import birdseye.src.core as core


class Traceroute(restful.Resource):
    def get(self, dest):
        return {'destination': core.traceroute(dest)}
