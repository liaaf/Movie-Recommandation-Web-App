
// Account login, registration, etc.
function login() {
	var email = $('#email').val();
	var password = $('#password').val();
	var data = {
		email: email,
		password: password,
	};

	$.ajax({
		type: "POST",
		url: "../login",
		dataType: "text",
		data: data,
		success: function(msg) {
			if (msg == "success") {
				window.location = "../movie.html";
			} else {
				$("#error_response").html(msg);
			};
		},
		error: function(jgXHR, textStatus, errorThrown) {
			alert("Error: " + errorThrown + textStatus);
		}
	});
}

function register_user() {
	var email = $('#email').val();
	var password = $('#password').val();
	var confirm_password = $('#confirm_password').val();
	var username = $('#username').val();

	if ( (confirm_password != password) || (username == "") ) {
		$("#error_response").html("Please enter a username and make sure passwords are matching.");
		return;
	};

	var data = {
		email: email,
		password: password,
		username: username,
	};

	$.ajax({
		type: "POST",
		url: "../register",
		dataType: "text",
		data: data,
		success: function(msg) {
			if (msg == "success") {
				window.location = "../movie.html";
			} else {
				$("#error_response").html(msg);
			};
		},
		error: function(jgXHR, textStatus, errorThrown) {
			alert("Error: " + errorThrown + textStatus);
		}
	});
	
}

function add_movie(movie_id, movie_url) {
	var id = movie_id;
	var url = movie_url;
	$.ajax({
		type: "POST",
		url: "../add_movie",
		dataType: "text",
		data: {id: id, url: url},
		success: function(msg) {

			window.location.reload();

		},
		error: function(jgXHR, textStatus, errorThrown) {
			alert("Error: " + errorThrown);
		}
	});
}

function login_status() {
	$.ajax({
		type: "POST",
		url: "../login_status",
		dataType: "text",
		data: {},
		success: function(msg) {
			if (msg != "fail") {
				$("#login").remove();
				$("#menu").append("<li><a href='/logout'>Logout</a></li>");
				$("#menu").append("<li>Hi, " + msg + "</li>");
				getMyList();
			}
		},
		error: function(jgXHR, textStatus, errorThrown) {
			alert("Error: " + errorThrown);
		}
	});
}


function getMyList(){

    $.ajax({
				type: "POST",
				url: "./get_list",
				dataType: "text",
				data: {},
				success: function(msg) {
					$("#mylist").html(msg);
				},
				error: function(jgXHR, textStatus, errorThrown) {
					alert("Error: " + errorThrown);
				}
			});
}

function delete_movie(id) {
	
	$.ajax({
		type: "POST",
		url: "../delete_movie",
		dataType: "text",
		data: {id: id},
		success: function(msg) {

			window.location.reload();

		},
		error: function(jgXHR, textStatus, errorThrown) {
			alert("Error: " + errorThrown);
		}
	});

}

