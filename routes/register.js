var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passwordHash = require('password-hash');

var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mk_matcha';

// function is_empty(str) {
// 	var ret = str.trim();

// 	if (ret.length == 0) {
// 		return (true);
// 	}
// 	return (false);
// }

// function is_match(str1, str2) {
// 	if ((helper.is_empty(str1) && helper.is_empty(str2)) || (str1 !== str2)) {
// 		return (false);
// 	}
// 	return (true);
// }

/* GET register listing. */
router.get('/', function (req, res, next) {
	res.render('register', {
		page: 'Register'
	});
});


router.get('/:errors', function (req, res, next) {
	res.render('register', {
		error_list: req.params.errors.split(',')
	});
});

router.post('/', function (req, res, next) {
	var error_log = [];
	var user;
	var email;
	var name;
	var surname;
	var psswd;
	var psswd1;

	function check_username(chk_username) {
		if (!helper.is_empty(chk_username)) {
			user = req.body.username;
			console.log('username stored as [username]');
			return (true);
		} else {
			error_log.push('username is invalid');
			console.log(error_log);
			return (false);
		}
	}

	function check_email(chk_email) {
		if (!helper.is_empty(chk_email)) {
			email = req.body.email;
			console.log('email stored as [email]');
			return (true);
		} else {
			error_log.push('email is invalid');
			console.log(error_log);
			return (false);
		}
	}

	function check_name(chk_name) {
		if (!helper.is_empty(chk_name)) {
			name = req.body.name;
			console.log('name stored as [name]');
			return (true);
		} else {
			error_log.push('name is invalid');
			console.log(error_log);
			return (false);
		}
	}

	function check_surname(chk_surname) {
		if (!helper.is_empty(chk_surname)) {
			surname = req.body.surname;
			console.log('surname stored as [surname]');
			return (true);
		} else {
			error_log.push('surname is invalid');
			console.log(error_log);
			return (false);
		}
	}

	function check_psswd(chk_psswd) {
		if (!helper.is_empty(chk_psswd)) {
			psswd = req.body.psswd;
			console.log('Password stored as [psswd]');
			return (true);
		} else {
			error_log.push('Confirmed password is invalid');
			console.log(error_log);
			return (false);
		}
	}

	function check_psswd1(chk_psswd1) {
		if (!helper.is_empty(chk_psswd1)) {
			psswd1 = req.body.psswd1;
			console.log('psswd1 stored as [psswd1]');
			return (true);
		} else {
			error_log.push('psswd1 is invalid');
			console.log(error_log);
			return (false);
		}
	}

	function pass_match(chk_pass1, chk_pass2) {
		if (helper.is_match(chk_pass1, chk_pass2)) {
			// if passwords don't match or there are errors in the code
			return (true);
		} else if (!helper.is_match(chk_pass1, chk_pass2)) {
			error_log.push('Passwords do not match');
			return (false)
		}
	}

	check_username(req.body.username);
	check_email(req.body.email);
	check_name(req.body.name);
	check_surname(req.body.surname);
	check_psswd(req.body.psswd);
	check_psswd1(req.body.psswd1);
	pass_match(req.body.psswd, req.body.psswd1);

	/* checks if there are any errors in saving variables from the user and if passwords match	*/
	if (check_username(req.body.username) && check_email(req.body.email) && check_name(req.body.name) && check_surname(req.body.surname) && check_psswd(req.body.psswd) && check_psswd1(req.body.psswd1) && pass_match(req.body.psswd, req.body.psswd1)) {
		// store data to JSON array, to store in mongo
		var usr_data = {
			usr_user: user,
			usr_email: email,
			usr_name: name,
			usr_surname: surname,
			usr_psswd: passwordHash.generate(psswd), // to be encrypted
			login_time: '',
			profile: '/images/ionicons.designerpack/md-person.svg',
			age: null,
			gender: '',
			oriantation: '',
			rating: '',
			bio: '',
			intrests: [],
			gps: '',
			viewd: [],
			liked: [],
			verified: 0,
			confirm_code: Math.random()
		};

		// Connect and save data to mongodb
		MongoClient.connect(url, function (err, client) {
			console.log('saving to data to database');
			assert.equal(null, err);
			console.log("Connected to server and mongo connected Successfully");
			const db = client.db(dbName);
			const collection = db.collection('users');

			collection.count({ usr_email: email })
				.then((count) => {
					if (count > 0) {
						console.log('Username exists.');
						res.redirect('/login/' + 'pass_errEmail ' + email + ' is alreday associated with an account.');
					} else {
						console.log('Username does not exist.');
						collection.insertOne(usr_data, function (err, result) {
							assert.equal(null, err);
							console.log("Documents added to database: " + dbName);
							client.close();
							// helper.sendMail(to, from, subject, message);
/*
									user: 'unathinkomo16@gmail.com',
									pass: '0786324448'
*/	

							const to = email;
							const from = '';
							const subject = 'Matcha Email Verification';
							const message = `<br>Welcome to Matcha ${usr_data.usr_user }<br>
							Please click on the button below to verify your email address<br>
							<a href="http://localhost:3000/verify?email=${usr_data.usr_email}&code=${usr_data.confirm_code}"><button>Verify</button></a>
							`;

							helper.sendMail(from, to, subject, message, ()=>{res.redirect('/login/' + 'pass_suc' + user + ' created successfully. Please check your emial to verity your account');});
							//	end email

							
						});
					}
				});
		});
	} else {
		console.log('Error coint' + error_log.length);
		console.log('error_log = ' + error_log);
		res.redirect('/register/' + error_log);
	}
});

module.exports = router;