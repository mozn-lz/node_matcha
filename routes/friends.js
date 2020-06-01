var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

// (req.session.uid) ? helper.logTme : 0;	//	update last online

var page_name = 'friends';

let fn_render_friends = (req, res, next, msg, matches) => {

	console.log('\n\n\n________fn_render_', page_name, '________\n');
	if (req.session.uid) {

		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");

		res.render(page_name, {
			friends: matches,
			msg_arr,
			er: pass_er,
			suc: pass_suc,
			title: page_name
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

var fn_getFriends = (req, res, next, msg) => {

	console.log('\n\t\t1. msg: ', msg, '\n\n');
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		var find_user = [];
		const collection = db.collection('users');

		let find_friends = () => {
			let friends = [];
			if (find_user[0].friends) {
				for (let i = 0; i < find_user[0].friends.length; i++) {
					collection.find({ '_id': objectId(find_user[0].friends[i]) }).forEach((doc, err) => {
						assert.equal(null, err);
						console.log('5. Friend: ', doc.usr_email, ' ', doc.usr_user);
						friends.push(doc);
					});
				}
			} else {
				console.log('4. you do not have friends right now');
			}
			setTimeout(() => {
				console.log('6. Sendin ot trnder');
				fn_render_friends(req, res, next, '', friends);
			}, 1000);

		}

		(() => {
			console.log('0. Finding friends\n');
			collection.find({ '_id': objectId(req.session.uid) }).forEach((docs, err) => {
				console.log('1. docs: ', docs.usr_email, 'friend array: ', docs.friends);
				find_user.push(docs);
			}, () => { find_friends() });
		})()
	});
}

router.post('/', (req, res, next) => {
	if (req.session.uid) {
		let friendId = req.body.friend;

		console.log('removinge ', friendId, '\n');
		MongoClient.connect(url, (err, client) => {
			assert.equal(null, err);

			const collection = client.db(dbName).collection('users');
			collection.updateOne({ '_id': objectId(friendId) }, {
				$pull: {		//	remove 'this' notification
					'friends': friendId
				}
			}, () => {
				usersCollection.updateOne({ '_id': objectId(recipiantId) }, {	// send norification to 'fromer friend'
					$addToSet: {
						notifications: {	// notification object
							from: req.session.uid,
							type: 'friend reject'
						}
					}
				});
				console.log('');
			});
		});
		res.redirect('/friends');
		// fn_redirect(location)
		fn_getFriends(req, res, next, '');
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.get('/', (req, res, next) => {
	if (req.session.uid) {
		fn_getFriends(req, res, next, '');
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getFriends(req, res, next, req.params.redirect_msg);
});

module.exports = router;
