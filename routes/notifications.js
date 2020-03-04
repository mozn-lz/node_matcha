var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';;					// Database Name
let page_name = 'notifications';
let search = '';

let fn_render_notifications = (req, res, next, msg, matches) => {

	// console.log('req.session.uid ', req.session.uid);
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
		// console.log('res Arr: ', res_arr);

		// if (notification.type )
		res.render(page_name, {
			notifications: res_arr,
			msg_arr,
			er: pass_er,
			suc: pass_suc,
			title: page_name
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

// function vis(){
function fn_getMatches (req, res, next, msg) {

	console.log('\n\t\t1. msg: ', msg, '\n\n');
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		// var find_user = [];
		var user_matches = [];
		const collection = db.collection('users');
		// console.log(search_criteria);

		let notification = req.session.notifications;
		
		if (notification) {
			let find_user = new Promise((resolve, reject) => {
				for (let i = 0; i <= notification.length; i++) {
					if (i < notification.length) {
						collection.find({ '_id': objectId(notification[i].from) }).forEach(function (doc, err) {
							assert.equal(null, err);
							// user_matches[i].push(doc);
							// console.log(doc);
							// 	from: req.session.uid,
							notification[i].pic = doc.profile;
							notification[i].name = doc.usr_user;
							if (notification[i].type == 'friend request') {
								notification[i].request = 'friend request';
								// notification[i].request = true;
								console.log('\t\tnotification.request: ', notification[i].request);
							} else if (notification[i].type == 'send message') {
								notification[i].message = 'send message';
								// notification[i].message = true;
								console.log('\t\tnotification.message: ', notification[i].message);
							} else if (notification[i].type == 'view profile') {
								// notification[i].profile = true;
								notification[i].profile = 'view profile';
								console.log('\t\tnotification.profile: ', notification[i].profile);
							}
						});
					}
					 else {
						// console.log('Irh  i: ', i);
						
						// console.log('notification: ', notification, " \nnote.");
						// console.log('notification.length, ', notification.length);
											// if (i == notification.length) {
											// 	console.log(notification[0].from, " ", notification[0].type, " R:", notification[0].request, " P:", notification[0].profile, " M:", notification[0].message);
											// 	console.log(notification[1].from, " ", notification[1].type, " R:", notification[1].request, " P:", notification[1].profile, " M:", notification[1].message);
											// 	fn_render_notifications(req, res, next, msg, notification);
											// 	console.log('\n\t\tClosing database\n\n');
											// 	client.close();
											// }
						client.close();
						console.log('\n\t\t3. msg: ', msg, '\n\n');
						console.log('\n\t\tClosing database\n\n');
					}
					
					// console.log('\titerate: ', i, ' vs ', notification.length);
					setTimeout(() => {
						resolve(notification);
					}, 1000);
				}
			});

			find_user.then((notification) => {
				// console.log(notification);
					console.log('\n\n',
						notification[0].from, '\t\t', notification[1].from, '\n',
						notification[0].name, '\t\t', notification[1].name, '\n',
						notification[0].type, '\t\t', notification[1].type, '\nr: ',
						notification[0].request, '\t\t', notification[1].request, '\np: ',
						notification[0].profile, '\t\t', notification[1].profile, '\nm: ',
						notification[0].message, '\t\t', notification[1].message, '\n');
				fn_render_notifications(req, res, next, msg, notification);
			})
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
