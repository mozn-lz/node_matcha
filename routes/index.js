var express = require('express');
var router = express.Router();
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
// var helper_index = require('./helper_index'); // Helper functions Mk


var page_name = 'home';

let fn_render_index = (req, res, next, msg, matches) => {
	console.log('req.session.uid ', req.session.uid);
	// var res_arr = matches;
	// console.log('\n\n\n________fn_render_indexn________\n');
	if (req.session.uid) {
		console.log('sorting');
		var res_arr = helper.sort_locate(matches, req.session.gps);
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
		console.log('render');
		res.render('index', {
			match_list: res_arr,
			msg_arr,
			er: pass_er,
			suc: pass_suc,
			title: 'home'
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
}

router.get('/', (req, res, next) => {
	console.log('\t\t____SAO');
	if (req.session.uid) {
		console.log('\t\t____SAO');
		helper.fn_getMatches(req, res, user_matches => {
			fn_render_index(req, res, next, '', user_matches);
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
	if (req.session.uid) {
		let msg  = req.params.redirect_msg;

		helper.fn_getMatches(req, res, (user_matches) => {
			fn_render_index(req, res, next, msg, user_matches);
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;
