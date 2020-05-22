var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passwordHash = require('password-hash');

var helper = require('./helper_functions'); // Helper functions Mk
const url = 'mongodb://localhost:27017';
const dbName = 'mk_matcha';	// Database Name

/* GET reset_password listing. */
// router.get('/', function (req, res, next) {
// 	//   res.send('respond with a resource');
// 	res.render('reset_password', { page: 'Reset Password' });
// });

router.get('/', (req, res) => {
	// let email = res.query.email;
	// let code = res.query.code;
	let email = req.query.email;
	let code = req.query.code;
	
	if (email && code) {
		console.log(email);
		console.log(code);
		res.render('reset_password', { email, code });
	} else {
		console.log('email not found');
		res.redirect('forgot_password' + 'pass_err' + 'Reset pssword request not found.\nPlease submit the form below to reset your password');
	}
});

router.post('/', function (req, res, next) {
	let email = req.body.email;
	let code = req.body.code;
	let password = req.body.password;
	let confirm_password = req.body.confirm_password;
	let user = [];

	let user_data = {
		'usr_email': email, 'confirm_code': code
	};

	MongoClient.connect(url, (err, client) => {
		assert.equal(err, null);
		const db = client.db(dbName);
		const collection = db.collection('users');
		let user = [];
		collection.find({'usr_email': email}).forEach((doc, err) => {
			assert.equal(err, null);
			user.push(doc);
		}, () => {
			if (user.length === 1 && user[0].confirm_code === parseFloat(code) ) {
				console.log('______user found___________________');
				if (password === confirm_password) {
					collection.updateOne({ 
						'usr_email': email 
					}, {
						$set: {
							'usr_psswd': passwordHash.generate(password),
							'confirm_code': Math.random()
						}
					}, () => {	//	password change is successfull
						console.log('changed');
						res.redirect('/login/' + 'pass_sucPassword has succesfully ben changed');
					});
				} else {	// passwords do not match
					console.log('passwords dont match');
					res.redirect(`/reset_password?email=${email}&code=${code}`);
				}
			} else {	//	code or email is invalid
				conole.log('who tf is this?');
				res.redirect(`/reset_password?email=${email}&code=${code}`);
			}
		});
	});
	setTimeout(() => {
		res.redirect('/login/' + 'pass_sucPasswprd has succesfully ben changed');
	}, 1500);
});

module.exports = router;
