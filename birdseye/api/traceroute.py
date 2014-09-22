from flask.ext import restful

class Traceroute(restful.Resource):
    def get(self, dest): 
        return {'destination': dest }
