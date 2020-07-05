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
		return (false);
	} else {
		return (true);
	}
}

function check_age(chk_age) {
	if (is_empty(chk_age)) {
		return (false);
	} else {
		return (true);
	}
}

function check_num(num) {
	if (is_empty(num) || Number(num) == NaN) {
		console.log('num is false');
		return (false);
	} else {
		console.log('num is true');
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
	if (is_empty(chk_location)) {
		return (false);
	} else {
		return (true);
	}
}

let fn_render_search = (req, res, next, msg, matches) => {

	console.log('req.session.uid ', req.session.uid);
	console.log('\n\n\n________fn_render_search (', matches.length, ')________\n');
	if (req.session.uid) {
		console.log(`\n\t${matches.length} results\n`)
		let res_arr = [];
		(matches.length > 0) ? res_arr = helper.sort_locate(matches, req.session.gps) : res_arr = null;
		var msg_arr = [];
		(msg.search('pass_err') == 0) ? pass_er = "danger" : pass_er = '';
		(msg.search('pass_suc') == 0) ? pass_suc = "success" : pass_suc = '';
		msg_arr = msg.slice(8).split(",");
		// console.log('2. msg_arr: ' + msg_arr + "\n3. res_arr: " + res_arr + '\n');

		res.send(res_arr);
		// res.render(page_name, {
		// 	// match_list: res_arr,
		// 	msg_arr,
		// 	er: pass_er,
		// 	suc: pass_suc,
		// 	title: 'friends'
		// });

	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}


router.get('/', (req, res, next) => {
	if (req.session.uid) {
		// res.redirect('/index');
		helper.fn_getMatches(req, res, result => fn_render_search(req, res, next, '', result));
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

router.post('/', (req, res, next) => {
	if (req.session.uid) {
		console.log(req.body);
		let search = req.body.search;
		let age_min = req.body.age_min;
		let fame_min = req.body.fame_min;
		let age_max = req.body.age_max;
		let fame_max = req.body.fame_max;
		let intrests = req.body.intrests;
		let location = req.body.location;
		(search) ? console.log(`\n\tsearch: ${search}\n`) : console.log('\n\tsearch not found\n');
		(age_min) ? console.log(`\n\age_min: ${age_min}\n`) : console.log('\n\age_min not found\n');
		(fame_min) ? console.log(`\n\fame_min: ${fame_min}\n`) : console.log('\n\fame_min not found\n');
		(age_max) ? console.log(`\n\age_max: ${age_max}\n`) : console.log('\n\age_max not found\n');
		(fame_max) ? console.log(`\n\fame_max: ${fame_max}\n`) : console.log('\n\fame_max not found\n');
		(intrests) ? console.log(`\n\tintrests: ${intrests}\n`) : console.log('\n\tintrests not found\n');
		(location) ? console.log(`\n\tlocation: ${location}\n`) : console.log('\n\tlocation not found\n');

			helper.fn_getMatches(req, res, (user_matches) => {
				console.log('\t\t***', user_matches.length);
				if (check_num(fame_min) || check_num(fame_max)) {
					console.log('********** filtering fame **********');
					(fame_max > 5) ? fame_max = 5 : 0;
					(fame_min < 0) ? fame_min = 0 : 0;
					(fame_max < fame_min) ? user_matches = helper.filter_fame(user_matches, fame_max, fame_min) : user_matches = helper.filter_fame(user_matches, fame_min, fame_max);
				}
				if (check_num(age_min) || check_num(age_max)) {
					console.log('********** filtering age **********');
					(age_max > 100) ? age_max = 100 : 0;
					(age_min < 18) ? age_min = 18 : 0;
					(age_max < age_min) ? user_matches = helper.filter_age(user_matches, age_max, age_min) : user_matches = helper.filter_age(user_matches, age_min, age_max);
				}
				if (chk_intrests(intrests)) {
					console.log('********** filtering intrests **********');
					user_matches = helper.filter_tags(user_matches, intrests);
				}
				if (check_location(location)) {
					console.log('********** filtering location **********');
					user_matches = helper.filter_locate(user_matches, (location));
				}
				if (!is_empty(search)) {
					console.log('\n\t\t********** filtering for name **********\n');
					user_matches = helper.filer_name(user_matches, (search));
				}
				// setTimeout(() => {
				// console.log(`filter: ${user_matches.length} remaining`);
				fn_render_search(req, res, next, '', user_matches);
				// }, 1500);
			});
			console.error('parametsers undefined');
		// 	console.log('parametsers undefined');

		// 	helper.fn_getMatches(req, res, result => fn_render_search(req, res, next, 'pass_errParametsers undefined', result));
		// console.log("\t\t\t\tHello: ", search);
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	res.redirect('/index');
	// (!req.session.uid) ? res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ') : 0;
	// console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	// helper.fn_getMatches(req, res, result => fn_render_search(req, res, next, req.params.redirect_msg, result));
});

module.exports = router;
