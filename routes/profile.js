var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
// var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name
var page_name = 'Profile';

function is_empty(str) {
	ret = str.trim();
	if (ret.length == 0) {
		return (true);
	}
	return (false);
}

function fn_render_profile(req, res, next, msg) {
	console.log('\n\n\nfn_render_profile\n');
	if (req.session.usrId) {
		console.log('req.session.usrId: ' + req.session.usrId);

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var res_arr = [];
			const collection = db.collection('users');

			var usr_data = {
				'_id': objectId(req.session.usrId)
			};

			var msg_arr = [];
			(msg.search('pass_err') == 0) ? pass_er = "danger": pass_er = '';
			(msg.search('pass_suc') == 0) ? pass_suc = "success": pass_suc = '';
			msg_arr = msg.slice(8).split(",");
			console.log('msg_arr: ' + msg_arr);

			collection.find(usr_data).forEach(function (doc, err) {
				assert.equal(null, err);
				res_arr.push(doc);
			}, function () {
				client.close();
				if (res_arr.length == 1) {
					// if user is found get their details from database
					res_arr[0].gender == 'male'? male = 'male' : male = ''; 
					res_arr[0].gender == 'female'? female = 'female' : female = ''; 
					res_arr[0].oriantation == 'hetrosexual'? hetrosexual = 'hetrosexual' : hetrosexual = ''; 
					res_arr[0].oriantation == 'homosexual'? homosexual = 'homosexual' : homosexual = ''; 
					res_arr[0].oriantation == 'bisexual'? bisexual = 'bisexual' : bisexual = ''; 					

					res.render('profile', {
						title: 'Profile',
						er: pass_er,
						suc: pass_suc,
						msg_arr,
						username: res_arr[0].usr_user,
						email: res_arr[0].usr_email,
						fname: res_arr[0].usr_name,
						surname: res_arr[0].usr_surname,
						login_time: res_arr[0].login_time,
						pic: res_arr[0].pic,
						age: res_arr[0].age,
						gender: res_arr[0].gender,
						oriantation: res_arr[0].oriantation,
						male,
						female,
						hetrosexual,
						homosexual,
						bisexual,
						rating: res_arr[0].rating,
						bio: res_arr[0].bio,
						intrests: res_arr[0].intrests,
						gps: res_arr[0].gps,
						viewd: res_arr[0].viewd,
						liked: res_arr[0].liked
					});
				} else if (res_arr.length < 1) {
					res.redirect('/profile/' + 'pass_errInvaild email or password');
				} else {
					res.redirect('/profile/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
				}
			});
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

router.get('/', function (req, res, next) {
	console.log('\n\n\n\n\n\n\t\t\tWELCOME TO THE PROFILE PAGE\n');

	fn_render_profile(req, res, next, '');
});

// HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	fn_render_profile(req, res, next, req.params.redirect_msg);
});

router.post('/', function (req, res, next) {
	var redirect_msg = [];
	var profile_username;
	var profile_email;
	var profile_name;
	var profile_surname;
	var profile_age;
	var profile_gender;
	var profile_oriantation;
	var profile_bio;
	var profile_gps;

	function check_usr_user(chk_usr_user) {
		if (is_empty(chk_usr_user)) {
			console.log('\tcheck_usr_user: Username is not valid');
			redirect_msg.push('Username is not valid');
			return (false);
		} else {
			profile_username = chk_usr_user;
			return (true);
		}
	}

	function check_usr_email(chk_usr_email) {
		if (is_empty(chk_usr_email)) {
			redirect_msg.push('Email is not valid');
			return (false);
		} else {
			profile_email = chk_usr_email;
			return (true);
		}
	}

	function check_usr_name(chk_usr_name) {
		if (is_empty(chk_usr_name)) {
			redirect_msg.push('Name is not valid');
			return (false);
		} else {
			profile_name = chk_usr_name;
			return (true);
		}
	}

	function check_usr_surname(chk_usr_surname) {
		if (is_empty(chk_usr_surname)) {
			redirect_msg.push('Surname is not valid');
			return (false);
		} else {
			profile_surname = chk_usr_surname;
			return (true);
		}
	}

	function check_age(chk_age) {
		if (is_empty(chk_age)) {
			redirect_msg.push('Age is not valid');
			return (false);
		} else {
			profile_age = chk_age;
			return (true);
		}
	}

	function check_gender(chk_gender) {
		if (is_empty(chk_gender)) {
			redirect_msg.push('Gender is not valid');
			return (false);
		} else {
			profile_gender = chk_gender;
			return (true);
		}
	}

	function check_oriantation(chk_oriantation) {
		if (is_empty(chk_oriantation)) {
			redirect_msg.push('Oriantation is not valid');
			return (false);
		} else {
			profile_oriantation = chk_oriantation;
			return (true);
		}
	}

	function check_bio(chk_bio) {
		if (is_empty(chk_bio)) {
			redirect_msg.push('Bio is not valid');
			return (false);
		} else {
			profile_bio = chk_bio;
			return (true);
		}
	}

	function check_gps(chk_gps) {
		if (chk_gps == 'on') {
			profile_gps = 1;
		} else {
			profile_gps = 0;
		}
		return (true);
	}

	/* because the if statement below will stop on the fist False 
		this is to log all errors (if any)	*/
	console.log('\t\t username: ' + req.body.username);
	console.log('\t\t email: ' + req.body.email);
	console.log('\t\t fname: ' + req.body.fname);
	console.log('\t\t lname: ' + req.body.lname);
	console.log('\t\t age: ' + req.body.age);
	console.log('\t\t gender: ' + req.body.gender);
	console.log('\t\t orientation: ' + req.body.orientation);
	console.log('\t\t bio: ' + req.body.bio);
	console.log('\t\t gps: ' + req.body.gps);
	check_usr_user(req.body.username);
	check_usr_email(req.body.email);
	check_usr_name(req.body.fname);
	check_usr_surname(req.body.lname);
	check_age(req.body.age);
	check_gender(req.body.gender);
	check_oriantation(req.body.orientation);
	check_bio(req.body.bio);
	check_gps(req.body.gps);

	if (check_usr_user(req.body.username) && check_usr_email(req.body.email) && check_usr_name(req.body.fname) && check_usr_surname(req.body.lname) && check_age(req.body.age) && check_gender(req.body.gender) && check_oriantation(req.body.orientation) && check_bio(req.body.bio) && check_gps(req.body.gps)) {
		// store data to JSON array, to store in mongo
		console.log('\tNo errors found');
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
			console.log("\tConnected to server and mongo connected Successfully");
			const db = client.db(dbName);
			const collection = db.collection('users');
			collection.updateOne({
				'_id': objectId(req.session.usrId)
			}, {	
				$set: {
					usr_user: profile_username,
					usr_email: profile_email,
					usr_name: profile_name,
					usr_surname: profile_surname,
					age: profile_age,
					gender: profile_gender,
					oriantation: profile_oriantation,
					bio: profile_bio,
					gps: profile_gps,
				}
			}, function (err, resulr) {
				assert.equal(null, err);
				client.close();
				console.log('\t\tend of poeting finction');
				redirect_msg_type = 'pass_suc';
				redirect_msg.push('Your information Changed');
				req.session.email = profile_email;
				res.redirect('/profile/' + redirect_msg_type + redirect_msg);
			});
		});
	} else {
		console.log('something is wrong\n\tError Count: ' + redirect_msg.length);
		console.log('redirect_msg = ' + redirect_msg);
		redirect_msg_type = 'pass_err';
		res.redirect('/profile/' + redirect_msg_type + redirect_msg);
	}
});

module.exports = router;