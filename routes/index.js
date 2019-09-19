var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'home';

function fn_render_index(req, res, next, msg) {
	var res_arr;
	console.log('\n\n\nfn_render_index\n');
	if (req.session.usrId) {
		console.log('req.session.usrId: ' + req.session.usrId);
		(req.session.oriantation == '') ? req.session.oriantation = 'bisexual' : 0;

		switch (req.session.oriantation) {
			case 'hetrosexual':
				if (req.session.gender == 'male') {
					// getWemen('!homo');
					var usr_data = { gender: 'female' };
					res_arr = helper.search_DB(usr_data, 'homosexual');
				} else {
					// getMen('!homo');
					var usr_data = { gender: 'male' };
					res_arr = helper.search_DB(usr_data, 'homosexual');
				}
				break;
			case 'homosexual':
				if (req.session.gender == 'male') {
					// getMen('!hetro');
					var usr_data = { gender: 'male' };
					res_arr = helper.search_DB(usr_data, 'hetrosexual');
				} else {
					// getWemen('!hetro');
					var usr_data = { gender: 'female' };
					res_arr = helper.search_DB(usr_data, 'hetrosexual');
				}
				break;
			case 'bisexual':
				if (req.session.gender == 'male') {
					// getMen('!hetro') &&  getWemen('!homo');
					var usr_data = { gender: 'male' };
					res_arr = helper.search_DB(usr_data, 'hetrosexual');
					var usr_data = { gender: 'female' };
					res_arr = helper.search_DB(usr_data, 'homosexual');
				} else {
					// getMen('!homo') && getWemen('!hetro');
					var usr_data = { gender: 'female' };
					res_arr = helper.search_DB(usr_data, 'homosexual');
					var usr_data = { gender: 'male' };
					res_arr = helper.search_DB(usr_data, 'hetrosexual');
				}
				break;
			default:
				console.log('Please make sure your gender and oriantation is specified');
				break;
		}

		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");
		console.log('\t2. msg_arr: ' + msg_arr);
		console.log("\t\t3. res_arr: " + res_arr);
		if (msg_arr == ''){
			if (res_arr > 0) {
				// if user is found get their details from database
				res_arr == null;
				res.redirect('/index/' + "pass_errThere aren't any matches");
			} else if (res_arr == null){
				res_arr == null;
				res.redirect('/index/' + 'pass_errYou broke our matching AI, give it a few days to find you a match');
				// res_arr = NULL
			} else {
				res_arr == null;
			}
		}
		// } else {
		// 	console.log("\tpass_errThere seams to be a dubious error that popped up, Please try again");
		// 	res.render('index', {
		// 		title: 'home',
		// 		er: pass_er,
		// 		suc: pass_suc,
		// 		msg_arr
		// 		// match_list: res_arr
		// 		// username: res_arr.usr_user,
		// 		// email: res_arr.ufname: res_arr.usr_name,
		// 		// surnamesr_email,
		// 		// : res_arr.usr_surname,
		// 		// login_time: res_arr.login_time,
		// 		// pic: res_arr.pic,
		// 		// age: res_arr.age,
		// 		// gender: res_arr.gender,
		// 		// oriantation: res_arr.oriantation,
		// 		// rating: res_arr.rating,
		// 		// bio: res_arr.bio,
		// 		// intrests: res_arr.intrests,
		// 		// gps: res_arr.gps,
		// 		// viewd: res_arr.viewd,
		// 		// liked: res_arr.liked
		// 	});
		// }
		res.render('index', {
			title: 'home',
			er: pass_er,
			suc: pass_suc,
			msg_arr,
			match_list: res_arr
		});
		// else if (res_arr.length < 1) {
		// 	res.redirect('/' + 'pass_errInvaild email or password');
		// } 

	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

router.get('/', function (req, res, next) {
	console.log('\n\n\n\n\n\n\t\t\tWELCOME TO THE HOME PAGE\n');

	fn_render_index(req, res, next, '');
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Matcha' });
// });

// HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	fn_render_index(req, res, next, req.params.redirect_msg);
});

module.exports = router;
