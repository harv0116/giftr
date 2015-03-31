//app.js

var app= {
	loadRequirements:0,
	init: function(){
		document.addEventListener("deviceready", app.onDeviceReady);
		document.addEventListener("DOMContentLoaded", app.onDomReady);
	},
	onDeviceReady: function(){
		app.loadRequirements++;
		if(app.loadRequirements === 2){
			app.start();
		}
	},
	onDomReady: function(){
		app.loadRequirements++;
		if(app.loadRequirements === 2){
			app.start();
		}
	},
	start: function(){
		app.opendb();
		app.fillpeople();
		app.filloccasions();
	
		//connect to database
		//build the lists for the main pages based on data
		//add button and navigation listeners
	},
	opendb: function(){
		db = opendatabase('giftr','','Giftr',1024*1024);
	},
	fillpeople: function(){
		trans.executeSql("SELECT person_name FROM people", [ ], app.peopleSuccess, app.transErr);
	
	},
	filloccasions: function(){
		trans.executeSql("SELECT occ_name FROM occasions", [ ], app.occSuccess, app.transErr);

	},
	peopleSuccess: function( trans, results){
		var len = results.rows.length;
		var ul = document.querySelectorAll("[data-role=listview]")[0];
		for (var i=0; i<len; i++) {
			// display one person_name 
			var li = document.createElement("li");
			li.dataset.ref = i;
			li.innerHTML = results.rows.item(i);
			ul.appendChild(li);
		}
	},
	occSuccess: function (trans, results){
		var len2 = results.rows.length;
		var ul2 = document.querySelectorAll("[data-role=listview]")[1];
		for (var i=0; i<len2; i++) {
			// display one occ_name 
			var li2 = document.createElement("li");
			li2.dataset.ref = i;
			li2.innerHTML = results.rows.item(i);
			ul2.appendChild(li2);
		}	
	
	},
	transErr: function (err) {
		console.info (err.message);
	}
	
}

app.init();