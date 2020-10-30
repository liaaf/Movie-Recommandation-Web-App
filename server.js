var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('.'));

var key = require('./secret/api_key.json').key;
 
app.listen(8080, function() {
    console.log('Server started...')
});
 
/*********** Search functions **********/

app.post('/in_theaters', function(req, res) {
              var URL = "https://api.themoviedb.org/3/movie/now_playing?api_key=";
              URL += key;
              URL += "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_release_type=1";
 
              request.get(URL, function(error, response, body) {
                           var json = JSON.parse(body);
                           result = "<table><tr>";
                           list = json.results;

                           var login_status = database.logged_in();

                           for (item in list) {
                                poster = "https://image.tmdb.org/t/p/w200"
                                result += "<td><img id=" + list[item].id + " src=" + poster + list[item].poster_path + "></td>";
                           }

                           if (login_status) {
                                result += "</tr><tr>"
                                
                                for (item in list) {
                                    poster_url = '"' + poster + list[item].poster_path + '"';
                                    result +="<td><button id='addlist' onclick='add_movie(" + list[item].id + ", " + poster_url + ")'>Add to list</button></td>";
                               }
                           }
 
                           result += "</tr></table>";
                           
                           res.send(result);
              });
 
});
 
app.post('/year', function(req, res) {
              var year = req.body.q;
              var URL = "https://api.themoviedb.org/3/discover/movie?api_key=";
              URL += key;
              URL += "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=";
              URL += year;
              URL += "&with_release_type=1";
 
              request.get(URL, function(error, response, body) {
                var json = JSON.parse(body);
                result = "<table><tr>";
                list = json.results;

                var login_status = database.logged_in();

                for (item in list) {
                     poster = "https://image.tmdb.org/t/p/w200"
                     result += "<td><img id=" + list[item].id + " src=" + poster + list[item].poster_path + "></td>";
                }

                if (login_status) {
                     result += "</tr><tr>"
                     
                     for (item in list) {
                         poster_url = '"' + poster + list[item].poster_path + '"';
                         result +="<td><button id='addlist' onclick='add_movie(" + list[item].id + ", " + poster_url + ")'>Add to list</button></td>";
                    }
                }

                result += "</tr></table>";
                
                res.send(result);
   });
 
 
});
 
app.post('/keyword', function(req, res) {
              var keyword = req.body.q;
 
              var URL = "https://api.themoviedb.org/3/search/movie?api_key=";
              URL += key;
              URL += "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&query=";
              URL += keyword;
              URL += "&with_release_type=1";
 
              request.get(URL, function(error, response, body) {
                var json = JSON.parse(body);
                result = "<table><tr>";
                list = json.results;

                var login_status = database.logged_in();

                for (item in list) {
                     poster = "https://image.tmdb.org/t/p/w200"
                     result += "<td><img id=" + list[item].id + " src=" + poster + list[item].poster_path + "></td>";
                }

                if (login_status) {
                     result += "</tr><tr>"
                     
                     for (item in list) {
                         poster_url = '"' + poster + list[item].poster_path + '"';
                         result +="<td><button id='addlist' onclick='add_movie(" + list[item].id + ", " + poster_url + ")'>Add to list</button></td>";
                    }
                }

                result += "</tr></table>";
                
                res.send(result);
   });
});
 
app.post('/language', function(req, res) {
              var language = req.body.q;
 
              var URL = "https://api.themoviedb.org/3/discover/movie?api_key=";
              URL += key;
              URL += "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_original_language=";
              URL += language;
              URL += "&with_release_type=1";
 
              request.get(URL, function(error, response, body) {
                var json = JSON.parse(body);
                result = "<table><tr>";
                list = json.results;

                var login_status = database.logged_in();

                for (item in list) {
                     poster = "https://image.tmdb.org/t/p/w200"
                     result += "<td><img id=" + list[item].id + " src=" + poster + list[item].poster_path + "></td>";
                }

                if (login_status) {
                     result += "</tr><tr>"
                     
                     for (item in list) {
                         poster_url = '"' + poster + list[item].poster_path + '"';
                         result +="<td><button id='addlist' onclick='add_movie(" + list[item].id + ", " + poster_url + ")'>Add to list</button></td>";
                    }
                }

                result += "</tr></table>";
                
                res.send(result);
   });
});
 
