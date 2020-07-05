const express = require('express');
const router = express.Router();
var htmlencode = require('htmlencode');

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk

const passwordHash = require('password-hash');
const faker = require('faker');
// const passwordHash = require('./lib/password-hash');

const page_name = 'login';		// page name

// Use connect method to connect to the server


// get access to the relevant collections

let users = [];

let table = 'users';

let maxUSers = 20;
let minAge = 18;
let maxAge = 50;
let data = 1;

helper_db.db_read('users', 1, (count) => {
	console.log(count.length);
	if (count.length < 20) {
		for (let i = 0; i < maxUSers; i++) {
			const genders = ['male', 'female'];
			const oriantations = ['hetrosexual', 'homosexual', 'bisexual'];
			const name = faker.name.firstName();
			const surname = faker.name.lastName();
			let gender = faker.random.arrayElement(genders);
			let oriantation = faker.random.arrayElement(oriantations);
			let age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
			let rating = Math.floor(Math.random() * (5)) + 1; // random from 1-5
			password = "!!11QQqq";

			let newUser = {
				usr_user: name,
				usr_email: faker.internet.email(name, surname),
				usr_name: name,
				usr_surname: surname,
				usr_psswd: passwordHash.generate(password),
				login_time: '',
				profile_pic: '/images/ionicons.designerpack/md-person.svg',
				age,
				gender,
				oriantation,
				rating,
				bio: '',
				gps: '',
				verified: 1,
				confirm_code: Math.random(),
				intrests: '',
				blocked: '',
				friends: '',
				notifications: '',
				picture: '',
				history: ''
			};
			users.push(newUser);
		}
		for (let i = users.length; i < maxUSers; i++) {
			helper_db.db_create('users', users[i], () => { console.log('\t\t', maxUSers, ' users created\n') });
			// console.log(`${i + 1}.${users[i].usr_user} ${users[i].usr_email}`);
		}
	} else {
		console.log(`Users past ${maxUSers}`)
	}
});


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
	}) : 0;
	(req.params.user.search('pass_suc') == 0) ? res.render(page_name, {
		username: (req.params.user).slice(8)
	}) : 0;
	res.render(page_name, {
		username: req.params.user
	});
});

router.post('/', function (req, res, next) {
	var email = htmlencode.htmlEncode(req.body.email);
	var psswd = htmlencode.htmlEncode(req.body.password);
	var usr_data = null;

	// Connect and save data to mongodbreq.params.user
	req.params.user
	helper_db.db_read('users', { 'usr_email': email }, find_user => {
		if (find_user.length == 1 && passwordHash.verify(psswd, find_user[0].usr_psswd)) {
			if (find_user[0].verified == 0) {
				res.redirect('/login/' + 'pass_errPlease check your email address to VERIFY your account');
			} else if (find_user[0].verified == 1) {
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
				req.session.blocked = find_user[0].blocked;
				(() => {
					res.redirect('/');
				})()
			} else if (find_user[0].verified === 2) {
				res.redirect('/login/' + 'pass_errYour account has been reported as fake, please contact admin');
			} else {
				res.redirect('/login/');
			}
		} else if (find_user.length < 1) {
			res.redirect('/login/' + 'pass_errInvaild email or password');
		} else {
			res.redirect('/login/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
		}
	});
});

module.exports = router;