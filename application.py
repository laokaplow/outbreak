from flask import Flask, render_template
app = Flask(__name__, static_folder="static")

@app.route("/")
def root():
    return render_template("outbreak.html") 

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

