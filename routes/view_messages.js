var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';	// Database(mongo) url
const dbName = 'matcha';		// Database Name
const page_name = 'View Messages';		// page name

renderPage = (res, req, user, friend, data) => {
	console.log('\n\t________ Rendering Page ________\n');

	if (req.session.uid) {
		console.log('\t\tRen.user\t', user, '\n');
		console.log('\t\tRen.friend\t', friend, '\n');
		console.log('\t\tRen.data\t', data, '\n');

		res.render('view_messages', {
			page: 'View Messages',
			user: user,
			friend: friend,
			texts: data
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

/* GET view_messages listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	renderPage(res, req, '', '', '');
});

router.get('/:user', function (req, res, next) {
	let chatFriendId = req.params.user;
	console.log('\n\n\n\n\n\n\t\t\tWelcome to ', page_name, '\n\n\n');

	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);

		let user, friend, texts;
		let find_user = [];
		let find_friend = [];

		db.collection('users').find({ '_id': objectId(req.session.uid) }).forEach(function (doc, err) {
			assert.equal(null, err);
			find_user.push(doc);
			console.log('\t\t doc.push: ', doc._id, ' ', doc.usr_user);
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
			console.log('\t\t doc.push: ', doc._id, ' ', doc.usr_user);
		}, () => {
			if (find_friend.length == 1) {
				console.log('User "', find_friend[0]._id, '(', find_friend[0].usr_user, ')" found');
				friend = find_friend[0];
			} else {
				console.log("Error " + chatFriendId + " not found in database");
				friend = null;
			}
		}),
			db.collection('chats').find({
				'user_id': req.session.uid,
				'partner': chatFriendId
			}).forEach(function (doc, err) {
				assert.equal(null, err);
				console.log('messages: ', doc);
				texts = doc;

				client.close();
				console.log("closing client and proceding to render page");
				renderPage(res, req, user, friend, texts);
			});
	});

});

module.exports = router;
