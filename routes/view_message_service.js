var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database(mongo) url
const dbName = 'mk_matcha';		// Database Name
const page_name = 'View_Message_Service';		// page name

let chatFriendId = null;

let send_chat_messages = (res, req, user, friend, chat_messages) => {
	console.log('\n\t________ Rendering Page ________\n');

	(user == null) ? console.log('\t\tuser not found\n') : console.log('\t\tRen.user found\n');
	(friend == null) ? console.log('\t\tfrnd not found\n') : console.log('\t\tRen.frnd found\n');
	(chat_messages == null) ? console.log('\t\tdata not found\n') : console.log('\t\tRen.data found\n');
	if (user != null && friend != null) {
		console.log('friend ', friend.usr_user);
		if (chat_messages) {
			for (let i = 0; i < chat_messages.message.length; i++) {
				if (chat_messages.message[i].from == req.session.uid) {
					chat_messages.message[i].me = true;
					chat_messages.message[i].from = user.usr_user;
				} else {
					chat_messages.message[i].me = false;
					chat_messages.message[i].from = friend.usr_user;
				}
				console.log('dt1: ', chat_messages.message[i].time);
				console.log('dt2: ', (new Date(chat_messages.message[i].time).getHours()).toString(), ':', (new Date(chat_messages.message[i].time).getMinutes()).toString(), ' ', (new Date(chat_messages.message[i].time).getDate()).toString(), '/', (new Date(chat_messages.message[i].time).getMonth()).toString(), '/', (new Date(chat_messages.message[i].time).getFullYear()).toString());
				chat_messages.message[i].time = new Date(chat_messages.message[i].time);
			}
		}
		// console.log('chat_messages ', chat_messages);
		setTimeout(() => {
			console.log('sending chat_messages');
			res.send(chat_messages);
		}, 1000);
	} else {
		console.log("user or (and) friend are empty");
		// res.redirect('/view_messages/' + chatFriendId);		//	self dos attack
	}
}

router.get('/:friend', function (req, res, next) {
	chatFriendId = req.params.friend;
	console.log('\n\n\n\n\n\n\t\t\tWelcome to ', page_name, '\n\n\n');
	console.log('friend: ', req.params.friend);
	if (req.session.uid) {
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			const db = client.db(dbName);

			let user, friend, texts;

			console.log("0. user ", req.session.uid);
			console.log("0. fridend ", chatFriendId);

			// Remove notification
			const collection = client.db(dbName).collection('users');
			collection.updateOne({ '_id': (req.session.uid) }, {
				$pull: {		//	remove 'this' notification
					'notifications': { 'from': chatFriendId, 'type': 'send message' }
				}
			});

			let get_chat = db.collection('chats').find({ 'user_id': req.session.uid, 'partner': chatFriendId }).forEach(function (doc, err) {
				assert.equal(null, err);
				texts = doc;
			}, (get_user, get_friend) => {
				console.log('fuk')
				setTimeout(() => {
					console.log('fuCk')
					console.log("closing client and proceding to render page");
					client.close();
					console.log("FRIEND ID", friend._id);
					console.log('USER ID ', user._id);
					console.log('user: ', user.friends.includes(friend._id));
					console.log('friend: ', friend.friends.includes(user._id));
					if (
						(user != null && (user.friends.includes(chatFriendId))) &&
						(friend != null && (friend.friends.includes(req.session.uid)))
					) {
						send_chat_messages(res, req, user, friend, texts);
					} else {
						res.redirect('/index/' + 'pass_errYou can only send messages to friends');
					}
				}, 1500);
			});

			helper_db.db_read('sql', 'users', {'_id': chatFriendId}, find_friend => {
				find_friend = find_friend[0];
			// let get_friend = helper.findUserById(chatFriendId, (find_friend) => {
				console.log('2. GET FRIEND ');
				if (find_friend) {
					console.log('4. User "', find_friend._id, '(', find_friend.usr_user, ')" found');
					friend = find_friend;
					console.log('6. friend****: ', friend.usr_user, ' ', friend._id);
				} else {
					console.log("8. friend: Error " + chatFriendId + " not found in database");
					friend = null;
				}
			}, get_chat);

			helper_db.db_read('sql', 'users', {'_id': req.session.uid}, find_user => {
				find_user = find_user[0];
			// let get_user = helper.findUserById(req.session.uid, (find_user) => {
				console.log('1. GET USER');
				if (find_user) {
					console.log('3. User "', find_user._id, '(', find_user.usr_user, ')" found');
					user = find_user;
					console.log('5. user****: ', user.usr_user, ' ', user._id);
				} else {
					console.log("\n7. User: Error " + req.session.uid + " not found in database");
					user = null;
				}
			}, get_friend);
		});
	} else {
		res.redirect('/index');
	}
});

module.exports = router;
