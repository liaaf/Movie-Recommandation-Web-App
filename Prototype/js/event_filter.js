$().ready(function() {
    $('#eventFilter').validate({
		rules: {
			submitHandler: function(form) {
				$.ajax({
					url: "./events",
					type: "GET",
					dataType: "text",
					data: $(form).serialize()
				});
			}
		}
    });
});
