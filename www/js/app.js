//app.js

var app= {
    db:null,
	version:'1.0',
	loadRequirements:0,
	init: function(){
		//document.addEventListener("deviceready", app.onDeviceReady);
		document.addEventListener("DOMContentLoaded", app.onDomReady);
	},
	onDeviceReady: function(){
		//app.loadRequirements++;
		//if(app.loadRequirements === 2){
			//app.start();
		//}
	},
	onDomReady: function(){
		//app.loadRequirements++;
		//if(app.loadRequirements === 2){
			app.start();
		//}
	},
	start: function(){
		app.createdb();
		app.fillpeople();
		//app.filloccasions();
	
		//connect to database
		//build the lists for the main pages based on data
		//add button and navigation listeners
	},
	createdb: function(){
		app.db = openDatabase('giftr','','Giftr',1024*1024);
		
		if(app.version == ''){
			console.log('First time running... create tables'); 
			//means first time creation of DB
			//increment the version and create the tables
			app.db.changeVersion('', app.version,
					function(trans){
						//something to do in addition to incrementing the value
						//otherwise your new version will be an empty DB
						console.log("DB version incremented");
						//do the initial setup
								//create some table(s)
								//add stuff into table(s)
						trans.executeSql('CREATE TABLE people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name TEXT)', [], 
										function(tx, rs){
											//do something if it works
											console.log("Table people created");
										},
										function(tx, err){
											//failed to run query
											console.log( err.message);
										});
										
						trans.executeSql('INSERT INTO people(person_name) VALUES(?)', ["Paul"], 
										function(tx, rs){
											//do something if it works, as desired   
											console.log("Added row in people");
										},
										function(tx, err){
											//failed to run query
											console.log( err.message);
										});
						trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)', [], 
										function(tx, rs){
											//do something if it works
											console.log("Table occ created");
										},
										function(tx, err){
											//failed to run query
											console.log( err.message);
										});
										
						trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', ["Christmas"], 
										function(tx, rs){
											//do something if it works, as desired   
											console.log("Added row in occ");
										},
										function(tx, err){
											//failed to run query
											console.log( err.message);
										});
						
						trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea TEXT, purchased TEXT)', [], 
										function(tx, rs){
											//do something if it works
											console.log("Table gift created");
										},
										function(tx, err){
											//failed to run query
											console.log( err.message);
										});
					},
					function(err){
						//error in changing version
						//if the increment fails
						console.log( "Change version call error " + err.message);
					},
					function(){
						//successfully completed the transaction of incrementing the version number   
								app.version = '1.0';
								console.log("Change version function worked.");
					});
		}else{
			//version should be 1.0
			//this won't be the first time running the app
			console.log("DB has previously been created");
			console.log('Version:' + app.version)   ;
		}
	},
	fillpeople: function(){
        document.querySelector("#people-list").style.display="block";
        document.querySelector("#occasion-list").style.display="none";
        document.querySelector("#gifts-for-person").style.display="none";
        document.querySelector("#gifts-for-occasion").style.display="none";
        
        var ul = document.querySelectorAll('[data-role=listview]')[0];
        ul.innerHTML = "";
        
        app.db.transaction(function(trans){
        trans.executeSql("SELECT person_name FROM people", [],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = i;
							 li.innerHTML = rs.rows.item(i).person_name;
							 ul.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
                });
            });		
		
			var hammertime = new Hammer.Manager(ul);	
			var swipeRight = new Hammer.Tap({event: 'swiperight' });
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			hammertime.add([doubleTap, singleTap, swipeRight]);
			doubleTap.requireFailure('singletap');

			hammertime.on('swiperight', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.filloccasions(ev);
			});

			hammertime.on('singletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				//app.view(ev);
			});
			hammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				//app.map(ev);
			});
	},
	filloccasions: function(){
        document.querySelector("#people-list").style.display="none";
        document.querySelector("#occasion-list").style.display="block";
        document.querySelector("#gifts-for-person").style.display="none";
        document.querySelector("#gifts-for-occasion").style.display="none";
        
        var ul = document.querySelectorAll('[data-role=listview]')[1];
        ul.innerHTML = "";
        
        app.db.transaction(function(trans){
        trans.executeSql("SELECT occ_name FROM occasions", [],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = i;
							 li.innerHTML = rs.rows.item(i).occ_name;
							 ul.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
                });
        });
		var hammertime = new Hammer.Manager(ul);	
		var swipeLeft = new Hammer.Tap({event: 'swipeleft' });
		var singleTap = new Hammer.Tap({ event: 'singletap' });
		var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
		hammertime.add([doubleTap, singleTap, swipeRight]);
		doubleTap.requireFailure('singletap');

		hammertime.on('swipeleft', function(ev) {
			ev.preventDefault();
			console.log(ev);
			app.fillpeople(ev);
		});

		hammertime.on('singletap', function(ev) {
			ev.preventDefault();
			console.log(ev);
			//app.view(ev);
		});
		hammertime.on('doubletap', function(ev) {
			ev.preventDefault();
			console.log(ev);
			//app.map(ev);
		});
	}
}
app.init();