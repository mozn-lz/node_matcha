var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';	// Database(mongo) url

const dbName = 'matcha';		// Database Name
const page_name = 'login';		// page name

/* GET login listing. */
router.get('/', function (req, res, next) {
	res.render('login', {
		page: 'Login'
	});
});

// handling Error or success messages. 
router.get('/:user', function (req, res, next) {
	(req.params.user.search('pass_err') == 0) ? res.render(page_name, {
		error_list: (req.params.user).slice(8)
	}): 0;
	(req.params.user.search('pass_suc') == 0) ? res.render(page_name, {
		username: (req.params.user).slice(8)
	}): 0;
	res.render(page_name, {
		username: req.params.user
	});
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

		var usr_data = {
			'usr_email': email,
			'usr_psswd': psswd
		};
		collection.find(usr_data).forEach(function (doc, err) {
			assert.equal(null, err);
			res_arr.push(doc);
			console.log('\t\t' + res_arr);
		}, function () {
			client.close();
			if (res_arr.length == 1) {
				if (res_arr[0].verified == 0) {
					res.redirect('/login/' + 'pass_errPlease check your email address to CONFIRM your account');
				} else {
					req.session.usrId = res_arr[0]._id;
					req.session.usr_user = res_arr[0].usr_user;
					req.session.usr_email = res_arr[0].usr_email;
					req.session.usr_name = res_arr[0].usr_name;
					req.session.usr_surname = res_arr[0].usr_surname;
					req.session.usr_psswd = res_arr[0].usr_psswd;
					req.session.login_time = res_arr[0].login_time;
					req.session.pic = res_arr[0].pic;
					req.session.age = res_arr[0].age;
					req.session.gender = res_arr[0].gender;
					req.session.oriantation = res_arr[0].oriantation;
					req.session.rating = res_arr[0].rating;
					req.session.bio = res_arr[0].bio;
					req.session.intrests = res_arr[0].intrests;
					req.session.gps = res_arr[0].gps;
					req.session.viewd = res_arr[0].viewd;
					req.session.liked = res_arr[0].liked;
					req.session.verified = res_arr[0].verified;
					req.session.confirm_code = res_arr[0].confirm_code;
					
					console.log('\t\t res_arr[0]._id: ' + res_arr[0]._id);
					console.log('\t\t req.session.usrId: ' + req.session.usrId);
					// req.session.email = res_arr[0].usr_email;
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