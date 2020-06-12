const express = require('express');
const router = express.Router();


var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk


var page_name = 'Send Message';

/* GET view_profile listing. */
router.get('/', function (req, res, next) {
	console.log("************Send Message(N/A)************\n");

	res.redirect('/messages/');
});

router.post('/', function (req, res, next) {
	let text = req.body.text;
	let senderId = req.session.uid;
	let recipiantId = req.body.dest;
	let message_details = {
		from: senderId,
		time: Date.now(),
		message: text,
		me : true
	};

	console.log("\n\n\t************Send Message(N/A)************\n\n");
	console.log('message ', message_details.message);
	// console.log('sessioinId    ', req.session.uid);
	console.log('Time    ', message_details.time);
	console.log('recipiantId ', recipiantId);
	console.log('senderId    ', message_details.from);

	if (req.session.uid) {
		// Connect and save data to mongodb
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			console.log("\tConnected to server and mongo connected Successfully");
			const db = client.db(dbName);
			const usersCollection = db.collection('users');
			const messagesCollection = db.collection('chats');
			let notification = {	// notification object
				from: req.session.uid,
				type: 'send message'
			}
			if (senderId && recipiantId) {
				helper_db.db_read('sql', 'users', {'_id': recipiantId}, isfriend => {
					isfriend = isfriend[0];
				// helper.findUserById(recipiantId, (isfriend) => {
					if (isfriend.friends.includes(senderId) && !isfriend.blocked.includes(senderId)) {
						(() => {
								// send norification to 'friend'
							helper_db.db_update('sql', 'users', { '_id': (recipiantId) }, { $addToSet: { notifications: notification } }, )
						})();
							//	update sender messages
						// helper_db.db_update('sql', 'chats', )
						messagesCollection.updateOne(
							{ 'user_id': senderId, 'partner': recipiantId }, 
							{ $addToSet: { 'message': { from: senderId, time: Date.now(), message: text, me : true } } }, 
							{ upsert: true }
							, (err, result) => {
							if (err) {
								console.log("Error ", err);
							} else {
								console.log("Success part  1");
								// console.log("result ", result);
							}
						});

	//	update recipiant messages
						// helper_db.db_update('sql', 'chats', )
						messagesCollection.updateOne(
						{ 'user_id': recipiantId, 'partner': senderId }, 
						{ $addToSet: { 'message': { from: senderId, time: Date.now(), message: text, me : false } } }, 
						{upsert: true}, 
						(err, result) => {
							client.close();
							if (err) {
								console.log("Error ", err);
							} else {
								console.log("Success part 2");
								// console.log("result ", result);
								console.log("Redirect to '/view_messages/' + recipiantId ");
								res.redirect('/view_messages/' + req.body.dest);
							}
							// res.redirect('/index/' + message);
						}), (recipiantId) => {
							console.log("'/view_messages/' + recipiantId ");
							res.redirect('/view_messages/' + recipiantId);
						};
					} else {
						let err_msg = 'Send '+ isfriend.usr_user + ' a friend request to chat with them.'
						console.log(err_msg);
						res.redirect('/index/' + 'pass_err' + err_msg)
					}
				});
			} else {
				console.log("\tError: 'sender' or 'recipiant' are empty\n");

				res.redirect('/view_messages/' + recipiantId);
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}

});

router.get('/:reqId/:message', (req, res, next) => {
	console.log("************Send Message(ARG)************\n");

	if (req.session.uid) {
		let friendReqId = req.params.reqId
		console.log("1. message: ", req.session.message, '\n');
		console.log("1. friendId: ", friendReqId, '\n');

		// 	// Connect and save data to mongodb
		// 	MongoClient.connect(url, function (err, client) {
		// 		assert.equal(null, err);
		// 		console.log("\tConnected to server and mongo connected Successfully");
		// 		const db = client.db(dbName);
		// 		const collection = db.collection('users');
		// 		collection.updateOne({
		// 			'_id': (friendReqId)
		// 		}, { 
		// 			$addToSet: {
		// 				time	: Date.now(),
		// 				from	: friendReqId,
		// 				time	: "Tur,3 Mar 2019, 08:35",
		// 				messages.friendReqId : req.session.message
		// 			}
		// 		}, (err, result) => {
		// 			client.close();
		// 			message = 'pass_sucFriend request has been made';
		res.redirect('/view_messages/' + friendReqId);
		// 		});
		// 	});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;
