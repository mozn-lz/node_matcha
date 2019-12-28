var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
// var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'message';

fn_render_messages = (req, res, next, msg) => {
	console.log('\n\n\nfn_render_messages\n');
	var session_variable = req.session.uid;	// Variable for user session
	if (session_variable) {
		console.log('session_variable: ' + session_variable);

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var res_arr = [];
			let find_user = [];

			var msg_arr = [];
			(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
			(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
			msg_arr = msg.slice(8).split(",");
			console.log('msg_arr: ' + msg_arr);

			db.collection('chats').find({ 'user_id': req.session.uid }).forEach(function (doc, err) {
				assert.equal(null, err);
				res_arr.push(doc);
				console.log(doc, "\n");
				
				console.log("\t\t Partner ID: ", doc.partner);
			}, () => {
				// user_data = res_arr;
				let user_data = [res_arr.length];
				console.log('Number of conversations: ', res_arr.length, '\n');
				for (let i = 0; i < res_arr.length; i++) {
					db.collection('users').find({ '_id': objectId(res_arr[i].partner) }).forEach(function (docs, err) {
						assert.equal(null, err);
						// for (let j = 0; j < res_arr.length; j++) {
						// 	if (res_arr[j].partner == docs._id) {
						// 		user_data[i].push(docs);
						// 		user_data[i].messages = res_arr[i];
						// 	}
						// }
						find_user.push(docs);
						console.log(i, `. doc.push: `, docs.usr_user, `(ID: `,docs._id, `)`);
					}, () => {
						console.log("find_user.length: ", find_user.length);
						console.log("res_arr.length: ", res_arr.length);
						if (find_user.length == res_arr.length) {
							console.log('res_arr: ');
							client.close();
							console.log('find_user: ');
			
							res.render('messages', {
								title: 'message',
								er: pass_er,
								suc: pass_suc,
								msg_arr,
								match_list: find_user
							});
						}
					});
				}
			});
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
	console.log('\n\n\n\n\t\t\tWELCOME TO THE message PAGE\n');
	fn_render_messages(req, res, next, '');
});


// HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	fn_render_messages(req, res, next, req.params.redirect_msg);
});

module.exports = router;
