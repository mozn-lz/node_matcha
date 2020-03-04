var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'mk_matcha';

/* GET verify listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('verify', { page: 'Verify' });
});
router.post('/', function (req, res, next) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		const db = client.collection('users');

		var usr_data = {
			'usr_email': email,
			'usr_code' : usr_code
		};
		collection.find(usr_data).forEach(function (doc, err) {
			assert.equal(null, err);
			res_arr.push(doc);
		}, function () {
			if (res_arr.length == 1) {
				// result found
				collection.update({usr_email: res_arr[0].usr_emaill}, {$set: {verified: 1}}), function (err, result) {
					assert.equal(null, err);
					client.close();
					// set account to activated and reset usr_code
					res.redirect('/login' + 'pass_sucYour account has been successfully verified');
				}
				// reset usr_code
			} else if (res_arr.length < 1) {
				// no record
					res.redirect('/login' + 'pass_errIt doen\'t look like you have an account. If your sure you have an account go back to your email address and follow the link.');
			} else if (res_arr.length > 1) {
				// too many records
					res.redirect('/login' + 'pass_errThe server is swamped with work, please try again.');
			} else {
				// if email or verification code does not exist
				res.redirect('/login' + 'pass_errThere was an unknown error, its possible your link has alreay been used');
			}
		});
	});
});

module.exports = router;
