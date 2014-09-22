require.config({
  paths: {
    "jquery": "static/lib/jquery/jquery",
    "underscore": "libs/underscore/underscore-min",
    "backbone": "libs/backbone/backbone-min"
  },
  shim: {
    "backbone": {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    }
  }
});

require(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
  test();
});
