// Dom7
var $ = Dom7;
// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: 'auto',
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
});


function GoogleMap(){
	this.initialize = function(){
		var map = showMap();
	}

	var showMap = function(){
		var mapOptions = {
		zoom: 9,
		center: new google.maps.LatLng(41.0669484, 29.0122383),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
		}
		var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		return map;
	}
}

function initMap(){
	var map = new GoogleMap();
	map.initialize();
}

