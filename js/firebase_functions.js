/** Firebase helper file **/

/** required modules **/
var admin = require("firebase-admin");
var firebase = require("firebase");

/** required files **/
var serviceAccount = require("../secret/cs275-firebase-adminsdk.json");

/** initialize admin **/
var app = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
    	databaseURL: "https://cs275-57cb7.firebaseio.com",
    	storageBucket: "cs275-57cb7.appspot.com",
});

/** initialize other firebase stuff **/
var config = {
	apiKey: "AIzaSyA2lnR63JHjyRK1CeLk9jdDZouJQs9SKTk",
	authDomain: "cs275-57cb7.firebaseapp.com", databaseURL: "https://cs275-57cb7.firebaseio.com",
	projectId: "cs275-57cb7",
	storageBucket: "cs275-57cb7.appspot.com",
	messagingSenderId: "257437048839"
};

firebase.initializeApp(config);

var db = app.database().ref();
var bucket = admin.storage();

module.exports = {
	get_connection: function() {
		return get_connection();
	},
    
	create_user: function(a) {
		return create_user(a);
	},

	logged_in: function() {
		return logged_in();
	},

	login: function(a) {
		return login(a);
	},

	add_movie: function(a, b) {
		return add_movie(a, b);
	},

	get_db: function() {
		return get_db();
	},
};

function get_connection() {
		return db;
}

function create_user(userDict) {
    console.log("Creating account via firebase_function.js...")
    var email = userDict.email;
	var password = userDict.password;
	
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Errorcode: ", errorCode, " with message ", errorMessage);
    });
	return 'Successfully created user ' + userDict.email;
}

function add_movie(id, url) {

	var usersRef = app.database().ref('users');
	var user = firebase.auth().currentUser;
	var uid = user.uid;

	// Checking if user already has a list
	usersRef.child(uid).on("value", function(snapshot) {
		var exists = (snapshot.val() !== null);
		if (exists) {
			
			// Checking of movie already in list
			not_copy = true;
			for (item in snapshot.val()) {
				if (snapshot.val()[item].id == id) {
					not_copy = false;
				}
			};
			
			if (not_copy) {
				var idRef = usersRef.child(uid);
				var dict = {};
				dict["id"] = id;
				dict["url"] = url;
				idRef.push(dict);
				console.log('Adding new favorite movie with id ' + id + ' to list of user ' + uid);
			}

		} else {
			var idRef = usersRef.child(uid);
			var dict = {};
			dict["id"] = id;
			dict["url"] = url;
			idRef.push(dict);
			console.log('Adding new favorite movie with id ' + id + ' to list of user ' + uid);
		}
	});

}

function logged_in() {
	var loginstatus;
	var user = firebase.auth().currentUser;
	
	if (user) {
		loginstatus = user.displayName;
	} else {
		loginstatus = false;
	};
	return loginstatus; 
}

function login(userDict) {
	// Handled in server.js
}

function get_list() {
	var usersRef = app.database().ref('users');
	var user = firebase.auth().currentUser;
	var uid = user.uid;
	returnval = 0;

	usersRef.child(uid).once("value", function(snapshot) {
		var exists = (snapshot.val() !== null);
		if (exists) {
			// Return list of ids
			// console.log(snapshot.val());
			returnval = snapshot.val();

		} else {
			returnval = "No movies in your list yet!";
		}
	});
	console.log('reached get_list function in firebase_functions')
	return returnval;
}

function get_db() {
	var db = app.database();
	return db;
}