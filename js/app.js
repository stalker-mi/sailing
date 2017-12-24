// Dom7
var $ = Dom7;
// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: 'auto',
  data: function () {
    return {
      data_fields: [
			{value: 'cog', name: 'COG'},
			{value: 'drift', name: 'Drift'},
			{value: 'gps_accuracy', name: 'GPS Accuracy'},
			{value: 'heading', name: 'Heading'},
			{value: 'heel', name: 'Heel', field: 1},
			{value: 'distance', name: 'Distance', field: 2},
			{value: 'pitch', name: 'Pitch'},
			{value: 'speed_avg', name: 'Speed Avg', field: 3},
			{value: 'sog', name: 'SOG'},
			{value: 'speed_max', name: 'Speed Max'},
			{value: 'elapse_time', name: 'Elapse Time', field: 4},
			{value: 'time_of_day', name: 'Time of Day'},
		]
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

$(document).on('page:init', function (e) {
	if($('#map_canvas').length){
		initMap();
	}
	
});

function initMap(){
	//var map = new GoogleMap();
	//map.initialize();
	var mapOptions = {
		zoom: 9,
		center: new google.maps.LatLng(41.0669484, 29.0122383),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
		}
		var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

var db = window.openDatabase("Dummy_DB", "1.0", "Just a Dummy DB", 200000); //will create database Dummy_DB or open it
db.transaction(populateDB, errorCB);

function populateDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS boats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, number TEXT, len INTEGER)');

}
 
    //function will be called when an error occurred
    function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }

	
function query(sql, args, callback){
	db.transaction(
		function(tx){
			tx.executeSql(sql, args, callback, errorCB);
		},
	errorCB);
}

$(document).on('click', '.edit_boat_button', function (e) {
	app.router.navigate('/boats/edit_boat/'+$(this).closest('a').data('id'));
});

$(document).on('click', '.select_boat', function (e) {
	localStorage.setItem('boat_id', $(this).data('id'));
	$('.my_boat_name').text(boats[$(this).data('id')].name);
	app.router.navigate('/');
});

$(document).on('click', '.insert_boat', function (e) {
	if($('.boat_name').val() == ""){
		app.notification.create({
			title: 'Error',
			text: 'Please provide boat name',
			closeTimeout: 2000
		}).open();
	}
	else{
		query('INSERT INTO boats(name,number,len) VALUES ("'+$('.boat_name').val()+'", "'+$('.sail_number').val()+'", "'+$('.boat_length').val()+'")', [], function(tx,results){
			query('SELECT * FROM boats order by id desc limit 1',[],function(tx,results){
				boats[results.rows.item(0).id] = results.rows.item(0);
				app.router.navigate('/boats/');
			});
		});
	}
});

$(document).on('click', '.update_boat', function (e) {
	if($('.boat_name').val() == ""){
		app.notification.create({
			title: 'Error',
			text: 'Please provide boat name',
			closeTimeout: 2000
		}).open();
	}
	else{
		query('UPDATE boats set name = ?, number = ?,len = ? where id = ?', 
		[$('.boat_name').val(), $('.sail_number').val(), $('.boat_length').val(), $('.boat_id').val()], function(tx,results){
			query('SELECT * FROM boats where id=?',[$('.boat_id').val()],function(tx,results){
				boats[results.rows.item(0).id] = results.rows.item(0);
				app.router.navigate('/boats/');
			});
		});
	}
});

$(document).on('click', '.delete_boat', function (e) {
	query('DELETE FROM boats where id = ?', [$('.boat_id').val()], function(tx,results){
		delete boats[$('.boat_id').val()];
		app.router.navigate('/boats/');
	});
});	

// get all boats
var boats = [];
get_boats(function(){
	var boat_id = localStorage.getItem('boat_id');
	if(boat_id){
		$('.my_boat_name').text(boats[boat_id].name);
	}
});
function get_boats(callback){
	boats = [];
	query('SELECT * FROM boats',[],function(tx,results){
		for (var i=0; i<results.rows.length; i++){
			boats[results.rows.item(i).id] = results.rows.item(i);
		}
		if(callback){
			callback();
		}
	});
}

$(document).on('click', '.st_table .title td', function (e) {
	app.router.navigate('/data_fields/'+$(this).data('id'));
});

