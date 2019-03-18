var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'matcha';

var page_name = 'Profile';


/* GET profile listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');

	if (req.session.email) {
		console.log('req.session.email: ' + req.session.email);

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var res_arr = [];
			const collection = db.collection('users');

			var usr_data = {
				'usr_email': req.session.email
			};

			collection.find(usr_data).forEach(function (doc, err) {
				assert.equal(null, err);
				res_arr.push(doc);
			}, function () {
				client.close();
				if (res_arr.length == 1) {
					// if user is found get their details from database
					res.render('profile', {
						title: 'Profile',
						username: res_arr[0].usr_user,
						email: res_arr[0].usr_email,
						fname: res_arr[0].usr_name,
						surname: res_arr[0].usr_surname,
						login_time: res_arr[0].login_time,
						pic: res_arr[0].pic,
						age: res_arr[0].age,
						gender: res_arr[0].gender,
						oriantation: res_arr[0].oriantation,
						rating: res_arr[0].rating,
						bio: res_arr[0].bio,
						intrests: res_arr[0].intrests,
						gps: res_arr[0].gps,
						viewd: res_arr[0].viewd,
						liked: res_arr[0].liked
					});
				} else if (res_arr.length < 1) {
					res.redirect('/login/' + 'pass_errInvaild email or password');
				} else {
					res.redirect('/login/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
				}
			});
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

// // handling Error or success messages. 
// router.get('/:user', function (req, res, next) {
// 	(req.params.user.search('pass_err') == 0) ? res.render(page_name, {
// 		error_list: (req.params.user).slice(8)
// 	}): 0;
// 	(req.params.user.search('pass_suc') == 0) ? res.render(page_name, {
// 		username: (req.params.user).slice(8)
// 	}): 0;
// 	res.render('profile', {
// 		username: req.params.user
// 	});
// });

router.post('/', function (req, res, next) {
	var error_log = [];
	var profile_username
	var profile_email
	var profile_name
	var profile_surname
	var profile_age
	var profile_gender
	var profile_oriantation
	var profile_bio
	var profile_gps

	function check_usr_user(chk_usr_user) {
		if (!typeof helper.is_empty(chk_usr_user)) {
			profile_username = req.body.usr_user;
			return (true);
		} else {
			error_log.push('usr_user is not valid');
			return (false)
		}
	}

	function check_usr_email(chk_usr_email) {
		if (!typeof helper.is_empty(chk_usr_email)) {
			profile_email = req.body.usr_email;
			return (true);
		} else {
			error_log.push('usr_email is not valid');
			return (false)
		}
	}

	function check_usr_name(chk_usr_name) {
		if (!typeof helper.is_empty(chk_usr_name)) {
			profile_name = req.body.usr_name;
			return (true);
		} else {
			error_log.push('usr_name is not valid');
			return (false)
		}
	}

	function check_usr_surname(chk_usr_surname) {
		if (!typeof helper.is_empty(chk_usr_surname)) {
			profile_surname = req.body.usr_surname;
			return (true);
		} else {
			error_log.push('usr_surname is not valid');
			return (false)
		}
	}

	function check_age(chk_age) {
		if (!typeof helper.is_empty(chk_age)) {
			profile_age = req.body.age;
			return (true);
		} else {
			error_log.push('age is not valid');
			return (false)
		}
	}

	function check_gender(chk_gender) {
		if (!typeof helper.is_empty(chk_gender)) {
			profile_gender = req.body.gender;
			return (true);
		} else {
			error_log.push('gender is not valid');
			return (false)
		}
	}

	function check_oriantation(chk_oriantation) {
		if (!typeof helper.is_empty(chk_oriantation)) {
			profile_oriantation = req.body.oriantation;
			return (true);
		} else {
			error_log.push('oriantation is not valid');
			return (false)
		}
	}

	function check_bio(chk_bio) {
		if (!typeof helper.is_empty(chk_bio)) {
			profile_bio = req.body.bio;
			return (true);
		} else {
			error_log.push('bio is not valid');
			return (false)
		}
	}

	function check_gps(chk_gps) {
		if (chk_gps == 'on') {
			profile_gps = 1;
		} else {
			profile_gps = 0;
		}
	}



	check_usr_user(req.body.username);
	check_usr_email(req.body.email);
	check_usr_name(req.body.fname);
	check_usr_surname(req.body.lname);
	check_age(req.body.age);
	check_gender(req.body.gender);
	check_oriantation(req.body.orientation);
	check_bio(req.body.bio);
	check_gps(req.body.gps);


	/* checks if there are any errors in saving variables from the user and if passwords match	*/

	// if (check_usr_user(req.body.usr_user) && check_usr_email(req.body.usr_email) && check_usr_name(req.body.usr_name) && check_usr_surname(req.body.usr_surname) && check_login_time(req.body.login_time) && check_pic(req.body.pic) && check_age(req.body.age) && check_gender(req.body.gender) && check_oriantation(req.body.oriantation) && check_bio(req.body.bio) && check_gps(req.body.gps)) {
	if (check_usr_user(req.body.username) && check_usr_email(req.body.email) && check_usr_name(req.body.fname) && check_usr_surname(req.body.lname) && check_age(req.body.age) && check_gender(req.body.gender) && check_oriantation(req.body.orientation) && check_bio(req.body.bio) && check_gps(req.body.gps)) {
		// store data to JSON array, to store in mongo
		var usr_data = {
			usr_user: profile_username,
			usr_email: profile_email,
			usr_name: profile_name,
			usr_surname: profile_surname,
			age: profile_age,
			gender: profile_gender,
			oriantation: profile_oriantation,
			bio: profile_bio,
			gps: profile_gps
		};

		// Connect and save data to mongodb
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			console.log("Connected to server and mongo connected Successfully");
			const db = client.db(dbName);

			const collection = db.collection('users');

			collection.insertOne(usr_data, function (err, result) {
				assert.equal(null, err);
				console.log("Documents added to database: " + dbName);
				client.close();
				res.redirect('/login/' + user);
			});
		});
		console.log('end of poeting finction');
	} else {
		console.log('Error coint' + error_log.length);
		console.log('error_log = ' + error_log);
		res.redirect('/register/' + error_log);
	}

});


module.exports = router;