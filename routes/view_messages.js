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
		var find_user = [];

		let user = '';
		let friend = '';
		let texts = '';

		findUser = (id) => {		//	find user
			// console.log('id ', id), '\n';
			let i = 0;
			db.collection('users').find({ '_id': objectId(id) }).forEach(function (doc, err) {
				assert.equal(null, err);
				console.log('\t\t doc.push: ', doc._id, ' ', doc.usr_user);
				find_user.push(doc);
				++i;
			}, () => {
				// console.log('i:', i, '\nfind_user.length: ', find_user.length);
				// if (find_user.length == 1) {
				if (i == 1) {
					console.log('User "', id, '" found');
					return (find_user[0]);
				} else {
					console.log("Error " + id + " not found in database");
					return (null);
				}
			});
		}

		messages = () => {		// find messages
			db.collection('chats').find({
				'user_id': req.session.uid,
				'partner': chatFriendId
			}).forEach(function (doc, err) {
				assert.equal(null, err);
				find_user.push(doc);
				// console.log('\t\t Message array: ', doc);
				return (doc);
			});
		}

		// some_3secs_function(function () {
		// 	user = findUser(req.session.uid);
		// 	friend = findUser(chatFriendId);
		// 	texts = messages();
		// 	some_5secs_function(function () {
		// 		console.log('user: ', user);
		// 		console.log('friend: ', friend);
		// 		console.log('texts: ', texts);
		// 		console.log("closing client and proceding to render page");
		// 		client.close();
		// 		some_8secs_function(function () {
		// 			renderPage(res, req, user, friend, texts);
		// 		});
		// 	});
		// });

		(() => {
			user = findUser(req.session.uid);
			friend = findUser(chatFriendId);
			texts = messages();
		})();
		if ((findUser(req.session.uid) != null) && (findUser(chatFriendId) != null)) {
			console.log('if: user: ', user);
			console.log('if: friend: ', friend);
			console.log('if: texts: ', texts);
			client.close();
			console.log("closing client and proceding to render page");
			renderPage(res, req, user, friend, texts);
		} else {
			console.log("'user' are empty");
			console.log("'friend' are empty");
			console.log("'texts' are empty");
		}
	});

});

module.exports = router;
