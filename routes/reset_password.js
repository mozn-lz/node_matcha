var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passwordHash = require('password-hash');

var helper = require('./helper_functions'); // Helper functions Mk
const url = 'mongodb://localhost:27017';
const dbName = 'mk_matcha';	// Database Name

/* GET reset_password listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('reset_password', { page: 'Reset Password' });
});

router.post('/', function (req, res, next) {
	var email = req.body.email;
	var usr_data = null;

	// Connect and save data to mongodbreq.params.user
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		var find_user = [];
		var user_matches = [];
		const collection = db.collection('users');

		collection.find({ 'usr_email': email }).forEach(function (doc, err) {
			assert.equal(null, err);
			find_user.push(doc);
			console.log('\t\t doc: ' + doc);
		}, () => {
			client.close();
			/*
			//email Sender
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'unathinkomo16@gmail.com',
					pass: '0786324448'
				}
			});
			// Sending email to recipiant
			const message = () => {
				var l1 = 'Your verification Code is ';
				var code = confirm_code;
				var l3 = ', Please Click On ';
				var link = `<a href="http://localhost:5000/verify?email=${email}&code=${code}">this link</a>`;//{}&code=">this link</a>';
				var l4 = ' to activate your account.';
				return l1 + code + l3 + link + l4;
			}

			var mailOptions = {
				from: 'auth@matcha.com',
				to: email,
				subject: 'Matcha Verification',
				html: message()
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			//	end email
			*/
		});
		res.render('reset_password', { page: 'Reset Password' });
	});
});

module.exports = router;
