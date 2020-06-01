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

// (req.session.uid) ? helper.logTme : 0;	//	update last online

let fn_render_notifications = (req, res, msg, matches) => {

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
function fn_getNotifications(req, res, notification, msg) {

	console.log('\n\t\t1. msg: ', msg, '\n\n');
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		// var find_user = [];
		var user_matches = [];
		const collection = db.collection('users');
		console.log('Notifications ', notification);

		// let notification = req.session.notifications;

		if (notification) {
			let find_user = new Promise((resolve, reject) => {
			let num_req = 0;
			let num_msg = 0;
			let num_view = 0;

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
								notification.num_req = num_req++;
							} else if (notification[i].type == 'send message') {
								notification[i].message = 'send message';
								notification.num_req = num_msg++;
							} else if (notification[i].type == 'view profile') {
								notification[i].profile = 'view profile';
								notification.num_req = num_view++;
							} else if (notification[i].type == 'friend reject') {
								notification[i].reject = 'friend reject';
								notification.num_req = num_view++;
							} else if (notification[i].type == 'like back') {
								notification[i].like_back = 'like back';
								notification.num_req = num_view++;
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
						// 	fn_render_notifications(req, res, msg, notification);
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
					// notification[0].from, '\t\t', notification[1].from, '\n',
					// notification[0].name, '\t\t', notification[1].name, '\n',
					// notification[0].type, '\t\t', notification[1].type, '\nr: ',
					// notification[0].request, '\t\t', notification[1].request, '\np: ',
					// notification[0].profile, '\t\t', notification[1].profile, '\nm: ',
					// notification[0].message, '\t\t', notification[1].message, '\n'
				);
				for (let i = 0; i < notification.length; i++) {
					const element = notification[i];

					console.log(notification[i].from, ', ', notification[i].name, ', ',
						notification[i].type, ', ', notification[i].request, ', ',
						notification[i].profile, ', ', notification[i].message, '\n');
				}
				fn_render_notifications(req, res, msg, notification);
			});
		} else {
			console.log('No notifications found');
			fn_render_notifications(req, res, msg, user_matches);
		}
	});
}

let fn_getFriends = (req, res, next, msg) => {

	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		let user = [];
		let notifications = '';
		const collection = client.db(dbName).collection('users');
		collection.find({ '_id': objectId(req.session.uid) }).forEach((doc, err) => {
			user.push(doc);
			console.log(doc.us);
		}, ()=> {
			(user[0].notifications) ? notifications = user[0].notifications : notifications = null;
			fn_getNotifications(req, res, notifications, msg);
		});
	});
}

router.post('/', (req, res, next) => {

	if (req.session.uid) {
		let friendId = req.body.user;
		console.log('hxdf ', friendId);
		let notify = req.body.type;

		fn_redirect = (location) => {
			res.redirect(location);
		}
		remove_notification = (location, callback) => {
			console.log('removinge ', notify, ' from: ', friendId ,'\n');
			MongoClient.connect(url, function (err, client) {
				assert.equal(null, err);

				const collection = client.db(dbName).collection('users');
				collection.updateOne({ '_id': objectId(req.session.uid) }, {
					$pull: {		//	remove 'this' notification
						'notifications': { 'from': friendId, 'type': notify }
					}
				})
			});
			fn_redirect(location);
		}

		accept_friend = (callback) => {
			// accept query
			console.log('hxdf ', friendId);
			MongoClient.connect(url, function (err, client) {
				assert.equal(null, err);

				const collection = client.db(dbName).collection('users');
				collection.updateOne({
					'_id': objectId(req.session.uid)
				}, {
					$addToSet: {
						'friends': friendId
					}
				});
				collection.updateOne({
					'_id': objectId(friendId)
				}, {
					$addToSet: {
						'friends': req.session.uid
					}
				});
				let notification = {	// notification object
					from: req.session.uid,
					type: 'like back'
				}
				collection.updateOne({ '_id': objectId(friendId) }, { 	// send norification to 'friend'
					$addToSet: {
						notifications: notification
					}
				});
			});
			remove_notification('/view_profile/' + friendId, fn_redirect)
		}

		if (req.body.type == 'view profile') {
			remove_notification('/view_profile/' + friendId, fn_redirect);
		} else if (req.body.type == 'send message') {
			remove_notification('/view_messages/' + friendId, fn_redirect)
		} else if (req.body.type == 'friend request') {
			accept_friend(remove_notification);
		} else if (req.body.type == 'remove') {
			remove_notification('/notifications/', fn_redirect);
		} else if (req.body.type == 'like back') {
			remove_notification('/notifications/', fn_redirect);
		} else if (req.body.type == 'friend reject') {
			remove_notification('/notifications/', fn_redirect);
		} else {
			console.log('false\n');
			fn_getFriends(req, res, next, '');
		}
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.get('/', (req, res, next) => {
	if (req.session.uid) {
		fn_getFriends(req, res, next, '');
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getFriends(req, res, next, req.params.redirect_msg);
});

module.exports = router;
