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

var page_name = 'search';
let search = '';
let search_extra = {};

function is_empty(str) {
	if (!str && str.trim().length == 0) {
		return (true);
	}
	return (false);
}

function check_fame(chk_fame) {
	if (is_empty(chk_fame)) {
		// redirect_msg.push('Age is not valid');
		return (false);
	} else {
		// req.body.fame = chk_fame;
		return (true);
	}
}

function check_age(chk_age) {
	if (is_empty(chk_age)) {
		// redirect_msg.push('Age is not valid');
		return (false);
	} else {
		// req.body.age = chk_age;
		return (true);
	}
}

function check_intrests(chk_intrests) {
	console.log('chk_intrests ', chk_intrests);
	if (chk_intrests) {
		(chk_intrests.includes('tatoo'))	 ? req.body.intrests.tatoo = 'tatoo'	  : console.log('Tatoo not foud');
		(chk_intrests.includes('smoke'))	 ? req.body.intrests.smoke = 'smoke'	  : console.log('Smoke not foud');
		(chk_intrests.includes('alcohol'))	 ? req.body.intrests.alcohol = 'alcohol'	  : console.log('Alcohol not foud');
		(chk_intrests.includes('travel'))	 ? req.body.intrests.travel = 'travel'	  : console.log('Travel not foud');
		(chk_intrests.includes('party'))	 ? req.body.intrests.party = 'party'	  : console.log('Party not foud');
		(chk_intrests.includes('social'))	 ? req.body.intrests.social = 'social'	  : console.log('Social not foud');
		(chk_intrests.includes('introvert')) ? req.body.intrests.introvert = 'introvert' : console.log('introvert not foud');
		(chk_intrests.includes('excersise')) ? req.body.intrests.excersise = 'excersise' : console.log('Excersise not foud');
		(chk_intrests.includes('sports'))	 ? req.body.intrests.sports = 'sports'	  : console.log('Sports not foud');
	}
}

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

		collection.find({ $or: search_criteria }, {search_extra}).forEach(function (doc, err) {
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

	if (check_fame(req.body.fame) || check_age(req.body.age) || check_intrests(req.body.intrests) || check_location(req.body.location)) {
		// store data to JSON array, to store in mongo
		(check_fame(req.body.fame)) ? search_extra.fame = req.body.fame : 0;
		(check_age(req.body.age)) ? search_extra.age = req.body.age : 0;
		(check_intrests(req.body.intrests)) ? search_extra.intrests = req.body.intrests : 0;
		(check_location(req.body.location)) ? search_extra.gps = req.body.location : 0;
	}
	console.log("\t\t\t\tHello: ", search);

	fn_getMatches(req, res, next, '');
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getMatches(req, res, next, req.params.redirect_msg);
});

module.exports = router;
