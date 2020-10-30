/*

Node server

*/

// Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('.'));

// Firebase DB
var database = require('./firebase_functions.js')

// Functions

app.listen(8080, function() {
    console.log('Server started...')
});

app.post('/submit_user', function(req, res) {
    console.log("Creating account via test_serv.js...")
    var new_user_email = database.create_user(req.body);
	res.send(new_user_email);
});
	
app.post('/fav_movie', function(req, res) {
	var new_fav_movie = database.fav_movie(req.body);
	console.log('Adding new fav movie via test_serv.js...')
});

app.post('/loggedin', function(req, res) {
	console.log('Reached /loggedin endpoint on test_serv.js');
	var loggedin_status = database.logged_in();
	console.log('Logged in: ', loggedin_status);
	if (loggedin_status) {
		res.send('Logged in!');
	} else {
		res.send('Not logged in.');
	};
});

app.post('/login', function(req, res) {
	console.log('Logging in via test_serv.js');
	var new_login = database.login(req.body);
	res.send(new_login);
});
