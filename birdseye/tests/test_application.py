"""
file: test_application.py
desc: TODO
"""

import os, unittest, tempfile
from birdseye.application import app


class FlaskTests(unittest.TestCase):
    def test_get_static_js(self):
        tempfile.tempdir = app.root_path + '/static/js/'
        f = tempfile.NamedTemporaryFile()
        with app.test_client() as c:
            r = c.get('static/js/' + os.path.basename(f.name))
            self.assertEqual(r._status_code, 200,
                'Error: could not retrieve file from static js path')

    def test_get_static_css(self):
        tempfile.tempdir = app.root_path + '/static/css/'
        f = tempfile.NamedTemporaryFile()
        with app.test_client() as c:
            r = c.get('static/css/' + os.path.basename(f.name))
            self.assertEqual(r._status_code, 200,
                'Error: could not retrieve file from static css path')

    def test_get_static_lib(self):
        tempfile.tempdir = app.root_path + '/lib/bower_components/'
        f = tempfile.NamedTemporaryFile()
        with app.test_client() as c:
            r = c.get('static/lib/' + os.path.basename(f.name))
            self.assertEqual(r._status_code, 200,
                'Error: could not retrieve file from static js lib path')

if __name__ == "__main__":
    unittest.main()
