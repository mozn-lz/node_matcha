const express = require('express');
const router = express.Router();

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk

var page_name = 'friend request';


/* GET view_profile listing. */
router.get('/', function (req, res, next) {
	// console.log("************Friend Req(N/A)************\n");

	res.redirect('/index');
});

router.post('/', (req, res, next) => {


	// console.log('\n\t\tPOST friend request POST');

	let message = null;
	if (req.session.uid) {
		helper.complete_profile(req.session.uid, complete_profile => {
			if (complete_profile) {

				let submit = req.body.submit;
				let friendReqId = req.body.friendId;

				let notification = {	// notification object
					from: req.session.uid,
					type: 'friend request'
				}

				// console.log('fridend: ', friendReqId, '\nsubmit: ', submit);
				// client.db(dbName).collection('users').find({})
				if (submit === 'add') {
					// console.log('adding...' + friendReqId, '\n');
					res.redirect('/friendRequest/' + friendReqId);
				} else if (submit === 'block') {
					notification.type = 'block';
					helper_db.update_plus('users', { '_id': (req.session.uid) }, '$addToSet', 'blocked', Number(friendReqId), () => {
						// console.log('Hahahah, notifications are fucking up? <<< We are Bolckign in this mother >>>');
						helper_db.db_read('users', { '_id': (req.session.uid) }, find_user => {
							req.session.blocked = find_user[0].blocked;
							message = 'pass_sucUser has been blocked';
							res.redirect('/index/' + message);
						});
					});
				} else if (submit === 'fake') {
					// console.log('fake account');
					helper_db.db_update('users', { '_id': (friendReqId) }, { verified: 2 }, () => {
						// console.log('Sending notification to ', friendReqId, 'from');

						const to = 'msefako@student.wethinkcode.co.za';
						const from = '';
						const subject = 'Fake Account';
						const emailMessage = `<br>Hay Admin! <b>user id: ${friendReqId} </b> 
							has been reported as a fake account by user <b>${req.session.uid}</b>.`;

						helper.sendMail(from, to, subject, emailMessage, () => { });
						//	end email
						helper_db.update_plus('users', { '_id': friendReqId }, '$addToSet', 'notifications', notification, () => {
							// console.log('<<< shit is fake in this mother >>>');
							// console.log('Hahahah, notifications are fucking up');
							message = 'pass_sucFake user reported';
							res.redirect('/index/' + message);
						});
					});
				} else {
					res.redirect('/index');
				}
			} else {
				res.redirect('/index/pass_errPlease complete your profile first');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.get('/:reqId', (req, res, next) => {

	// console.log("************Friend req(ARG)************\n");

	let message = null;
	if (req.session.uid) {
		helper.complete_profile(req.session.uid, complete_profile => {
			if (complete_profile) {
				helper_db.db_read('users', { '_id': req.session.uid }, user => {
					user = user[0];
					(user.picture) ? user.picture = JSON.parse(user.picture) : 0;
					if (user.picture && user.picture[0]) {
						let friendReqId = req.params.reqId

						let notification = {	// notification object
							from: req.session.uid,
							type: 'friend request'
						}
						if (!helper.is_blocked(friendReqId) && user.friends.includes(friendReqId)) {
							helper_db.update_plus('users', { '_id': (friendReqId) }, '$addToSet', 'notifications', notification, () => {
								// console.log('Hahahah, notifications are fucking up');
								message = 'pass_sucFriend request has been made';
								res.redirect('/index/' + message);
							});
						} else {
							res.redirect('/view_profile/' + friendReqId);
						}
					} else {
						message = 'pass_errPlease upouad a picture first';
						res.redirect('/index/' + message);
					}
				});
			} else {
				res.redirect('/index/pass_errPlease complete your profile first');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;
