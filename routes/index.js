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
				// console.log("geting matches");
				// console.log('usr_data: ' + match_criteria.gender);
				// console.log('usr_data: ' + match_criteria.exception);
				collection.find(match_criteria.gender).forEach(function (doc, err) {
					assert.equal(null, err);
					if (doc.oriantation != match_criteria.exception) {
						user_matches.push(doc);
						// console.log("doc.oriantation: " + doc.oriantation + "\t fetchData.exception: " + match_criteria.exception + '\n');
						// console.log("Result: Name: " + doc.usr_name + ", Orinat: " + doc.oriantation + " (AKA) !" + match_criteria.exception);
					}
				})
			})(), (() => {
				// console.log("this is the end");
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


() =>{
// fetchData = (req => {
// 	var user_matches = null;
// 	console.log("\t\t_____FETCH_DATA_____\n");

// 	return new Promise((resolve, reject) => {
// 		switch (req.session.oriantation) {
// 			case 'hetrosexual':
// 				if (req.session.gender == 'male') {
// 					var usr_data = { gender: 'female', exception: 'homosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 				} else {
// 					var usr_data = { gender: 'male', exception: 'homosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 				}
// 				break;
// 			case 'homosexual':
// 				if (req.session.gender == 'male') {
// 					var usr_data = { gender: 'male', exception: 'hetrosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 				} else {
// 					var usr_data = { gender: 'female', exception: 'hetrosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 				}
// 				break;
// 			case 'bisexual':
// 				if (req.session.gender == 'male') {
// 					var usr_data = { gender: 'male', exception: 'hetrosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 					var usr_data = { gender: 'female', exception: 'homosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 				} else if (req.session.gender == 'female') {
// 					var usr_data = { gender: 'female', exception: 'homosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 					var usr_data = { gender: 'male', exception: 'hetrosexual' };
// 					console.log("Looking for " + usr_data.gender + "'s, but not who are " + usr_data.exception);
// 					user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
// 					console.log(user_matches.length);
// 				}
// 				break;
// 			default:
// 				console.log('Please make sure your gender and oriantation is specified');
// 				break;
// 		}
// 		setTimeout(() => {
// 			console.log("\t\tResults fetched\n");
// 			console.log("returning data: " + user_matches);
// 			if (user_matches != null) {
// 				for (let i = 0; i < user_matches.length; i++) {
// 					// const element = res_arr[i];
// 					console.log("res_arr[" + i + "] " + user_matches[i].usr_name);
// 				}
// 			}
// 			console.log("resolve");
// 			resolve(user_matches);
// 		}, 3000);
// 	});
// });

// router.get('/', function (req, res, next) {
// 	console.log('\n\n\n\n\n\n\t\t\tWELCOME TO THE HOME PAGE\n');
// 	//   res.render('index', { title: 'Matcha' });
// 	fetchData(req).then(matches => {
// 		setTimeout(() => {
// 			fn_render_index(req, res, next, '', matches);
// 		}, 1000);
// 		console.log("matches" + matches);
// 	}).catch((error) => {
// 		var redirect_msg = "pass_errDatabase returned NULL";
// 		console.log(redirect_msg);

// 		fn_render_index(req, res, next, redirect_msg, matches);
// 		// fn_render_index(req, res, next, '', matches);
// 	});
// });
}

module.exports = router;
