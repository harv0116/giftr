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
        
		document.getElementById("people-list").style.display="block";
        document.getElementById("occasion-list").style.display="none";
        document.getElementById("gifts-for-person").style.display="none";
        document.getElementById("gifts-for-occasion").style.display="none";
		
        var peoplePage = document.getElementById("people-list");
		var div = document.getElementById("peoplelist");
		var nameul = document.createElement("ul");
		nameul.setAttribute("data-role","listview");
		nameul.innerHTML = '';
		div.appendChild(nameul);
		var norecords=false;

        app.db.transaction(function(trans){
        trans.executeSql("SELECT * FROM people", [],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = rs.rows.item(i).person_id;
							 li.innerHTML = rs.rows.item(i).person_name;
							 nameul.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
					norecords = true;
                });
        });
		if (norecords) {
			alert ("no records");
		} else {
		div.appendChild(nameul);	
		}
		
			var hammertime = new Hammer.Manager(peoplePage);	
			var swipeRight = new Hammer.Swipe({event: 'swiperight' });
			hammertime.add([swipeRight]);

			hammertime.on('swiperight', function(ev) {
				ev.preventDefault();
				console.log(ev);
				nameul.innerHTML = '';
				div.appendChild(nameul);				
				app.fillOccasions(ev);
			});

			var mchammertime = new Hammer.Manager(nameul);
			
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			mchammertime.add([doubleTap, singleTap]);
			doubleTap.requireFailure('singletap');
				
			mchammertime.on('singletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.giftsforperson(ev);
			});
			mchammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.deleteperson(ev);
			});
			
			var addbutton = document.getElementById("btnAdd1");
			var mc = new Hammer.Manager(addbutton);
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			mc.add([singleTap]);	
			mc.on('singletap', function(ev) {
				//ev.preventDefault();
				alert("YAY CLICKED THE ADD BUTTON");
				document.querySelector("[data-role=overlay]").style.display="block";
				document.getElementById("add-person").style.display="block";
				app.newperson();
			});
			
			
	},
	fillOccasions: function(){
		
		document.getElementById("people-list").style.display="none";
        document.getElementById("occasion-list").style.display="block";
        document.getElementById("gifts-for-person").style.display="none";
        document.getElementById("gifts-for-occasion").style.display="none";
        
		var occPage = document.getElementById("occasion-list");
		var div2 = document.getElementById("occasionlist");
		var nameul2 = document.createElement("ul");
		nameul2.setAttribute("data-role","listview");
		nameul2.innerHTML = '';
		div2.appendChild(nameul2);
		var norecords=false;
        
        app.db.transaction(function(trans){
        trans.executeSql("SELECT * FROM occasions", [],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = rs.rows.item(i).occ_id;
							 li.innerHTML = rs.rows.item(i).occ_name;
							 nameul2.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
					norecords = true;
                });
       });
		if (norecords) {
			alert ("no records");
		} else {
			div2.appendChild(nameul2);	
		}
	
		
		    var hammertime = new Hammer.Manager(occPage);	
			var swipeLeft = new Hammer.Swipe({event: 'swipeleft' });
			hammertime.add([swipeLeft]);

			hammertime.on('swipeleft', function(ev) {
				ev.preventDefault();
				console.log(ev);
				nameul2.innerHTML = '';
				div2.appendChild(nameul2);
				app.fillPeople(ev);
			});

			var mchammertime = new Hammer.Manager(nameul2);
			
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			mchammertime.add([doubleTap, singleTap]);
			doubleTap.requireFailure('singletap');
				
			mchammertime.on('singletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.giftsforoccasion(ev);
			});
			mchammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.deleteoccasion(ev);
			});
			
			var addbutton = document.getElementById("btnAdd2");
			var mc = new Hammer.Manager(addbutton);
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			mc.add([singleTap]);	
			mc.on('singletap', function(ev) {
				//ev.preventDefault();
				alert("YAY CLICKED THE ADD BUTTON");
				//app.modal.document.getElementById("add-person");
				document.getElementById("add-occasion").style.display="block";
				document.querySelector("[data-role=overlay]").style.display="block";
				app.newOccasion();
			});
		
		
	},
	newperson: function(ev) {
	// watch for cancel and save buttons
	// cancel - go back to people
	// save - insert record into database then go back to people
		//alert("STOPPED AT NEW PERSON");
		
		document.getElementById("CancelP").addEventListener("click",function(ev) {
		ev.preventDefault();
		document.getElementById("add-person").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
		
		//nameul.innerHTML = '';
		//div2.appendChild(nameul);
		
		app.fillPeople();
		});
		
		document.getElementById("SaveP").addEventListener("click",function(ev) {
			
			app.db.transaction(function(trans){
			
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
						//add stuff into table(s)
				var name = document.getElementById("new-per").value
								
				trans.executeSql('INSERT INTO people(person_id, person_name) VALUES(null, ?)', [name], 
					function(tx, rs){
						//do something if it works, as desired   
						alert("Added row in people");
						document.getElementById("add-person").style.display="none";
						document.querySelector("[data-role=overlay]").style.display="none";
						app.fillPeople();
					},
					function(tx, err){
						//failed to run query
						alert( err.message);
					});
		
			});
			
		});
	},
	giftsforperson: function(ev) {
	// select statement based on gifts per person
	// display LIs
	// set up single double and add button
	// set up back button
		document.getElementById("people-list").style.display="none";
        document.getElementById("occasion-list").style.display="none";
        document.getElementById("gifts-for-person").style.display="block";
        document.getElementById("gifts-for-occasion").style.display="none";
        
		var gfpPage = document.getElementById("gifts-for-person");
		var div3 = document.getElementById("giftpeoplelist");
		var nameul3 = document.createElement("ul");
		nameul3.setAttribute("data-role","listview");
		nameul3.innerHTML = '';
		div3.appendChild(nameul3);
		var norecords=false;
		
		var item = ev.target.getAttribute("data-ref");
		alert("ITEM is " + item);
        
        app.db.transaction(function(trans){
        trans.executeSql("SELECT g.purchased, g.gift_id, g.gift_idea, o.occ_name FROM gifts AS g INNER JOIN occasions AS o ON o.occ_id = g.occ_id WHERE g.person_id = ? ORDER BY o.occ_name, g.gift_idea)", [item],
                function(tx, rs){
                         var len = rs.rows.length;

                         for (var i=0; i<len; i++) {
                         // display one person_name
							 var li = document.createElement("li");
							 li.dataset.ref = rs.rows.item(i).person_id;
							 li.innerHTML = rs.rows.item(i).gift_idea + " - " + rs.rows.item(i).occ_name;
							 nameul3.appendChild(li);
                         }
                },
                function(tx, err){
                    console.log("Error: " + err);
					norecords = true;
                });
       });
		if (norecords) {
			alert ("no records");
		} else {
			div3.appendChild(nameul3);	
		}

			var mchammertime = new Hammer.Manager(nameul2);
			
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			mchammertime.add([doubleTap, singleTap]);
			doubleTap.requireFailure('singletap');
				
			mchammertime.on('singletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				nameul3.innerHTML = '';
				div3.appendChild(nameul3);
				//app.giftsforoccasion(ev);
				// turn colour on.
			});
			mchammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.deletepersongift(ev);
				// delete entry
			});
			
			var addbutton = document.getElementById("btnAdd3");
			var mc = new Hammer.Manager(addbutton);
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			mc.add([singleTap]);	
			mc.on('singletap', function(ev) {
				//ev.preventDefault();
				alert("YAY CLICKED THE ADD BUTTON");
				//app.modal.document.getElementById("add-person");
				document.getElementById("add-gift-person").style.display="block";
				document.querySelector("[data-role=overlay]").style.display="block";
				app.newGiftForPerson();
			});
	
	},
	deleteperson: function(ev) {
	// delete record from database
	// go back to person screen
		
		var item = ev.target.getAttribute("data-ref");
		
		alert("ITEM is " + item);
		
		app.db.transaction(function(trans){
		trans.executeSql('DELETE FROM people WHERE person_id = ?', [item], 
			function(tx, rs){
				//do something if it works, as desired   
				alert("Deleted Row");
			},
			function(tx, err){
				//failed to run query
				alert( err.message);
			});
        }); 
		
			//			nameul2.innerHTML = '';
			//	div2.appendChild(nameul2);
		
		app.fillPeople();
	},
	newOccasion: function() {
	// watch for cancel and save buttons
	// cancel - go back to occasion
	// save - insert record into database then go back to occ
		document.getElementById("CancelO").addEventListener("click",function(ev) {
		ev.preventDefault();
		document.getElementById("add-occasion").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
		app.fillOccasions();
		});
		
		document.getElementById("SaveO").addEventListener("click",function(ev) {
			
			app.db.transaction(function(trans){
			
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
						//add stuff into table(s)
				var name = document.getElementById("new-occ").value
								
				trans.executeSql('INSERT INTO occasions(occ_id, occ_name) VALUES(null, ?)', [name], 
					function(tx, rs){
						//do something if it works, as desired   
						alert("Added row in occ");
						document.getElementById("add-occasion").style.display="none";
						document.querySelector("[data-role=overlay]").style.display="none";
						
						//				nameul2.innerHTML = '';
				//div2.appendChild(nameul2);
						
						app.fillOccasions();
					},
					function(tx, err){
						//failed to run query
						alert( err.message);
					});
		
			});
			
		});
		
			
	},
	giftsforoccasion: function() {
		// select statement based on gifts per occ
	// display LIs
	// set up single double and add button
	// set up back button
	},
	
	deleteoccasion: function(ev) {
	// delete record from database
	// go back to occasion screen
		var item = ev.target.getAttribute("data-ref");
		
		alert("ITEM is " + item);
		
		app.db.transaction(function(trans){
			trans.executeSql('DELETE FROM occasions WHERE occ_id = ?', [item], 
			function(tx, rs){
				//do something if it works, as desired   
				alert("Deleted Row");
			},
			function(tx, err){
				//failed to run query
				alert( err.message);
			});
        }); 
		
						//nameul2.innerHTML = '';
				//div2.appendChild(nameul2);
		
		app.fillOccasions();
		
	},
	newGiftForPerson: function(ev) {
		
		document.getElementById("CancelGP").addEventListener("click",function(ev) {
		ev.preventDefault();
		document.getElementById("add-gift-person").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
		app.giftsforperson();
		});
		
		document.getElementById("SaveGP").addEventListener("click",function(ev) {
			
			app.db.transaction(function(trans){
			
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
						//add stuff into table(s)
				
				// there ARE 2 FIELDS HERE!!!!!
				
				var name = document.getElementById("new-occ").value
								
				trans.executeSql('INSERT INTO occasions(occ_id, occ_name) VALUES(null, ?)', [name], 
					function(tx, rs){
						//do something if it works, as desired   
						alert("Added row in occ");
						document.getElementById("add-occasion").style.display="none";
						document.querySelector("[data-role=overlay]").style.display="none";
						//app.fillOccasions();
					},
					function(tx, err){
						//failed to run query
						alert( err.message);
					});
		
			});
			
		});
	},
	deletepersongift: function(ev) {
	// delete record from database
	// go back to person screen
		
		var item = ev.target.getAttribute("data-ref");
		
		alert("ITEM is " + item);
		
		app.db.transaction(function(trans){
		trans.executeSql('DELETE FROM gift WHERE gift_id = ?', [item], 
			function(tx, rs){
				//do something if it works, as desired   
				alert("Deleted Row");
			},
			function(tx, err){
				//failed to run query
				alert( err.message);
			});
        }); 
		
		//				nameul2.innerHTML = '';
				// div2.appendChild(nameul2);
		
		app.giftsforperson();
	}
}
	
app.initialize();