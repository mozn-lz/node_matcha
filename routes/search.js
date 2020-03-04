var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

var page_name = 'search';
let search = '';
let fn_render_search = (req, res, next, msg, matches) => {

	console.log('req.session.uid ', req.session.uid);
	var res_arr = matches;
	// console.log('\n\n\n________fn_render_search________\n');
	if (req.session.uid) {
		(req.session.oriantation == '') ? req.session.oriantation = 'bisexual' : 0;

		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");
		// console.log('2. msg_arr: ' + msg_arr + "\n3. res_arr: " + res_arr + '\n');
		if (msg_arr == '') {
			if (res_arr > 0) {
				res_arr == null;
				res.redirect('/index/' + "pass_errThere aren't any matches");
			} else if (res_arr == null) {
				res_arr == null;
				res.redirect('/index/' + 'pass_errYou broke our matching AI, give it a few days to find you a match');
			} else {
				res_arr == null;
			}
		}
		res.render(page_name, {
			match_list: res_arr,
			msg_arr,
			er: pass_er,
			suc: pass_suc,
			title: 'friends'
		});

	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

var fn_getMatches = (req, res, next, msg) => {

	console.log('\n\t\t1. msg: ', msg, '\n\n');
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		var find_user = [];
		var user_matches = [];

		let search_criteria = [
			{usr_user : new RegExp(search)},
			{usr_name : new RegExp(search)},
			{usr_surname : new RegExp(search)}
		];
		
		const collection = db.collection('users');
		console.log(search_criteria);

		collection.find({ $or: search_criteria }).forEach(function (doc, err) {
			if (search) {
				assert.equal(null, err);
				user_matches.push(doc);
				// console.log(doc);
			}
		}), (() => {
			client.close();
			console.log('\n\t\t3. msg: ', msg, '\n\n');
			fn_render_search(req, res, next, msg, user_matches);
		})()
	});
}

router.get('/', (req, res, next) => {
	if (req.session.uid) {
		fn_getMatches(req, res, next, '');
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.post('/', function (req, res, next) {
	search = req.body.search;

	console.log("\t\t\t\tHello: ", search);

	fn_getMatches(req, res, next, '');
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getMatches(req, res, next, req.params.redirect_msg);
});

module.exports = router;
