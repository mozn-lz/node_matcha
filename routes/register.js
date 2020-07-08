const express = require('express');
const router = express.Router();
var htmlencode = require('htmlencode');

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk

const passwordHash = require('password-hash');

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
	var user = req.body.username;
	var email = req.body.email;
	var name = req.body.name;
	var surname = req.body.surname;
	var psswd = req.body.psswd;
	var psswd1 = req.body.psswd1;

	function check_email(chk_email) {
		re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		// console.log('email: ' + re.test(chk_email));
		(!re.test(chk_email)) ? error_log.push(`'${check_email}' is invalid`) : 0;
		return (re.test(chk_email));
	}

	function check_name(chk_name) {
		re = /^[a-zA-Z]{3,14}\w$/;
		// console.log('name: ' + re.test(chk_name));
		(!re.test(chk_name)) ? error_log.push(`'${chk_name}' is invalid`) : 0;
		return (re.test(chk_name));
	}

	function check_psswd(chk_psswd) {
		re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
		// console.log('psswd: ' + re.test(chk_psswd));
		(!re.test(chk_psswd)) ? error_log.push('Password is invalid') : 0;
		return (re.test(chk_psswd));
	}

	function pass_match(chk_pass1, chk_pass2) {
		// console.log(`${chk_pass1} === ${chk_pass2}: ` + chk_pass1 === chk_pass2);
		if (chk_pass1 === chk_pass2) {
			// console.log('passwords match');
		} else {
			// console.log('passwords dontusername match');
			error_log.push('Passwords do not match');
		}
		return (chk_pass1 === chk_pass2);
	}

	// check_username(req.body.username);
	// check_email(req.body.email);
	// check_name(req.body.name);
	// check_surname(req.body.surname);
	// check_psswd(req.body.psswd);
	// check_psswd1(req.body.psswd1);
	// pass_match(req.body.psswd, req.body.psswd1);

	// pass_match(req.body.psswd, req.body.psswd1);
	/* checks if there are any errors in saving variables from the user and if passwords match	*/
	if (
		pass_match(req.body.psswd, req.body.psswd1) &&
		check_name(req.body.username) && check_email(req.body.email) &&
		check_name(req.body.name) && check_name(req.body.surname) &&
		check_psswd(req.body.psswd) && check_psswd(req.body.psswd1)
	) {
		// store data to JSON array, to store in mongo
		// console.log(`data is valid`);
		var usr_data = {
			usr_user: htmlencode.htmlEncode(user),
			usr_name: htmlencode.htmlEncode(name),
			usr_surname: htmlencode.htmlEncode(surname),
			usr_email: htmlencode.htmlEncode(email),
			usr_psswd: passwordHash.generate(psswd),
			login_time: '',
			profile_pic: '/images/ionicons.designerpack/md-person.svg',
			age: '',
			gender: '',
			oriantation: '',
			rating: '',
			bio: '',
			gps_switch: 'show',
			gps: '',
			verified: 0,
			confirm_code: Math.random(),
			intrests: '[]',
			picture: '[]',
			blocked: '[]',
			friends: '[]',
			notifications: '[]',
			history: '[]'
		};

		// Connect and save data to mongodb

		helper_db.db_read('users', { usr_email: email }, (count) => {
			if (count.length > 0) {
				// console.log('\n\nUsername exists.\n\n');
				res.redirect('/login/' + 'pass_errEmail ' + email + ' is alreday associated with an account.');
			} else {
				// console.log('\n\nUsername does not exist.\n\n');
				helper_db.db_create('users', usr_data, () => {
					// console.log("Documents added to database: ");

					const to = email;
					const from = '';
					const subject = 'Matcha Email Verification';
					const message = `
						<form action="http://localhost:3000/verify" method="post">
							<br>Welcome to Matcha ${usr_data.usr_user}<br>
							<input type="hidden" name="email" value="${usr_data.usr_email}">
							<input type="hidden" name="code" value="${usr_data.confirm_code}">
							Please click on the button below to verify your email address<br>
							<button type="submit">Verify</button>
						</form>`;

					// console.log('\nseng email\n');
					helper.sendMail(from, to, subject, message, () => {
						res.redirect('/login/' + 'pass_suc' + user + ' created successfully. Please check your emial to verity your account');
					});
					//	end email
				});
			}
		});
	} else {

		// console.log('Error coint' + error_log.length);
		// console.log('error_log = ' + error_log);
		res.redirect('/register/' + error_log);
	}
});

module.exports = router;