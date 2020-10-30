$().ready(function() {
    $('#userForm').validate({
	rules: {
            email: {
				remote: {
					url: "./is_unique_email",
					type: "POST",
					dataType: "text",
					data: { email: function() {
								return $("#email").val();
						}
					}
				},
				required: true
            },
            password: "required",
            confirm_password: {
                equalTo: "#password",
                required: true
            }
        },
        submitHandler: function(form) {
            $.ajax({
                url: "./submit_user",
                type: "POST",
                dataType: "text",
                data: $(form).serialize()
            }).done(function() {
                alert('Please check email!');
                $("#userForm").trigger('reset');
            });
        }
    });
});

