/** Firebase DB helper file **/

/** required modules **/
var admin = require("firebase-admin");

/** required files **/
var serviceAccount = require("./secret/dragonevents-firebase-adminsdk.json");

/** initialize app **/
var app = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://dragonevents-ac729.firebaseio.com",
		storageBucket: "dragonevents-ac729.appspot.com"
});

var db = app.database().ref();
var bucket = admin.storage();


module.exports = {
	get_connection: function() {
		return get_connection();
	},
	get_bucket: function(){
		return get_bucket();
	},
	create_event: function(a) {
		return create_event(a);
	},
	create_user: function(a) {
		return create_user(a);
	},
	confirm_user: function(a) {
		return confirm_user(a);
	},
	test: function() {
		var storageRef = admin.storage().bucket().upload("img/background.jpg").then(()=>{console.log('success.')});
	}
};

function get_connection() {
		return db;
}

function get_bucket() {
    return bucket;
}

/** Create a new event in the database **/
function create_event(eventDictionary) {
	var eventsRef = app.database().ref('events');
	// create a new event and return its ID
	return eventsRef.push(eventDictionary).key;
}

function create_user(userDict) {
    var usersRef = app.database().ref('users');
    // create a new user and return its ID
    return usersRef.push(userDict).key;
}

function confirm_user(userId) {
	// confirm user by deleting "secret" and setting "is_confirmed": true
	// You can easily check if user is confirmed by checking the 
	var usersRef = app.database().ref('users');
	usersRef.child(userId)
		.update(
			{ 
				is_confirmed:true,
				secret: admin.firestore.FieldValue.delete()
			});
}