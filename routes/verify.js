var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'mk_matcha';

/* GET verify listing. */
router.get('/', function (req, res, next) {
	// res.redirect('/login/' + 'pass_sucYour sccount has been verified<br> user your email and password to login');
	const email = req.query.email;
	const code = req.query.code;
	console.log('1. No param: email: ', email);
	console.log('1. No param: code: ', code);
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
				collection.updateOne({ 
					'usr_email': email 
				}, {
					$set: {
						'verified' : 1,
						'confirm_code': Math.random()
					}
				}, () => {
					res.redirect('/login/' + 'pass_sucYour sccount has been verified\n user your email and password to login');
				});
			} else {
				console.log('Invalid request', user.length);
				console.log(user[0].confirm_code, '\n',code);
				res.redirect('/login/' + 'pass_errVerification request not found');
				res.render('verify');
			}
		});
	});
});

// router.post('/', function (req, res, next) {
// 	console.log('POST\n');
// 	MongoClient.connect(url, function (err, client) {
// 		assert.equal(null, err);
// 		const db = client.collection('users');

// 		var usr_data = {
// 			'usr_email': email,
// 			'usr_code': usr_code
// 		};
// 		collection.find(usr_data).forEach(function (doc, err) {
// 			assert.equal(null, err);
// 			res_arr.push(doc);
// 		}, function () {
// 			if (res_arr.length == 1) {
// 				// result found
// 				collection.update({ usr_email: res_arr[0].usr_emaill }, {
// 					$set: {
// 						verified: 1,
// 						confirm_code: (Math.random())
// 					}
// 				}), function (err, result) {
// 					assert.equal(null, err);
// 					client.close();
// 					// set account to activated and reset usr_code
// 					res.redirect('/login' + 'pass_sucYour account has been successfully verified');
// 				}
// 				// reset usr_code
// 			} else if (res_arr.length < 1) {
// 				// no record
// 				res.redirect('/login' + 'pass_errIt doen\'t look like you have an account. If your sure you have an account go back to your email address and follow the link.');
// 			} else if (res_arr.length > 1) {
// 				// too many records
// 				res.redirect('/login' + 'pass_errThe server is swamped with work, please try again.');
// 			} else {
// 				// if email or verification code does not exist
// 				res.redirect('/login' + 'pass_errThere was an unknown error, its possible your link has alreay been used');
// 			}
// 		});
// 	});
// });

module.exports = router;
