var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'home';

function fn_render_index(req, res, next, msg, matches) {

	var res_arr = matches;
	// console.log('\n\n\n________fn_render_indexn________\n');
	if (req.session.usrId) {
		// console.log('req.session.usrId: ' + req.session.usrId);
		(req.session.oriantation == '') ? req.session.oriantation = 'bisexual' : 0;

		// console.log("Name " + req.session.usr_user + ", Oriantation is " + req.session.oriantation);
		// console.log("WE MARCH TO VICTORY");

		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");
		// console.log('2. msg_arr: ' + msg_arr + "\n3. res_arr: " + res_arr + '\n');
		if (msg_arr == '') {
			if (res_arr > 0) {
				// if user is found get their details from database
				res_arr == null;
				res.redirect('/index/' + "pass_errThere aren't any matches");
			} else if (res_arr == null) {
				res_arr == null;
				res.redirect('/index/' + 'pass_errYou broke our matching AI, give it a few days to find you a match');
			} else {
				res_arr == null;
			}
		}
		res.render('index', {
			match_list: res_arr,
			msg_arr,
			er: pass_er,
			suc: pass_suc,
			title: 'home'
		});

	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

router.get('/', function (req, res, next) {
	if (req.session.usrId) {
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var find_user = [];
			var user_matches = [];
			var match_criteria = {};
			const collection = db.collection('users');
	
			(() => {
				switch (req.session.oriantation) {
					case 'hetrosexual':
						if (req.session.gender == 'male') {
							match_criteria = { gender: 'female', exception: 'homosexual' };
							// user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
						} else {
							match_criteria = { gender: 'male', exception: 'homosexual' };
						}
						break;
					case 'homosexual':
						if (req.session.gender == 'male') {
							match_criteria = { gender: 'male', exception: 'hetrosexual' };
						} else {
							match_criteria = { gender: 'female', exception: 'hetrosexual' };
						}
						break;
					case 'bisexual':
						if (req.session.gender == 'male') {
							match_criteria = { gender: 'male', exception: 'hetrosexual' };
							match_criteria = { gender: 'female', exception: 'homosexual' };
						} else if (req.session.gender == 'female') {
							usr_match_criteriadata = { gender: 'female', exception: 'homosexual' };
							match_criteria = { gender: 'male', exception: 'hetrosexual' };
						}
						break;
					default:
						console.log('Please make sure your gender and oriantation is specified');
						break;
				}
				collection.find(match_criteria.gender).forEach(function (doc, err) {
					assert.equal(null, err);
					if (doc.oriantation != match_criteria.exception) {
						user_matches.push(doc);
					}
				})
			})(), (() => {
				client.close();
				fn_render_index(req, res, next, '', user_matches);
				// res.redirect('/');
			})()
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});



// // HANDLE Error or success messages.
// router.get('/:redirect_msg', function (req, res, next) {
// 	var matches = fetchData(req);
// 	// .then(
// 		// fn_render_index(req, res, next, '', matches)
// 		fn_render_index(req, res, next, req.params.redirect_msg, matches)
// 	// );
// });



module.exports = router;
