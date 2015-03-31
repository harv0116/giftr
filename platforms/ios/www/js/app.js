//app.js

var app= {
    db:null,
	version:'1.0',
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
		app.createdb();
		app.fillpeople();
		//app.filloccasions();
	
		//connect to database
		//build the lists for the main pages based on data
		//add button and navigation listeners
	},
	opendb: function(){
		app.db = opendatabase('giftr','','Giftr',1024*1024);
	},
	createdb: function(){
		if(app.version == ''){
			output('First time running... create tables'); 
			//means first time creation of DB
			//increment the version and create the tables
			app.db.changeVersion('', app.version,
					function(trans){
						//something to do in addition to incrementing the value
						//otherwise your new version will be an empty DB
						output("DB version incremented");
						//do the initial setup
								//create some table(s)
								//add stuff into table(s)
						trans.executeSql('CREATE TABLE people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name TEXT)', [], 
										function(tx, rs){
											//do something if it works
											output("Table people created");
										},
										function(tx, err){
											//failed to run query
											output( err.message);
										});
										
						trans.executeSql('INSERT INTO people(person_name) VALUES(?)', ["Paul"], 
										function(tx, rs){
											//do something if it works, as desired   
											output("Added row in people");
										},
										function(tx, err){
											//failed to run query
											output( err.message);
										});
						trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)', [], 
										function(tx, rs){
											//do something if it works
											output("Table occ created");
										},
										function(tx, err){
											//failed to run query
											output( err.message);
										});
										
						trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', ["Christmas"], 
										function(tx, rs){
											//do something if it works, as desired   
											output("Added row in occ");
										},
										function(tx, err){
											//failed to run query
											output( err.message);
										});
					},
					function(err){
						//error in changing version
						//if the increment fails
						output( "Change version call error " + err.message);
					},
					function(){
						//successfully completed the transaction of incrementing the version number   
								output("Change version function worked.")
					});
		}else{
			//version should be 1.0
			//this won't be the first time running the app
			output("DB has previously been created");
			output('Version:' + app.version)   ;
		}
	},
	fillpeople: function(){
        document.querySelector("#people-list").style.display="block";
        document.querySelector("#occasion-list").style.display="none";
        document.querySelector("#gifts-for-person").style.display="none";
        document.querySelector("#gifts-for-occasion").style.display="none";
        
        var ul = document.querySelectorAll("[data-role=listview]")[0];
        ul.innerHTML = "";
        
        app.db.transaction(function(trans){
        trans.executeSql("SELECT person_name FROM people", [],
                function(tx, rs){
                         var len = results.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = i;
							 li.innerHTML = results.rows.item(i);
							 ul.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
                });
            });
	},
	filloccasions: function(){
        document.querySelector("#people-list").style.display="none";
        document.querySelector("#occasion-list").style.display="block";
        document.querySelector("#gifts-for-person").style.display="none";
        document.querySelector("#gifts-for-occasion").style.display="none";
        
        //trans.executeSql("SELECT occ_name FROM occasions", [], app.occSuccess, app.transErr);

	},
	occSuccess: function (trans, results){
	/*	var len2 = results.rows.length;
		var ul2 = document.querySelectorAll(["data-role=listview"])[1];
		for (var i=0; i<len2; i++) {
			// display one occ_name 
			var li2 = document.createElement("li");
			li2.dataset.ref = i;
			li2.innerHTML = results.rows.item(i);
			ul2.appendChild(li2);
		}	
	*/
	},
	transErr: function (err) {
		console.info (err.message);
	}
	
}

app.init();