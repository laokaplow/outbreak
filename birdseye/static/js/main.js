(function ($) {

  var ManualRoutesView = Backbone.View.extend({
    el: $('#manual_routes'),
    initialize: function () {
    },
    render: function () {
    }
  });

  var AppView = Backbone.View.extend({
    el: $('body'),
    initialize: function () {
      this.manualRoutesView = new ManualRoutesView;
      // TODO make these views
      // this.googleMapView = new GoogleMapView;
    }
  });

  var app = new AppView;
})(jQuery);
