/** Required modules and files **/
var http = require('http');
var express = require('express');
var pug = require('pug');
var database = require('./firebase.js');
var session = require('express-session');
var bodyParser = require('body-parser');
var mailer = require('./mailer.js');

/** Initialize Application **/
app = express();
app.set('view engine', 'pug');
app.use(express.static('.'));
app.use(session({
	secret: 'dragonevents',
    resave: true,
    saveUninitialized: true
	})
);
app.use(function(req,res,next){
    res.locals.session = req.session; // Links req.session to local session variable
    next();
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    /** Landing page. Lists up to 4 events **/
    var db = database.get_connection();
    db.child('events').limitToFirst(4).once('value', function(snapshot) {
		res.render('index', {"events": snapshot.val()});
		res.end();
    });
});

app.get('/events', function(req,res) {
    /** List all events and filter based on GET params because
		firebase does not natively support LIKE querying,
		it is manually implemented.

	ARGS
		name (string): events that contain the string
		start_date (date): events that begin after this date
		end_date (date): events that end before this date

	RETURNS
		Page with events within user specified criteria
	**/
    var name = req.query.name;
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;

    var db = database.get_connection();

    db.once('value', function(snapshot) {
        var events = snapshot.val().events;
		// remove events that don't contain "name" as substring (case insensitive)
        if (name) {
            name = name.toLowerCase();
            for (var key in events) {
				var event_name = events[key].name.toLowerCase();
				if(event_name.indexOf(name) == -1) {
                    delete events[key];
                }
            }
        }
		// remove events that start before "start_date"
        if (start_date) {
            start_date = dateToMilliSeconds(start_date);
            for (var key in events) {
				var event_start = dateToMilliSeconds(events[key].start_date);
                if( event_start < start_date ) {
                    delete events[key];
                }
            }
        }
		// remove events that end after "end_date"
        if (end_date) {
            end_date = dateToMilliSeconds(end_date);
            for (var key in events) {
				var event_end = dateToMilliSeconds(events[key].end_date);
                if( event_end < end_date ) {
                    delete events[key];
                }
            }
        }
		// Only events that match criteria remain in the events object
		res.render('Events', {"events": events, 'name': name, 'start_date': start_date, 'end_date': end_date});
		res.end();
    });
});

function dateToMilliSeconds(date) {
    /** Returns YYYY-MM-DD as time in milliseconds

    ARGS
		date (string): YYYY-MM-DD

    RETURNS
        Milliseconds (integer) since epoch and input
	**/
    var parts = input.split('-');
    return new Date(parts[0], parts[1]-1, parts[2]).getTime();
}

app.get('/view/:id', function(req,res) {
	/** Get an event by specified ID. Return error if not found **/
    var db = database.get_connection();
    var event_id = req.params.id;
    db.child('events').child(event_id).once('value')
        .then(function(snapshot) {
            if(snapshot.val()==null) {
                res.render('event_not_found');
                res.end();
            } else {
                res.render('view_event', {"event": snapshot.val()});
                res.end();
            }
	});
});

app.get('/about', function(req,res) {
	/** About page **/
    res.render('aboutus');
    res.end();
});

app.get('/login', function(req,res) {
	/** Login page. Redirects to landing page if already logged in. **/
	if (req.session.user!==undefined) {
		res.writeHead(302, {Location: "/"});
		res.end();
		return;
	}
    res.render('login');
    res.end();
});

app.get('/logout', function(req,res) {
	/** Logout page. Redirects to landing page. **/
	delete req.session.user;
    res.writeHead(302,  {Location: "/"});
	res.end();
});

app.get('/create_event', function(req, res) {
	/** submit event page **/
    res.render('create_event');
    res.end();
});

app.get('/register', function(req, res) {
	/** User register page. Redirects to landing page if already logged in. **/
	if (req.session.user!==undefined) {
		res.writeHead(302, {Location: "/"});
		res.end();
	}
	res.render('register');
	res.end();
});

app.get('/confirm/:user_id/:secret', function(req, res) {
	/** Confirm user page

	ARGS
		user_id: firebase generated ID
		secret: randomly generated number saved in firebase/users/:id/secret

	RETURNS
		user_confirmed (if valid id/secret combination specified)
		user_not_confirmed otherwise
	**/
	var db = database.get_connection();
	var user_id = req.params.user_id;
	var secret = req.params.secret;
	db.child('users').child(user_id)
		.once('value')
		.then(function(snapshot) {
			if (snapshot.val() == null || snapshot.val().secret != secret) {
				res.render('user_not_confirmed');
				res.end();
			} else {
				database.confirm_user(user_id);
                res.render('user_confirmed');
				res.end();
			}
		}
	);
});

app.post('/is_unique_email', function(req,res) {
	/** Ajax query that checks if an email is taken

	ARGS
		email (string): email to be checked

	RETURNS
		true (boolean) if email is not taken
		'Email is taken!' otherwise
	**/
	var email = req.body.email.toLowerCase();
	var db = database.get_connection().child('users').orderByChild('email').equalTo(email);
	db.once('value', function(snapshot) {
		if (snapshot.numChildren() > 0) {
			res.send('Email is taken!');
			res.end();
		} else {
			res.send(true);
			res.end();
		}
    });
});

app.post('/submit_event', function(req, res) {
	/** #eventForm endpoint, creates an event by passing all parameters in req.body

	Event fields are populated based on form input tags.
	**/
	// TODO modify start/end date to date objects combining date and time
	// e.g. req.body.start_date = new Date(req.body.start_date);
    var new_event_id = database.create_event(req.body);
    res.send('Success.');
    res.end();
});

app.post('/submit_user', function(req, res) {
	/** Creates a new user and sends an email asking user to confirm their identity.
		Also creates and stores a random number from 1-100000.

	ARGS
		email (string): user's email address
	**/
    req.body.secret = Math.floor(Math.random()* 100000) + 1;
	req.body.email = req.body.email.toLowerCase();
    var new_user_id = database.create_user(req.body);
    var link = "http://localhost:2080/confirm/" + new_user_id + "/" + req.body.secret;
	mail_options = {
		from: 'drexeldragonevents@gmail.com',
		to: req.body.email,
		subject: 'Confirm registration',
		text: "Click the following link to confirm your email: " + link,
        html: pug.renderFile('./views/confirm_email.pug', { link: link }),
        attachments: [{
          filename: 'DragonEvents.jpg',
          path: './img/DragonEventsLogo.jpg',
          cid: 'DragonEventsLogo'
        }]
	};
	mailer.send_mail(mail_options);
    res.send('Success.');
    res.end();
});

app.post('/login', function(req, res) {
	/** Login form endpoint **/
	var password = req.body.password;
	// minimal user input sanitizing
	req.body.email = req.body.email.toLowerCase();
	var db = database.get_connection();
	db.child('users').orderByChild('email').equalTo(req.body.email)
		.on('value', function(snapshot) {
			var users = snapshot.val();
			var user_id = Object.keys(users)[0];
			var user = users[user_id];
			// check if password matches and user is confirmed
			if (user !== undefined && user.password === password && user.is_confirmed === true) {
				req.session.user = user;
				res.send(true);
				res.end();
			} else {
				res.send('Invalid email/password combination.');
				res.end();
			}
	});
});

app.listen(2080, function () {
    console.log('listening on port', 2080);
});
