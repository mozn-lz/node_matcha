const express = require('express');
const router = express.Router();
let objectId = require('mongodb').ObjectID;

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk

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

	console.log('0. Finding friends\n');
	helper_db.db_read('', 'users', { '_id': objectId(req.session.uid) }, find_user => {
		let friends = [];
		if (find_user[0].friends) {
			for (let i = 0; i < find_user[0].friends.length; i++) {
				helper_db.db_read('', 'users', { '_id': objectId(find_user[0].friends[i]) }, doc => friends.push(doc[0]))
			}
		} else {
			console.log('4. you do not have friends right now');
		}
		setTimeout(() => {
			console.log('6. Sendin ot trnder');
			fn_render_friends(req, res, next, '', friends);
		}, 1000);
	});
}

router.post('/', (req, res, next) => {
	if (req.session.uid) {
		let friendId = req.body.friend;

		console.log('removinge ', friendId, '\n');
		const collection = client.db(dbName).collection('users');
		//	remove 'this' notification
		helper_db.db_update('', 'users', { '_id': objectId(friendId) }, { $pull: { 'friends': friendId } }, () => {
			// send norification to 'fromer friend'
			helper_db.db_update('', 'users', { '_id': objectId(recipiantId) }, { $addToSet: { notifications: { from: req.session.uid, type: 'friend reject' } } }, () => {
				res.redirect('/friends');
			});
		});
		// fn_redirect(location)
		// fn_getFriends(req, res, next, '');
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
