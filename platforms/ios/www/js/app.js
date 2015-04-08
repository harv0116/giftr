//app.js



var app= {
    db:null,
	version:'1.0',
	loadRequirements:0,
	modal:null,

	initialize: function() {
        
		document.addEventListener("DOMContentLoaded", app.onDomReady());
		document.addEventListener("deviceready",app.onDeviceReady(),false);
    },
	
	onDeviceReady: function(){
		app.loadRequirements++;
		if(app.loadRequirements === 2){
			alert("START");
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
		app.createdb();
		app.fillPeople();
		//app.filloccasions();
	
		//connect to database
		//build the lists for the main pages based on data
		//add button and navigation listeners
	},
	createdb: function(){
		app.db = window.openDatabase('giftr','','Giftr',1024*1024);
		
		if(app.version == ''){
			alert('First time running... create tables'); 
			//means first time creation of DB
			//increment the version and create the tables
			app.db.changeVersion('', app.version,
					function(trans){
						//something to do in addition to incrementing the value
						//otherwise your new version will be an empty DB
						alert("DB version incremented");
						//do the initial setup
								//create some table(s)
								//add stuff into table(s)
						trans.executeSql('CREATE TABLE people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name TEXT)', [], 
										function(tx, rs){
											//do something if it works
											alert("Table people created");
										},
										function(tx, err){
											//failed to run query
											alert( err.message);
										});
										
						trans.executeSql('INSERT INTO people(person_name) VALUES(?)', ["Paul"], 
										function(tx, rs){
											//do something if it works, as desired   
											alert("Added row in people");
										},
										function(tx, err){
											//failed to run query
											alert( err.message);
										});
						trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)', [], 
										function(tx, rs){
											//do something if it works
											alert("Table occ created");
										},
										function(tx, err){
											//failed to run query
											alert( err.message);
										});
										
						trans.executeSql('INSERT INTO occasions(occ_name) VALUES(?)', ["Christmas"], 
										function(tx, rs){
											//do something if it works, as desired   
											alert("Added row in occ");
										},
										function(tx, err){
											//failed to run query
											alert( err.message);
										});
						
						trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea TEXT, purchased TEXT)', [], 
										function(tx, rs){
											//do something if it works
											alert("Table gift created");
										},
										function(tx, err){
											//failed to run query
											alert( err.message);
										});
					},
					function(err){
						//error in changing version
						//if the increment fails
						alert( "Change version call error " + err.message);
					},
					function(){
						//successfully completed the transaction of incrementing the version number   
								app.version = '1.0';
								alert("Change version function worked.");
					});
		}else{
			//version should be 1.0
			//this won't be the first time running the app
			alert("DB has previously been created");
			alert('Version:' + app.version);
		}
	},
	
	fillPeople: function(){
        alert("GOT HERE");
		document.getElementById("people-list").style.display="block";
        document.getElementById("occasion-list").style.display="none";
        document.getElementById("gifts-for-person").style.display="none";
        document.getElementById("gifts-for-occasion").style.display="none";
		alert("GOT HERE 2");
        
		var div = document.getElementById("peoplelist");
		var nameul = document.createElement("ul");
		nameul.setAttribute("data-role","listview");
		
        app.db.transaction(function(trans){
        trans.executeSql("SELECT person_name FROM people", [],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = i;
							 li.innerHTML = rs.rows.item(i).person_name;
							 nameul.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
                });
        });
			
		div.appendChild(nameul);		
		
			var hammertime = new Hammer.Manager(nameul);	
			var swipeRight = new Hammer.Swipe({event: 'swiperight' });
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
				app.giftsforperson(ev);
			});
			hammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.deleteperson(ev);
			});
			document.getElementById("btnAdd").addEventListener("click",function(ev) {
				ev.preventDefault();
				app.modal.document.getElementById("add-person");
				app.overlay.style.display = "block";
				app.modal.style.display = "block";
				app.newperson();
			});
			
			
	},
	filloccasions: function(){
        alert("GOT HERE - holy smokes");
		
		document.getElementById("people-list").style.display="none";
        document.getElementById("occasion-list").style.display="block";
        document.getElementById("gifts-for-person").style.display="none";
        document.getElementById("gifts-for-occasion").style.display="none";
        
		var div2 = document.getElementById("occasionlist");
		var nameul2 = document.createElement("ul");
		nameul2.setAttribute("data-role","listview");
        
        app.db.transaction(function(trans){
        trans.executeSql("SELECT occ_name FROM occasions", [],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = i;
							 li.innerHTML = rs.rows.item(i).occ_name;
							 nameul2.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
                });
        });
		
		var hammertime = new Hammer.Manager(nameul2);	
		var swipeLeft = new Hammer.Swipe({event: 'swipeleft' });
		var singleTap = new Hammer.Tap({ event: 'singletap' });
		var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
		hammertime.add([doubleTap, singleTap, swipeLeft]);
		doubleTap.requireFailure('singletap');

		hammertime.on('swipeleft', function(ev) {
			ev.preventDefault();
			console.log(ev);
			app.fillpeople(ev);
		});

		hammertime.on('singletap', function(ev) {
			ev.preventDefault();
			console.log(ev);
			app.giftsforoccasion(ev);
		});
		hammertime.on('doubletap', function(ev) {
			ev.preventDefault();
			console.log(ev);
			app.deleteoccasion(ev);
		});
		
		document.getElementById("btnAdd2").addEventListener("click",function(ev) {
		ev.preventDefault();
		app.modal.document.getElementById("add-occasion");
		app.overlay.style.display = "block";
		app.modal.style.display = "block";
		app.newoccasion();
		});
	},
	newperson: function() {
	// watch for cancel and save buttons
	// cancel - go back to people
	// save - insert record into database then go back to people
		document.getElementById("CancelP").addEventListener("click",function(ev) {
		ev.preventDefault();
		app.overlay.style.display = "none";
		app.modal.style.display = "none";
		app.fillpeople();
		});
		
		document.getElementById("SaveP").addEventListener("click",function(ev) {
			app.db.changeVersion(app.version, '2.0',
			function(trans){
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
				alert("DB version incremented");
						//add stuff into table(s)
				var name = document.getElementById("new-per").value
								
				trans.executeSql('INSERT INTO people(person_name) VALUES(?)', name, 
					function(tx, rs){
						//do something if it works, as desired   
						alert("Added row in people");
					},
					function(tx, err){
						//failed to run query
						alert( err.message);
					});
		
			});	
		},
		function(err){
			//error in changing version
			//if the increment fails
			alert( "Change version call error " + err.message);
		},
		function(){
			//successfully completed the transaction of incrementing the version number   
					app.version = '2.0';
					alert("Change version function worked.");
		});
		app.overlay.style.display = "none";
		app.modal.style.display = "none";
		app.fillpeople();
	
	},
	giftsforperson: function() {
	// select statement based on gifts per person
	// display LIs
	// set up single double and add button
	// set up back button
	
	},
	deleteperson: function() {
	// delete record from database
	// go back to person screen
		
		idToDelete = '';  // I do not know how to do this!!!!!!  The number has to come from the person list
		
		app.db.transaction(function(trans){
		trans.executeSql('DELETE FROM person WHERE person_id = ?', idToDelete, 
			function(tx, rs){
				//do something if it works, as desired   
				alert("Deleted Row");
			},
			function(tx, err){
				//failed to run query
				alert( err.message);
			});
        }); 
		app.fillPeople();
	},
	newoccasion: function() {
	// watch for cancel and save buttons
	// cancel - go back to occasion
	// save - insert record into database then go back to occ
		document.getElementById("CancelO").addEventListener("click",function(ev) {
		ev.preventDefault();
		app.overlay.style.display = "none";
		app.modal.style.display = "none";
		app.filloccasion();
		});
		
		document.getElementById("SaveO").addEventListener("click",function(ev) {
			app.db.changeVersion(app.version, '3.0',
			function(trans){
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
				alert("DB version incremented");
						//add stuff into table(s)
				var occname = document.getElementById("new-occ").value
								
				trans.executeSql('INSERT INTO occasion(occ_name) VALUES(?)', occname, 
					function(tx, rs){
						//do something if it works, as desired   
						alert("Added row in occasion");
					},
					function(tx, err){
						//failed to run query
						alert( err.message);
					});
		
			});
		},
		function(err){
			//error in changing version
			//if the increment fails
			alert( "Change version call error " + err.message);
		},
		function(){
			//successfully completed the transaction of incrementing the version number   
					app.version = '3.0';
					alert("Change version function worked.");
		});
		app.overlay.style.display = "none";
		app.modal.style.display = "none";
		app.filloccasion();
			
	},
	giftsforoccasion: function() {
		// select statement based on gifts per occ
	// display LIs
	// set up single double and add button
	// set up back button
	},
	deleteoccasion: function() {
	// delete record from database
	// go back to occasion screen
		idToDelete = '';  // I do not know how to do this!!!!!!  The number has to come from the person list
		
		app.db.transaction(function(trans){
		trans.executeSql('DELETE FROM occasions WHERE occ_id = ?', idToDelete, 
			function(tx, rs){
				//do something if it works, as desired   
				alert("Deleted Row");
			},
			function(tx, err){
				//failed to run query
				alert( err.message);
			});
        }); 
		app.fillOccasions();
	},
}
app.initialize();