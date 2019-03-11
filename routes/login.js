var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'matcha';

/* GET login listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('login', { page: 'Login' });
});

router.get('/:user', function(req, res, next) {
	(req.params.user.search('pass_err') == 0) ? res.render('login', {error_list: (req.params.user).slice(8)}) : 0;
	(req.params.user.search('pass_suc') == 0) ? res.render('login', {username:	 (req.params.user).slice(8)}) : 0;
	res.render('login', {username: req.params.user});
});
router.post('/', function (req, res, next) {
	var email = req.body.email;
	var psswd = req.body.password;
	// Connect and save data to mongodbreq.params.user
req.params.user
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		var res_arr = [];
		const collection = db.collection('users');

		var usr_data = {'usr_email': email, 'usr_psswd': psswd};
		collection.find(usr_data).forEach(function (doc, err) {
			assert.equal(null, err);
			res_arr.push(doc);
		}, function () {
			client.close();			
			if (res_arr.length == 1) {
				if (res_arr[0].verified == 0) {
					res.redirect('/login/' + 'pass_errPlease check your email address to confirm your account');
				} else {
					res.redirect('/');
				}
			} else if (res_arr.length < 1) {
				res.redirect('/login/' + 'pass_errInvaild email or password');
			} else {
				res.redirect('/login/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
			}
		});
	});
});

module.exports = router;
