const express = require('express');
const router = express.Router();

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk


var page_name = 'search';
let search = '';
let search_extra, search_intrests = {};

function is_empty(str) {
	if (!str || str.length == 0) {
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


function chk_intrests(chk_intrests) {
	if (chk_intrests) {
		console.log('chk_intrests ', chk_intrests);
		console.log('chk_intrests ', chk_intrests.length);
		(chk_intrests.includes('tatoo')) ? search_intrests.tatoo = 'tatoo' : console.log('Tatoo not foud');
		(chk_intrests.includes('smoke')) ? search_intrests.smoke = 'smoke' : console.log('Smoke not foud');
		(chk_intrests.includes('alcohol')) ? search_intrests.alcohol = 'alcohol' : console.log('Alcohol not foud');
		(chk_intrests.includes('travel')) ? search_intrests.travel = 'travel' : console.log('Travel not foud');
		(chk_intrests.includes('party')) ? search_intrests.party = 'party' : console.log('Party not foud');
		(chk_intrests.includes('social')) ? search_intrests.social = 'social' : console.log('Social not foud');
		(chk_intrests.includes('introvert')) ? search_intrests.introvert = 'introvert' : console.log('introvert not foud');
		(chk_intrests.includes('excersise')) ? search_intrests.excersise = 'excersise' : console.log('Excersise not foud');
		(chk_intrests.includes('sports')) ? search_intrests.sports = 'sports' : console.log('Sports not foud');
		return (true);
	} else {
		return (false);
	}
}
function check_location(chk_location) {
	if (is_empty(check_location)) {
		return (false);
	} else {
		return (false);
	}
}

let fn_render_search = (req, res, next, msg, matches) => {

	console.log('req.session.uid ', req.session.uid);
	console.log('\n\n\n________fn_render_search (', matches.length, ')________\n');
	if (req.session.uid) {
		// var res_arr = matches;
		let res_arr = helper.sort_locate(matches, req.session.gps);
		(req.session.oriantation == '') ? req.session.oriantation = 'bisexual' : 0;

		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");
		// console.log('2. msg_arr: ' + msg_arr + "\n3. res_arr: " + res_arr + '\n');
		if (msg_arr == '') {
			if (res_arr > 0) {
				res_arr == null;
				res.redirect(page_name + "pass_errThere aren't any matches");
			} else if (res_arr == null) {
				res_arr == null;
				res.redirect('/index/' + 'pass_errYou broke our matching AI, give it a few minutes to find you a match');
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
	var find_user = [];
	var user_matches = [];

	let search_criteria = [
		{ 'gps.city': new RegExp(search) },
		{ 'gps.country': new RegExp(search) },
		{ usr_user: new RegExp(search) },
		{ usr_name: new RegExp(search) },
		{ usr_surname: new RegExp(search) }
	];

	console.log(search_criteria);

	helper_db.db_read('sql', 'users', { $or: search_criteria, search_extra }, doc => {
		for (let i = 0; i < doc.length; i++) {
			if (search) {
				assert.equal(null, err);
				user_matches.push(doc);
				console.log(doc);
			}
		}
	}), (() => {
		console.log('\n\t\t3. msg(', user_matches.length, '): ', msg, '\n\n');
		if (user_matches.length == 0) {
			helper.fn_getMatches(req, res, (result) => {
				console.log('search failed');
				fn_render_search(req, res, next, msg, user_matches)
			});
		} else {
			console.log('USers found');
			fn_render_search(req, res, next, msg, user_matches);
		}
	})()
}

router.get('/', (req, res, next) => {
	if (req.session.uid) {
		fn_getMatches(req, res, next, '');
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.post('/', (req, res, next) => {
	(!req.session.uid) ? res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ') : 0;
	search = req.body.search;

	if (check_fame(req.body.fame) || check_age(req.body.age) || chk_intrests(req.body.intrests) || check_location(req.body.location)) {
		// store data to JSON array, to store in mongo
		helper.fn_getMatches(req, res, (user_matches) => {
			console.log('\t\t***', user_matches.length)
			if (check_fame(req.body.fame)) {	// fame gap
				if (req.body.fame <= 5 && req.body.fame >= 0)
					user_matches = helper.filter_fame(user_matches, req.session.rating, req.body.fame);
			}
			if (check_age(req.body.age)) {	// age gap
				if (req.body.age <= 10 && req.body.age >= 0)
					user_matches = helper.filter_age(user_matches, req.session.age, req.body.age);
			}
			if (chk_intrests(req.body.intrests)) {
				user_matches = helper.filter_tags(user_matches, req.body.intrests);
			}
			if (check_location(req.body.location)) {
				user_matches = helper.filter_locate(user_matches, req.body.location);
			}
			fn_render_search(req, res, next, '', user_matches);
		});
	} else {
		fn_getMatches(req, res, next, '');
	}
	console.log("\t\t\t\tHello: ", search);
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	(!req.session.uid) ? res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ') : 0;
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	fn_getMatches(req, res, next, req.params.redirect_msg);
});

module.exports = router;
