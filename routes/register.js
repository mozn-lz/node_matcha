var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'matcha';

function is_empty(str) {
	var ret = str.trim();
	
	if (ret.length == 0) {
		console.log('\t\tis_empty: Returning true for ' + str + ' of length ' + ret.length);
		return (true);
	}
	console.log('\t\tis_empty: Returning false for ' + str + ' of length ' + ret.length);
	return (false);
}

function is_match(str1, str2) {
	if ((is_empty(str1) && is_empty(str2)) || (str1 !== str2)) {
		return (false);
	}
	return (true);
}

/* GET register listing. */
router.get('/', function (req, res, next) {
	res.render('register', {
		page: 'Register'
	});
});


router.get('/:errors', function (req, res, next) {
	res.render('register', {
		error_list: req.params.errors.split(',')
	});/* 			START helper functions 						*/
	// Finds ireq.body.psswds string is empty
	function is_empty(str) {
		ret = str.trim();
		if (ret.length == 0) {
			return (true);
		}
		return (false);
	}
	
	// finds if param1 is equal to param 2
	function is_match(str1, str2) {
		if ((is_empty(str1) && is_empty(str2)) || (str1 !== str2)) {
			return (false);
		}
		return (true);
	}
	/* 		req.body.psswd	END helper functions 			*/
	
	
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
		if (!is_empty(chk_username)) {
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
		if (!is_empty(chk_email)) {
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
		if (!is_empty(chk_name)) {
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
		if (!is_empty(chk_surname)) {
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
		if (!is_empty(chk_psswd)) {
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
		if (!is_empty(chk_psswd1)) {
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
		if (is_match(chk_pass1, chk_pass2)) {
			// if passwords don't match or there are errors in the code
			return (true);
		} else if (!is_match(chk_pass1, chk_pass2)) {
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
			usr_psswd: psswd, // to be encrypted
			login_time: '',
			pic: [],
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
			confirm_code: Math.random() // to be encrypted
		};

		// Connect and save data to mongodb
		MongoClient.connect(url, function (err, client) {
			console.log('saving to data to database');
			assert.equal(null, err);
			console.log("Connected to server and mongo connected Successfully");
			const db = client.db(dbName);

			const collection = db.collection('users');

			collection.insertOne(usr_data, function (err, result) {
				assert.equal(null, err);
				console.log("Documents added to database: " + dbName);
				client.close();
				res.redirect('/login/' + 'pass_suc' + user + ' created successfully. Please check your emial to verity your account');
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