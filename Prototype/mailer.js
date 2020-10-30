var nodemailer = require('nodemailer');

function send_mail(mailOptions) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'drexeldragonevents@gmail.com',
			pass: 'dragons12'
		}
	});

	transporter.sendMail(mailOptions, function(error, info) {
		console.log(mailOptions);
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

module.exports = {
  send_mail: function(mail_options) {
	  return send_mail(mail_options);
  } 
};