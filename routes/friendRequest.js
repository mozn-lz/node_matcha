const express = require('express');
const router = express.Router();

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk

var page_name = 'friend request';


/* GET view_profile listing. */
router.get('/', function (req, res, next) {
	console.log("************Friend Req(N/A)************\n");

	res.redirect('/index');
});

router.post('/', (req, res, next) => {

	console.log('\n\t\tPOST friend request POST');

	let message = null;
	if (req.session.uid) {

		let submit = req.body.submit;
		let friendReqId = req.body.friendId;

		let notification = {	// notification object
			from: req.session.uid,
			type: 'friend request'
		}

		console.log('fridend: ', friendReqId, '\nsubmit: ', submit);
		// client.db(dbName).collection('users').find({})
		if (submit === 'add') {
			console.log('adding...' + friendReqId, '\n');
			res.redirect('/friendRequest/' + friendReqId);
		} else if (submit === 'block') {
			notification.type = 'block';
			helper_db.db_update('sql', 'users', { '_id': (req.session.uid) }, { $addToSet: { blocked: friendReqId } }, (() => {
				console.log('Sending notification');
				// collection.updateOne({ '_id': (friendReqId) }, { 	// send norification to 'friend'
				// 	$addToSet: {
				// 		notifications: notification
				// 	}
				// });
			})(), (err, result) => {
				console.log('Hahahah, notifications are fucking up? <<< We are Bolckign in this mother >>>');
				client.close();
				message = 'pass_sucUser has been blacked';
				res.redirect('/index/' + message);
			});
		} else if (submit === 'fake') {
			console.log('fake account');
			helper_db.db_update('sql', 'users', { '_id': (friendReqId) }, { $set: { verified: 2 } }, (() => {
				console.log('Sending notification to ', friendReqId, 'from');
				helper_db.db_update('sql', 'users', { '_id': (friendReqId) }, { $addToSet: { notifications: notification } })
			})(), (err, result) => {
				console.log('<<< shit is fake in this mother >>>');
				console.log('Hahahah, notifications are fucking up');
				client.close();
				message = 'pass_sucFake user reported';
				res.redirect('/index/' + message);
			});
		} else {
			res.redirect('/index');
		}
	}
});

router.get('/:reqId', (req, res, next) => {
	console.log("************Friend req(ARG)************\n");

	let message = null;
	if (req.session.uid) {
		helper_db.db_read('sql', 'users', {'_id': req.session.uid}, user => {
			user = user[0];
			// if (user.picture)
			if (user.picture && user.picture.length >= 1) {
				let friendReqId = req.params.reqId
				console.log("1. usrId: ", req.session.uid, '\n');
				console.log("1. friendId: ", friendReqId, '\n');

				let notification = {	// notification object
					from: req.session.uid,
					type: 'friend request'
				}
				console.log('friendReqId ', friendReqId);
				// Connect and save data to mongodb

				console.log('friendReqId ', friendReqId);

				helper_db.db_update('sql', 'users', { '_id': (friendReqId) }, { $addToSet: { request: req.session.uid } }, (() => {
					console.log('Sending notification');
					helper_db.db_update('sql', 'users', { '_id': (friendReqId) }, { $addToSet: { notifications: notification } }, () =>{});
				})(), (err, result) => {
					console.log('Hahahah, notifications are fucking up');
					message = 'pass_sucFriend request has been made';
					res.redirect('/index/' + message);
				});
			} else {
				console.log(user.picture);

				message = 'pass_errPlease upouad a picture first';
				res.redirect('/index/' + message);
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;
