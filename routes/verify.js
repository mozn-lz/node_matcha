var express = require('express');
var router = express.Router();
const helper_db = require('./helper_db'); // Helper functions Mk

/* GET verify listing. */
router.get('/', function (req, res, next) {
	// res.redirect('/login/' + 'pass_sucYour sccount has been verified<br> user your email and password to login');
	const email = req.query.email;
	const code = req.query.code;
	console.log('1. No param: email: ', email);
	console.log('1. No param: code: ', code);

	if(email && code) {
		helper_db.db_read('users', { 'usr_email': email }, user => {
			if (user.length === 1 && user[0].confirm_code === parseFloat(code)) {
				console.log('______user found___________________');
				helper_db.db_update('users', { 'usr_email': email }, { 'verified': 1, 'confirm_code': Math.random() }, () => {
					res.redirect('/login/' + 'pass_sucYour sccount has been verified\n user your email and password to login');
				});
			} else {
				console.log('Invalid request', user.length);
				console.log(user[0].confirm_code, '\n', code);
				res.redirect('/login/' + 'pass_errVerification request not found');
				res.render('verify');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errVerification request not found');
	}
});

module.exports = router;
