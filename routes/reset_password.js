const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const htmlencode = require('htmlencode');

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk



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
		// console.log(email);
		// console.log(code);
		res.render('reset_password', { email, code });
	} else {
		// console.log('email not found');
		res.redirect('/forgot_password' + 'pass_err' + 'Reset pssword request not found.\nPlease submit the form below to reset your password');
	}
});

router.post('/', function (req, res, next) {
	let email = req.body.email;
	let code = req.body.code;
	let password = req.body.password;
	let confirm_password = req.body.confirm_password;
	let user = [];

	// let user_data = {
	// 	'usr_email': htmlencode.htmlEncode(email),
	// 	'confirm_code': htmlencode.htmlEncode(code)
	// };

	helper_db.db_read('users', { 'usr_email': email }, user => {
		console.log(code);
		console.log(req.body.code);
		console.log(user[0].confirm_code);
		console.log(user[0].confirm_code === code);
		if (user.length === 1 && user[0].confirm_code.toString() === code[0].toString()) {
			// console.log('______user found___________________');
			if (password === confirm_password) {
				console.log('\n1 changed');
				helper_db.db_update('users',{ 'usr_email': email }, { 'usr_psswd': passwordHash.generate(password), 'confirm_code': Math.random() }, () => {	//	password change is successfull
					console.log('\nchanged');
					res.redirect('/login/' + 'pass_sucPassword has succesfully ben changed');
				});
			} else {	// passwords do not match
				console.log('\npasswords dont match');
				res.redirect(`/reset_password?email=${email}&code=${code}`);
			}
		} else {	//	code or email is invalid
			console.log('\nwho tf is this?');
			res.redirect(`/reset_password?email=${email}&code=${code}`);
		}
	});
	// setTimeout(() => {
	// 	res.redirect('/login/' + 'pass_sucPasswprd has succesfully ben changed');
	// }, 1500);
});

module.exports = router;
