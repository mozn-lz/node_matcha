const express = require('express');
const router = express.Router();

const helper_db = require('./helper_db');
const { json } = require('express');
const page_name = 'View_Message_Service';		// page name

let chatFriendId = null;

let send_chat_messages = (res, req, user, friend, chat_messages) => {
	// console.log('\n\t________ Rendering Page ________\n');

	(user == null) ? console.log('\t\tuser not found\n') : console.log('\t\tRen.user found\n');
	(friend == null) ? console.log('\t\tfrnd not found\n') : console.log('\t\tRen.frnd found\n');
	(chat_messages == null) ? console.log('\t\tdata not found\n') : console.log('\t\tRen.data found\n');
	if (user != null && friend != null) {
		// console.log('friend ', friend.usr_user);
		if (chat_messages) {
			(chat_messages.message) ? chat_messages.message = JSON.parse(chat_messages.message): 0;
			for (let i = 0; i < chat_messages.message.length; i++) {
				if (chat_messages.message[i].from == req.session.uid) {
					chat_messages.message[i].me = true;
					chat_messages.message[i].from = user.usr_user;
				} else {
					chat_messages.message[i].me = false;
					chat_messages.message[i].from = friend.usr_user;
				}
				// console.log('dt1: ', chat_messages.message[i].time);
				// console.log('dt2: ', (new Date(chat_messages.message[i].time).getHours()).toString(), ':', (new Date(chat_messages.message[i].time).getMinutes()).toString(), ' ', (new Date(chat_messages.message[i].time).getDate()).toString(), '/', (new Date(chat_messages.message[i].time).getMonth()).toString(), '/', (new Date(chat_messages.message[i].time).getFullYear()).toString());
				chat_messages.message[i].time = new Date(chat_messages.message[i].time);
			}
		}
		// console.log('chat_messages ', chat_messages);
		setTimeout(() => {
			// console.log('sending chat_messages');
			res.send(chat_messages);
		}, 1000);
	} else {
		// console.log("user or (and) friend are empty");
		// res.redirect('/view_messages/' + chatFriendId);		//	self dos attack
	}
}

router.get('/:friend', function (req, res, next) {
	chatFriendId = req.params.friend;
	// console.log('\n\n\n\n\n\n\t\t\tWelcome to ', page_name, '\n\n\n');
	// console.log('friend: ', req.params.friend);
	if (req.session.uid) {
		let user, friend, texts;

		// console.log("0. user ", req.session.uid);
		// console.log("0. fridend ", chatFriendId);

		// Remove notification
		// const collection = client.db(dbName).collection('users');
		// helper_db.update_minus('users', { '_id': (req.session.uid) }, '$pull', 'notifications', { 'from': chatFriendId, 'type': 'send message' }, () => {
		// });
		// collection.updateOne({ '_id': (req.session.uid) }, { $pull: { 'notifications': { 'from': chatFriendId, 'type': 'send message' } } });

		helper_db.find_chat([{ 'user_id': req.session.uid }, { 'partner': chatFriendId }], req.session.uid, chats => {
			chats = chats[0];
			helper_db.db_read('users', { '_id': chatFriendId }, friend => {
				friend = friend[0];
				helper_db.db_read('users', { '_id': req.session.uid }, user => {
					user = user[0];
					// console.log("FRIEND ID", friend._id);
					// console.log('USER ID ', user._id);
					// console.log('user: ', user.friends.includes(friend._id));
					// console.log('friend: ', friend.friends.includes(user._id));
					if (
						(user != null && (user.friends.includes(chatFriendId))) &&
						(friend != null && (friend.friends.includes(req.session.uid)))
					) {
						send_chat_messages(res, req, user, friend, chats);
					} else {
						res.redirect('/index/' + 'pass_errYou can only send messages to friends');
					}
				});
			});
		});
	} else {
		res.redirect('/index');
	}
});

module.exports = router;
