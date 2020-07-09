const express = require('express');
const router = express.Router();

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk

const mysql = require('mysql2');
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'matcha'
});

let page_name = 'notifications';

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

	var user_matches = [];
	// console.log('NotificationsB ', notification);
	notification ? notification = JSON.parse(notification) : 0;
	// console.log('\n\t\t1. msg: ', msg, '\n\n');
	// console.log('NotificationsA ', notification);


	if (notification) {
		let find_user = new Promise((resolve, reject) => {
			let num_req = 0;
			let num_msg = 0;
			let num_view = 0;

			// console.log(' notification.length ', notification.length)
			if (notification == null) {
				fn_render_notifications(req, res, msg, notification);
			} else {
				for (let i = 0; i < notification.length; i++) {
					// if (i < notification.length) {
					// console.log(notification.length);
	
					// console.log(`${notification[i].from} \nnotification.length ${notification.length}`);
					helper_db.db_read('users', { '_id': (notification[i].from) }, (doc) => {
						notification[i].pic = doc[0].profile_pic;
						notification[i].name = doc[0].usr_user;
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
					// } else {
					// 	// console.log('\n\t\t3. msg: ', msg, '\n\n');
					// 	// console.log('\n\t\tClosing database\n\n');
					// }
					setTimeout(() => {
						resolve(notification);
					}, 1000);
				}
			}
		});

		find_user.then((notification) => {

			for (let i = 0; i < notification.length; i++) {
				const element = notification[i];

				// console.log('F:', notification[i].from, ', N:', notification[i].name, ', T:',
				// notification[i].type, ', ', notification[i].request, ', ',
				// notification[i].profile, ', ', notification[i].message, '\n');
			}
			fn_render_notifications(req, res, msg, notification);
		});
	} else {
		// console.log('No notifications found');
		fn_render_notifications(req, res, msg, user_matches);
	}
}

let fn_getFriends = (req, res, next, msg) => {
	if (req.session.uid) {
		helper.complete_profile(req.session.uid, complete_profile => {
			if (complete_profile) {
				let notifications = '';
				helper_db.db_read('users', { '_id': (req.session.uid) }, user => {
					(user[0].notifications) ? notifications = user[0].notifications : notifications = null;
					fn_getNotifications(req, res, notifications, msg);
				});
			} else {
				res.redirect('/index/pass_errPlease complete your profile first');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

router.post('/', (req, res, next) => {

	if (req.session.uid) {
		helper.complete_profile(req.session.uid, complete_profile => {
			if (complete_profile) {
				let friendId = req.body.user;
				// console.log('hxdf ', friendId);
				let notify = req.body.type;

				fn_redirect = (location) => {
					res.redirect(location);
				}
				remove_notification = (location) => {
					helper_db.db_read('users', { '_id': (req.session.uid) }, user => {
						let notifications = user[0].notifications;
						// console.log('\n\n\nbefore notifications:  (', `${(JSON.parse(notifications)).length} ${typeof (notifications)}`, ')', notifications);

						notifications = JSON.parse(notifications);

						if (notify == 'view_profile') {
							notify = 'view profile';
							location = '/notifications/';
						}

						let new_data = { 'from': Number(friendId), 'type': notify };
						// notifications = JSON.parse('['+ notifications +']');
						for (let i = 0; i <= notifications.length && notifications.length != 0; i++) {
							const el = notifications[i];
							// console.log('JSON.stringify(new_data): ', typeof (JSON.stringify(new_data)) + JSON.stringify(new_data));
							// console.log('JSON.stringify(el): ', typeof (JSON.stringify(el)) + JSON.stringify(el));
							// console.log(i, '. nND(' + JSON.stringify(new_data) + ') EL(' + JSON.stringify(el) + ') ' + JSON.stringify(el) == JSON.stringify(new_data));
							if (JSON.stringify(notifications[i]) == JSON.stringify(new_data)) {
								// console.log('match');
								notifications.splice(i, 1);
								i = 0;
							} else {
								// console.log(i, '. no match');
							}
							// console.log(`${i} vs ${notifications.length}`);
						}
						// console.log('After notifications: (', `${notifications.length} ${typeof (notifications)}`, ')', notifications);

						//	remove 'this' notification
						helper_db.db_update('users', { '_id': req.session.uid }, { 'notifications': JSON.stringify(notifications) }, () => {
							// console.log('\n\n\n');
							fn_redirect(location);
						});
					});
				}

				accept_friend = () => {

					helper_db.db_read('users', { '_id': req.session.uid }, user => {
						user = user[0];
						(user.picture) ? user.picture = JSON.parse(user.picture) : 0;
						if (user.picture && user.picture[0]) {
							helper_db.update_plus('users', { '_id': (req.session.uid) }, '$addToSet', 'friends', Number(friendId), () => {
								helper_db.update_plus('users', { '_id': (friendId) }, '$addToSet', 'friends', Number(req.session.uid), () => {
									let notification = {	// notification object
										from: req.session.uid,
										type: 'like back'
									}
									helper_db.update_plus('users', { '_id': (friendId) }, '$addToSet', 'notifications', notification, () => {
										// helper_db.db_update('users', { '_id': (friendId) }, { $addToS ifications: notification } }, () => {
										remove_notification('/view_profile/' + friendId)
									});
								});
							});
						} else {
							message = 'pass_errPlease upouad a picture first';
							res.redirect('/index/' + message);
						}
					});
				}


				if (req.body.type == 'send message') {
					remove_notification('/view_messages/' + friendId)
				} else if (req.body.type == 'friend request') {
					accept_friend();
				} else if (req.body.type == 'view_profile') {
					remove_notification('/notifications/');
				} else if (req.body.type == 'view profile') {
					remove_notification('/notifications/');
				} else if (req.body.type == 'remove') {
					remove_notification('/notifications/');
				} else if (req.body.type == 'like back') {
					remove_notification('/notifications/');
				} else if (req.body.type == 'friend reject') {
					remove_notification('/notifications/');
				} else {
					// console.log('false\n');
					// fn_getFriends(req, res, next, '');
					res.redirect('/notifications/');
				}
			} else {
				res.redirect('/index/pass_errPlease complete your profile first');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.get('/', (req, res, next) => {
	fn_getFriends(req, res, next, '');
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	// console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getFriends(req, res, next, req.params.redirect_msg);
});

module.exports = router;
