"""
name: manage.py
desc: A set of commands to make our lives easier.
    HOW TO RUN: python ./manage.py <command>
    COMMANDS:
        python ./manage.py runserver
        python ./manage.py cleanpyc
        python ./manage.py env
"""


from flask.ext.script import Command, Manager, Option
from birdseye.application import app
import os


manager = Manager(app)


@manager.command
def runserver():
    app.run(host="0.0.0.0", debug=True, threaded=True)


@manager.command
def cleanpyc():
    print "Recursivley cleaning up .pyc files..."
    os.system("find . -name '*.pyc' -exec rm -rf {} \;")
    print "Done."


@manager.command
def env():
    print "Starting virtualenv..."
    os.system(". ./birdseye/lib/python_modules/bin/activate")


if __name__ == "__main__":
    manager.run()
