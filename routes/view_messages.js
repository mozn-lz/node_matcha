const express = require('express');
const router = express.Router();

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk

const page_name = 'View Messages';		// page name

let chatFriendId = null;

renderPage = (res, req, user, friend, chat) => {
	console.log('\n\t________ Rendering Page ________\n');

	if (req.session.uid) {
		res.render('view_messages', {
			page: 'View Messages',
			user: user,
			friend: friend,
			texts: chat
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

/* GET view_messages listing. */
router.get('/', function (req, res, next) {
	res.redirect('/index/' + 'pass_errPlease select someone to send a message to');
	// renderPage(res, req, '', '', '');
});

router.get('/:user', function (req, res, next) {
	chatFriendId = req.params.user;
	console.log('\n\n\n\n\n\n\t\t\tWelcome to ', page_name, '\n\n\n');

	if (req.session.uid) {

		console.log("0. user ", req.session.uid);
		console.log("0. fridend ", chatFriendId);

		helper_db.db_read('', 'chats', { 'user_id': req.session.uid, 'partner': chatFriendId }, conversation => {
			conversation = conversation[0];
			console.log(`1. GET CONVERSTATION: ${conversation.length}`);
			helper.findUserById(req.session.uid, user => {
				console.log(`2. GET user: ${user.usr_user} (${user._id})`);
				helper.findUserById(chatFriendId, friend => {
					console.log(`3. GET FRIEND ${friend.usr_user} (${friend._id})`);
					console.log('fuk')
					// console.log('fuCk')
					console.log("closing client and proceding to render page");
					// console.log("FRIEND ID", find_friend._id);
					// console.log('USER ID ', find_user._id);
					console.log('CONDIT\tuser: ', user.friends.includes(friend._id));
					console.log('CONDIT\tfriend: ', friend.friends.includes(user._id));
					if (
						(user != null && (user.friends.includes(chatFriendId))) &&
						(friend != null && (friend.friends.includes(req.session.uid)))
					) {
						console.log('\n\nfind_user.length: ', user.length);
						console.log('find_friend.length: ', friend.length);
						console.log('texts.length: ', conversation);
						console.log('texts.length: ', conversation.length, '\n\n');

						(user == null) ? console.log('\t\tuser not found\n') : console.log('\t\tRen.user found\n');
						(friend == null) ? console.log('\t\tfrnd not found\n') : console.log('\t\tRen.frnd found\n');
						(conversation == null || !conversation) ? console.log('\t\tdata not found\n') : console.log('\t\tRen.data found\n');
						if (user != null && friend != null) {
							if (conversation) {
								console.log(`chat:  ${conversation.user_id}`);
								console.log(`chat:  ${conversation.partner}`);
								console.log(`chat:  ${conversation.message}`);
								for (let i = 0; i < conversation.message.length; i++) {
									if (conversation.message[i].from == req.session.uid) {
										conversation.message[i].me = true;
										conversation.message[i].from = user.usr_user;
									} else {
										conversation.message[i].me = false;
										conversation.message[i].from = friend.usr_user;
									}
									console.log('dt1: ', conversation.message[i].time);
									console.log('dt2: ', (new Date(conversation.message[i].time).getHours()).toString(), ':', (new Date(conversation.message[i].time).getMinutes()).toString(), ' ', (new Date(conversation.message[i].time).getDate()).toString(), '/', (new Date(conversation.message[i].time).getMonth()).toString(), '/', (new Date(conversation.message[i].time).getFullYear()).toString());
									// data.message[i].time = (new Date(data.message[i].time).getHours()).toString() + ':' + (new Date(data.message[i].time).getMinutes()).toString() + ' ', + (new Date(data.message[i].time).getDate()).toString() + '/', + (new Date(data.message[i].time).getMonth()).toString() + '/' + (new Date(data.message[i].time).getFullYear()).toString();
									conversation.message[i].time = new Date(conversation.message[i].time);
								}
								setTimeout(() => {
									renderPage(res, req, user, friend, conversation);
								}, 1500);
							}
						} else {
							console.log("user or (and) friend are empty");
							res.redirect('/view_messages/' + chatFriendId);		//	self dos attack
						}
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
