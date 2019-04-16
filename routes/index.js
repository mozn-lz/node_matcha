var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'home';

function is_empty(str) {
	ret = str.trim();
	if (ret.length == 0) {
		return (true);
	}
	return (false);
}

function fn_render_index(req, res, next, msg) {
	console.log('\n\n\nfn_render_index\n');
	if (req.session.usrId) {
		// console.log('req.session.email: ' + req.session.email);
		console.log('req.session.usrId: ' + req.session.usrId);

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var res_arr = [];
			const collection = db.collection('users');

			var gender;
			// var sexuality;
			
			// 	req.session.oriantation = 'straight';
			// 	req.session.gender = 'male';
			// switch (key) {
			// 	case value:
					
			// 		break;
			
			// 	default:
			// 		break;
			// }

			gender = '';
			var usr_data = {
				'gender': gender
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
				if (res_arr) {
					// if user is found get their details from database
					res.render('index', {
						title: 'home',
						er: pass_er,
						suc: pass_suc,
						msg_arr,
						match_list: res_arr
						// username: res_arr.usr_user,
						// email: res_arr.usr_email,
						// fname: res_arr.usr_name,
						// surname: res_arr.usr_surname,
						// login_time: res_arr.login_time,
						// pic: res_arr.pic,
						// age: res_arr.age,
						// gender: res_arr.gender,
						// oriantation: res_arr.oriantation,
						// rating: res_arr.rating,
						// bio: res_arr.bio,
						// intrests: res_arr.intrests,
						// gps: res_arr.gps,
						// viewd: res_arr.viewd,
						// liked: res_arr.liked
					});
				} else if (res_arr.length < 1) {
					res.redirect('/' + 'pass_errInvaild email or password');
				} else {
					res.redirect('/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
				}
			});
		});
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
