const express = require('express');
const router = express.Router();

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk

var page_name = 'messages';

let render_messages = (res, res_arr, find_user, msg_arr) => {
	// console.log("find_user.length: ", find_user.length);
	// console.log("res_arr.length: ", res_arr.length);
	if (find_user.length > 0) {
		// console.log('res_arr: ');
		// console.log('find_user: ');

		// console.log('Rendering messages');
		res.render(page_name, {
			title: page_name,
			er: pass_er,
			suc: pass_suc,
			msg_arr,
			match_list: find_user
		});
	} else {
		res.redirect('/index/' + 'pass_errYou dont have any messages yet');
	}
}

fn_render_messages = (req, res, next, msg) => {

	// console.log('\n\n\nfn_render_messages\n');
	var session_variable = req.session.uid;	// Variable for user session
	if (session_variable) {
		helper.complete_profile(req.session.uid, complete_profile =>{
			if (complete_profile) {
				// console.log('session_variable: ' + session_variable);
				var res_arr = [];
				let find_user = [];
		
				var msg_arr = [];
				(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
				(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
				msg_arr = msg.slice(8).split(",");
				// console.log('msg_arr: ' + msg_arr);
		
				helper_db.db_read('chats', { 'user_id': req.session.uid }, user => {
					// console.log('Number of conversations: ', user.length, `res_arr.length > 0: ${user.length > 0}`, '\n');
					if (user.length > 0) {
						// console.log('\tConversations found');
						for (let i = 0; i < user.length; i++) {
							helper_db.db_read('users', { '_id': (user[i].partner) }, docs => {
								// docs = find_user;
								if (docs.length == 1) {
									find_user.push(docs[0]);
									// console.log(`${i} doc.push:  ${docs[0].usr_user} (ID:  ${docs[0]._id} )`);
								}
							});
						}
						setTimeout(() => {
							// console.log('58: find_user: ', find_user.length);
							// console.log('59: res_arr: ', user.length);
							render_messages(res, user, find_user, msg_arr);
						}, 1000);
					} else {
						// console.log(`No mesasages (${user.length}), redirecting to home`);
						res.redirect('/index/' + 'pass_errYou dont have any messages yet');
					}
				});
			} else {
				res.redirect('/index/pass_errPlease complete your profile first');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

/**
 * view all chats
 * if chat is clicked on, open messages
 * 
 */

// default messages page: All Messages Here
router.get('/', function (req, res, next) {
	// console.log('\n\n\n\n\t\t\tWELCOME TO THE message PAGE\n');
	fn_render_messages(req, res, next, '');
});


// HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	fn_render_messages(req, res, next, req.params.redirect_msg);
});

module.exports = router;
