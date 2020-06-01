var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database(mongo) url
const dbName = 'mk_matcha';		// Database Name
const page_name = 'View Messages';		// page name

// (req.session.uid) ? helper.logTme : 0;	//	update last online

let chatFriendId = null;

renderPage = (res, req, user, friend, data) => {
	console.log('\n\t________ Rendering Page ________\n');

	if (req.session.uid) {
		(user == null) ? console.log('\t\tuser not found\n') : console.log('\t\tRen.user found\n');
		(friend == null) ? console.log('\t\tfrnd not found\n') : console.log('\t\tRen.frnd found\n');
		(data == null) ? console.log('\t\tdata not found\n') : console.log('\t\tRen.data found\n');
		if (user != null && friend != null) {
			console.log('friend ', friend.usr_user);
			if (data) {
				for (let i = 0; i < data.message.length; i++) {
					// const element = data.message[i];
					if (data.message[i].from == req.session.uid) {
						data.message[i].me = true;
						data.message[i].from = user.usr_user;
					} else {
						data.message[i].me = false;
						data.message[i].from = friend.usr_user;
					}
					console.log('dt1: ', data.message[i].time);
					console.log('dt2: ', (new Date(data.message[i].time).getHours()).toString(), ':', (new Date(data.message[i].time).getMinutes()).toString(), ' ', (new Date(data.message[i].time).getDate()).toString(), '/', (new Date(data.message[i].time).getMonth()).toString(), '/', (new Date(data.message[i].time).getFullYear()).toString());
					// data.message[i].time = (new Date(data.message[i].time).getHours()).toString() + ':' + (new Date(data.message[i].time).getMinutes()).toString() + ' ', + (new Date(data.message[i].time).getDate()).toString() + '/', + (new Date(data.message[i].time).getMonth()).toString() + '/' + (new Date(data.message[i].time).getFullYear()).toString();
					data.message[i].time = new Date(data.message[i].time);

					// new Date(data.message[i].time).getHours().toString() +':'+
					// new Date(data.message[i].time).getMinutes().toString() +' '+
					// new Date(data.message[i].time).getDate().toString() +'/'+
					// new Date(data.message[i].time).getMonth().toString() +'/'+
					// new Date(data.message[i].time).getFullYear().toString();
					// console.log('dt3: ', data.message[i].time).slice(0.24);
				}
			}
			res.render('view_messages', {
				page: 'View Messages',
				user: user,
				friend: friend,
				texts: data
			});
			// res.redirect('/index/' + 'pass_errError loading page ' + page_name + ' page ');

		} else {
			console.log("user or (and) friend are empty");
			res.redirect('/view_messages/' + chatFriendId);		//	self dos attack
		}
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

	(!req.session.uid) ? res.redirect('/index') : 0;
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);

		let user, friend, texts;

		console.log("0. user ", req.session.uid);
		console.log("0. fridend ", chatFriendId);

		let get_chat = db.collection('chats').find({ 'user_id': req.session.uid, 'partner': chatFriendId }).forEach(function (doc, err) {
			assert.equal(null, err);
			// console.log('messages: ', doc);
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
					(user != null && (user.friends.includes(chatFriendId) )) &&
					(friend != null && (friend.friends.includes(req.session.uid) ))
				) {
					renderPage(res, req, user, friend, texts);
				} else {
					res.redirect('/index/' + 'pass_errYou can only send messages to friends');
				}
			}, 1500);
		});

		let get_friend = helper.findUserById(chatFriendId, (find_friend) => {
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

		let get_user = helper.findUserById(req.session.uid, (find_user) => {
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
});

module.exports = router;
