var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name
let page_name = 'notifications';
let search = '';

let fn_render_notifications = (req, res, next, msg, matches) => {

	console.log('req.session.uid ', req.session.uid);
	let res_arr = matches;
	// console.log('\n\n\n________fn_render_search________\n');
	if (req.session.uid) {
		(req.session.oriantation == '') ? req.session.oriantation = 'bisexual' : 0;

		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");
		if (msg_arr == '') {
			if (res_arr > 0) {
				res_arr == null;
				res.redirect('/index/' + "pass_errThere aren't any matches");
			} else if (res_arr == null) {
				res_arr == null;
				res.redirect('/index/' + 'pass_errYou broke our matching AI, give it a few days to find you a match');
			} else {
				res_arr == null;
			}
		}
		// if (notification.type )
		res.render(page_name, {
			match_list: res_arr,
			msg_arr,
			er: pass_er,
			suc: pass_suc,
			title: page_name
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

var fn_getMatches = (req, res, next, msg) => {

	console.log('\n\t\t1. msg: ', msg, '\n\n');
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		var find_user = [];
		var user_matches = [];
		const collection = db.collection('users');
		// console.log(search_criteria);

		let notification = req.session.notifications;

		console.log(notification);
		
		// let notification = {	// notification object
		// 	from: req.session.uid,
		// 	type: 'friend request'
		// 	// type: 'send message'
		// 	// type : 'view profile'
		// }
		if (notification) {
			for (let i = 0; i < notification.length; i++) {
				collection.find({ '_id' : objectId(notification[i].from )}).forEach(function (doc, err) {
					assert.equal(null, err);
					notification[i].push(doc);
					// user_matches.push(doc);
					console.log(doc);
				}), (() => {
					client.close();
					console.log('\n\t\t3. msg: ', msg, '\n\n');
					fn_render_notifications(req, res, next, msg, notification);
				})()
			}
		} else {
			console.log('No notifications found');
			fn_render_notifications(req, res, next, msg, user_matches);
		}
	});
}

router.get('/', (req, res, next) => {
	if (req.session.uid) {
		fn_getMatches(req, res, next, '');
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getMatches(req, res, next, req.params.redirect_msg);
});

module.exports = router;
