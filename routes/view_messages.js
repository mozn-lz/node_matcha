var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

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
					console.log('dt3: ', data.message[i].time).slice(0.24);
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

	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);

		let user, friend, texts;
		let find_user = [];
		let find_friend = [];

		console.log("user ", req.session.uid);
		console.log("fridend ", chatFriendId);

		db.collection('users').find({ '_id': objectId(req.session.uid) }).forEach(function (doc, err) {
			assert.equal(null, err);
			find_user.push(doc);
			// console.log('\t\t doc.push: ', doc._id, ' ', doc.usr_user);
		}, () => {
			if (find_user.length == 1) {
				console.log('User "', find_user[0]._id, '(', find_user[0].usr_user, ')" found');
				user = find_user[0];
			} else {
				console.log("Error " + req.session.uid + " not found in database");
				user = null;
			}
		}), db.collection('users').find({ '_id': objectId(chatFriendId) }).forEach(function (doc, err) {
			assert.equal(null, err);
			find_friend.push(doc);
			// console.log('\t\t doc.push: ', doc._id, ' ', doc.usr_user);
		}, () => {
			if (find_friend.length == 1) {
				console.log('User "', find_friend[0]._id, '(', find_friend[0].usr_user, ')" found');
				friend = find_friend[0];
			} else {
				console.log("Error " + chatFriendId + " not found in database");
				friend = null;
			}
		}), db.collection('chats').find({ 'user_id': req.session.uid, 'partner': chatFriendId }).forEach(function (doc, err) {
			assert.equal(null, err);
			// console.log('messages: ', doc);
			texts = doc;
		}, () => {
			console.log("closing client and proceding to render page");
			client.close();
			renderPage(res, req, user, friend, texts);
		});
	});
});

module.exports = router;
