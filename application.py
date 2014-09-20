from flask import Flask, render_template
from flask.ext import restful

from api.traceroute import Traceroute

app = Flask(__name__, static_folder="static")
api = restful.Api(app)

@app.route("/")
def root():
    return render_template("outbreak.html") 

api.add_resource(Traceroute, '/traceroute/<string:dest>')

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, threaded=True)