app.post('/actor', function(req, res) {
              var actor = req.body.q;
 
              var URL = "https://api.themoviedb.org/3/search/person?api_key=";
              URL += key;
              URL += "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&query=";
              URL += actor;
              URL += "&with_release_type=1";

              request.get(URL, function(error, response, body) {
                           var json = JSON.parse(body);
                           result = "<table><tr>";
                           list = json.results;

                           var login_status = database.logged_in();

                           for (item in list) {
                               for (movie in list[item].known_for) {
                                    poster = "https://image.tmdb.org/t/p/w200"
                                    result += "<td><img id=" + list[item].id + " src=" + poster + list[item].known_for[movie].poster_path + "></td>";
                               }
                           }

                           if (login_status) {
                                result += "</tr><tr>"
                                
                                for (item in list) {
                                    for (movie in list[item].known_for) {
                                         poster = "https://image.tmdb.org/t/p/w200"
                                         poster_url = '"' + poster + list[item].known_for[movie].poster_path + '"';
                                         result +="<td><button id='addlist' onclick='add_movie(" + list[item].known_for[movie].id + ", " + poster_url + ")'>Add to list</button></td>";
                                    }
                                }
                           }
 
                           result += "</tr></table>";
                           
                           res.send(result);
              });

              
});
 
app.post('/genre', function(req, res) {
              var genre = req.body.q;
 
              var URL = "https://api.themoviedb.org/3/discover/movie?api_key=";
              URL += key;
              URL += "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=";
              URL += genre;
 
              request.get(URL, function(error, response, body) {
                var json = JSON.parse(body);
                result = "<table><tr>";
                list = json.results;

                var login_status = database.logged_in();

                for (item in list) {
                     poster = "https://image.tmdb.org/t/p/w200"
                     result += "<td><img id=" + list[item].id + " src=" + poster + list[item].poster_path + "></td>";
                }

                if (login_status) {
                     result += "</tr><tr>"
                     
                     for (item in list) {
                         poster_url = '"' + poster + list[item].poster_path + '"';
                         result +="<td><button id='addlist' onclick='add_movie(" + list[item].id + ", " + poster_url + ")'>Add to list</button></td>";
                    }
                }

                result += "</tr></table>";
                
                res.send(result);
   });
});

app.post('/movie_id', function(req, res) {
    var id = req.body.id;
    var URL = "https://api.themoviedb.org/3/movie/";
    URL += id;
    URL += "?api_key=";
    URL += key;
    URL += "&language=en-US";

    request.get(URL, function(error, response, body) {
               var json = JSON.parse(body);
               poster = "https://image.tmdb.org/t/p/w200"
               result = "<img src=" + poster + json.poster_path + ">";
               res.send(result);           
    });
});


/************ Account functions **********/
var database = require('./js/firebase_functions.js')
var firebase = require("firebase");


app.post('/login', function(req, res) {
	console.log('Logging in via server.js...');
    var email = req.body.email;
    var password = req.body.password;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Error handling
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Errorcode:", errorCode, "with message", errorMessage);
        res.send(errorMessage);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            res.send("success");
        };
      });
      
  });


app.post('/register', function(req, res) {
    console.log("Creating account via test_serv.js...");
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
            (user)=>{
                user = firebase.auth().currentUser;
                if(user){
                    user.updateProfile({
                        displayName: username,
                        photoURL: 'blah.png'
                    }).then(
                    )
                }
                res.send("success")
            })
        .catch(function(error) {
            // Error handling
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Errorcode:", errorCode, "with message", errorMessage);
            res.send(errorMessage);
    });

});


app.post('/login_status', function(req, res) {
	var login_status = database.logged_in();
	if (login_status) {
		res.send(login_status);
	} else {
		res.send("fail");
	};
});


app.get('/logout', function(req, res) {

    firebase.auth().signOut().then(function() {
        res.redirect("./movie.html");
      }).catch(function(error) {
        res.redirect("./movie.html");
      });
      
});

app.post('/add_movie', function(req, res) {

    var user = database.logged_in();
    database.add_movie(req.body.id, req.body.url);
    res.send("success");
    

});

app.post('/get_list', function(req, res) {
    var ref = database.get_db();
    var usersRef = ref.ref('users');
	var user = firebase.auth().currentUser;
	var uid = user.uid;

	usersRef.child(uid).once("value", function(snapshot) {
		var exists = (snapshot.val() !== null);
		if (exists) {

            result = "<h3>My List</h3><table><tr>"

            for (item in snapshot.val()) {
                var url = snapshot.val()[item].url;
                result += "<td><img src='" + url + "'></td>";
            }

            result += "</tr><tr>"
            for (item in snapshot.val()) {
                var url = snapshot.val()[item].url;
                result += "<td><button id='addlist' onclick='delete_movie(" + snapshot.val()[item].id + ")'>Remove</button></td>";
            }

            result += "</tr></table>";
            res.send(result);
            
		} else {
			res.send("No movies in your list yet!");
		}
	});

});

app.post('/delete_movie', function(req, res) {
    var ref = database.get_db();
    var usersRef = ref.ref('users');
	var user = firebase.auth().currentUser;
    var uid = user.uid;
    id = req.body.id;

    usersRef.child(uid).on("value", function(snapshot) {
		var exists = (snapshot.val() !== null);
		if (exists) {
			
			for (item in snapshot.val()) {
				if (snapshot.val()[item].id == id) {
					usersRef.child(uid).child(item).remove();
				}
			};
        }
    });

    console.log("Deleted movie with id " + id);
    res.send("success");
    
});