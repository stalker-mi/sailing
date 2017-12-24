// Dom7
var $ = Dom7;
// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: 'auto',
  data: function () {
    return {
      data_fields: [],
      data_fields_active: []
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
	tx.executeSql('CREATE TABLE IF NOT EXISTS data_fields (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL, name TEXT, lang_id INTEGER)');
	query('SELECT * FROM data_fields',[],function(tx,results){
		if (results.rows.length == 0) {
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("cog", "COG", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("drift", "Drift", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("gps_accuracy", "GPS Accuracy", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("heading", "Heading", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("heel", "Heel", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("distance", "Distance", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("pitch", "Pitch", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("speed_avg", "Speed Avg", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("sog", "SOG", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("speed_max", "Speed Max", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("elapse_time", "Elapse Time", "1")');
			tx.executeSql('INSERT INTO data_fields(value,name,lang_id) VALUES ("time_of_day", "Time of Day", "1")');
		}
	});
	tx.executeSql('CREATE TABLE IF NOT EXISTS data_fields_selected (id INTEGER PRIMARY KEY, field INTEGER)');
	query('SELECT * FROM data_fields_selected',[],function(tx,results){
		if (results.rows.length == 0) {
			tx.executeSql('INSERT INTO data_fields_selected(id,field) VALUES (1, 5)');
			tx.executeSql('INSERT INTO data_fields_selected(id,field) VALUES (2, 6)');
			tx.executeSql('INSERT INTO data_fields_selected(id,field) VALUES (3, 8)');
			tx.executeSql('INSERT INTO data_fields_selected(id,field) VALUES (4, 11)');
		}
	});
}
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
	

// boats 
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

get_data_fields(function(){
	get_data_fields_selected(function(){
		$('.st_table .title td[data-id="1"]').text(app.data.data_fields_active[0].name);
		$('.st_table .title td[data-id="2"]').text(app.data.data_fields_active[1].name);
		$('.st_table .title td[data-id="3"]').text(app.data.data_fields_active[2].name);
		$('.st_table .title td[data-id="4"]').text(app.data.data_fields_active[3].name);
	});
});
function get_data_fields(callback){
	app.data.data_fields = [];
	query('SELECT * FROM data_fields where lang_id = 1',[],function(tx,results){
		for (var i=0; i<results.rows.length; i++){
			app.data.data_fields.push(results.rows.item(i));
		}
		if(callback){
			callback();
		}
	});
}

function get_data_fields_selected(callback){
	app.data.data_fields_active = [];
	query('SELECT df.*, dfs.id as sel_id FROM data_fields df \
	INNER JOIN data_fields_selected dfs ON dfs.field = df.id \
	where df.lang_id = 1',[],function(tx,results){
		for (var i=0; i<results.rows.length; i++){
			app.data.data_fields_active[results.rows.item(i).sel_id-1] = results.rows.item(i);
		}
		if(callback){
			callback();
		}
	});
}


$(document).on('click', '.st_table .title td', function (e) {
	app.router.navigate('/data_fields/'+$(this).data('id'));
});

$(document).on('click', '.select_data_field', function (e) {
	var id = $('.edit_field_id').val();
	var field = $(this).data('id');
	if(app.data.data_fields_active[id-1].id != field){
		query('UPDATE data_fields_selected set field = ? where id = ?', [field, id], function(tx,results){
			get_data_fields_selected(function(){
				app.router.navigate('/');
			});
		});
	}
	else{
		app.router.navigate('/');
	}
	
});
