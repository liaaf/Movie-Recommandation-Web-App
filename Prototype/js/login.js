$().ready(function() {
    $('#loginForm').validate({
	rules: {
            password: "required"
        },
        submitHandler: function(form) {
            $.ajax({
                url: "./login",
                type: "POST",
                dataType: "text",
                data: $(form).serialize()
            }).done(function(msg) {
				if (msg === 'true') {
					window.location = '/';
					return;
				}
                alert(msg);
            });
        }
    });
});

