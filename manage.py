"""
name: manage.py
desc: A set of commands to make our lives easier.
    HOW TO RUN: python ./manage.py <command>
    COMMANDS:
        python ./manage.py runserver
        python ./manage.py cleanpyc
"""


from flask.ext.script import Manager
from birdseye.application import app
import os


manager = Manager(app)


@manager.command
def runserver():
    """ Runs the flask server """
    app.run(host="0.0.0.0", debug=True, threaded=True)


@manager.command
def cleanpyc():
    """ Removes all those yucky .pyc files """
    print "Recursivley cleaning up .pyc files..."
    os.system("find . -name '*.pyc' -exec rm -rf {} \;")
    print "Done."


if __name__ == "__main__":
    manager.run()
