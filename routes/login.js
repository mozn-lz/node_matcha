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
	var usr_data = null;
	
	// Connect and save data to mongodbreq.params.user
	req.params.user
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		
		const db = client.db(dbName);
		var find_user = [];
		var user_matches = [];
		const collection = db.collection('users');
		
		var usr_credentials = {
			'usr_email': email,
			'usr_psswd': psswd
		};

		collection.find(usr_credentials).forEach(function (doc, err) {
			assert.equal(null, err);
			find_user.push(doc);
			console.log('\t\t doc: ' + doc);
		}, function () {
			client.close();
			if (find_user.length == 1) {
				if (find_user[0].verified == 0) {
					res.redirect('/login/' + 'pass_errPlease check your email address to CONFIRM your account');
				} else {
					console.log("\t\t_id", find_user[0]._id)
					req.session.uid = find_user[0]._id;
					req.session.username = find_user[0].usr_user;
					req.session.email = find_user[0].usr_email;
					req.session.name = find_user[0].usr_name;
					req.session.surname = find_user[0].usr_surname;
					req.session.usr_psswd = find_user[0].usr_psswd;
					req.session.login_time = find_user[0].login_time;
					req.session.picture = find_user[0].picture;
					req.session.age = find_user[0].age;
					req.session.gender = find_user[0].gender;
					req.session.oriantation = find_user[0].oriantation;
					req.session.rating = find_user[0].rating;
					req.session.bio = find_user[0].bio;
					req.session.intrests = find_user[0].intrests;
					req.session.gps = find_user[0].gps;
					req.session.viewd = find_user[0].viewd;
					req.session.liked = find_user[0].liked;
					req.session.verified = find_user[0].verified;
					req.session.confirm_code = find_user[0].confirm_code;
					req.session.friends = find_user[0].friends;
					req.session.notifications = find_user[0].notifications;
					(() => {
						res.redirect('/');
					})()
				}
			} else if (find_user.length < 1) {
				res.redirect('/login/' + 'pass_errInvaild email or password');
			} else {
				res.redirect('/login/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
			}
		});
	});
});

module.exports = router;