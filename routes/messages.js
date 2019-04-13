var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// var helper = require('./helper_functions'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'message';

function is_empty(str) {
	ret = str.trim();
	if (ret.length == 0) {
		return (true);
	}
	return (false);
}

function fn_render_messages(req, res, next, msg) {
	console.log('\n\n\nfn_render_messages\n');
	var session_variable = req.session.email;	// Variable for user session
	if (session_variable) {
		console.log('session_variable: ' + session_variable);

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var res_arr = [];
			const collection = db.collection('users');

			var usr_data = {
				'gender': session_variable
			};

			var msg_arr = [];
			(msg.search('pass_err') == 0) ? pass_er = "danger": pass_er = '';
			(msg.search('pass_suc') == 0) ? pass_suc = "success": pass_suc = '';
			msg_arr = msg.slice(8).split(",");
			console.log('msg_arr: ' + msg_arr);

			collection.find(usr_data).forEach(function (doc, err) {
				assert.equal(null, err);
				res_arr.push(doc);
			}, function () {
				client.close();
				if (res_arr) {
					// if user is found get their details from database
					res.render('messages', {
						title: 'message',
						er: pass_er,
						suc: pass_suc,
						msg_arr,
						match_list: res_arr
					});
				} else if (res_arr.length < 1) {
					res.redirect('/' + 'pass_errInvaild email or password');
				} else {
					res.redirect('/' + 'pass_errThere seams to be a dubious error that popped up, Please try again');
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

// Render messages page with user
router.get('/', function (req, res, next) {
	console.log('\n\n\n\n\n\n\t\t\tWELCOME TO THE message PAGE\n');
	fn_render_messages(req, res, next, '');
});

// HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	fn_render_messages(req, res, next, req.params.redirect_msg);
});

module.exports = router;
