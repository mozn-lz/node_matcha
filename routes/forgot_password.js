const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name
let page_name = 'Forgot Password';

let render_forgot_passowrd = (res) => {
	res.render('forgot_password', {page_name});
}
/* GET forgot_password listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('forgot_password', { page: 'Forgot Password' });
});

/* GET forgot_password listing. */
router.get('/:message', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('forgot_password', { page: 'Forgot Password' });
});

router.post('/', function (req, res, next) {
	//   res.send('respond with a resource');
	MongoClient.connect(url, (err, client) => {
		assert.equal(null, err);
		var email = req.body.email;

		// Connect and save data to mongodbreq.params.user

			const db = client.db(dbName);
			var find_user = [];
			const collection = db.collection('users');

			collection.find({ 'usr_email': email }).forEach(function (doc, err) {
				assert.equal(null, err);
				find_user.push(doc);
				// console.log('\t\t doc: ' + doc);
			}, () => {
				console.log('user length:', find_user.length)
				// console.log('user length:', find_user)
				// console.log(user[0].usr_user, '\n', user[0].usr_name, '\n', user[0].usr_surname)
				if (find_user && find_user.length === 1) {
					let email = find_user[0].usr_email;	// to email
					let username = find_user[0].usr_user;	//	to name
					let code = find_user[0].confirm_code;	//	verification email

					const message = `
				<b>Matcha Passwrd Request was made ${username}</b><br>
				Please click on the button below to change your password<br>
				<a href="http://localhost:3000/reset_password?email=${email}&code=${code}"><button>Reset Password</button></a>
				`;
					const from = '';
					const subject = 'Matcha Password Reset';
					const to = email;

					helper.sendMail(from, to, subject, message, () => {
						res.redirect('/forgot_password/' + 'pass_sucA password reset email was sent to ' + email);
					});
					//	end email

				} else {
					let message = 'pass_errUser not found';
					// console.log(message);
					res.redirect('/forgot_password/' + message);
				}
			});
			// res.render('forgot_password', { page_name });
		});
});

module.exports = router;