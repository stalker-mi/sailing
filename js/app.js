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


var db = window.openDatabase("Dummy_DB", "1.0", "Just a Dummy DB", 200000); //will create database Dummy_DB or open it
db.transaction(populateDB, errorCB, successCB);

function populateDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS boats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, number TEXT, len INTEGER)');
	//tx.executeSql('INSERT INTO SoccerPlayer(Name,Club) VALUES ("Alexandre Pato", "AC Milan")');
	//tx.executeSql('INSERT INTO SoccerPlayer(Name,Club) VALUES ("Van Persie", "Arsenal")');
}
 
    //function will be called when an error occurred
    function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }
 
    //function will be called when process succeed
    function successCB() {
        db.transaction(queryDB,errorCB);
    }
 
    //select all from SoccerPlayer
    function queryDB(tx){
        tx.executeSql('SELECT * FROM boats',[],querySuccess,errorCB);
    }
    
    function querySuccess(tx,result){
		//console.log(result);
	}

$(document).on('click', '.back_to_boats', function (e) {
	if($('#new_boat_name').val() == ""){
		app.notification.create({
			title: 'Error',
			text: 'Please provide boat name',
			closeTimeout: 2000
		}).open();
	}
	else{
		save_boat();
	}
});


function save_boat(){
	db.transaction(
		function(tx){
			tx.executeSql('INSERT INTO boats(name,number,len) VALUES ("'+$('#new_boat_name').val()+'", "'+$('.sail_number').val()+'", "'+$('.boat_length').val()+'")');
		},
		errorCB);
	get_boats(function(){
		//app.router.back()
		app.router.navigate('/boats/');
	});
}

// get all boats
var boats = [];
get_boats();
function get_boats(callback){
	boats = [];
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM boats',[],function(tx,results){
			for (var i=0; i<results.rows.length; i++){
				boats.push(results.rows.item(i));
			}
			if(callback){
				callback();
			}
		 },errorCB);
	 },errorCB);
}
