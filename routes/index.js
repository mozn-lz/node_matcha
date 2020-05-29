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

var page_name = 'home';

let fn_render_index = (req, res, next, msg, matches) => {
	
	console.log('req.session.uid ', req.session.uid);
	// var res_arr = matches;
	var res_arr = helper.sort_locate(matches, req.session.gps.country);
	
	// console.log('\n\n\n________fn_render_indexn________\n');
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

var fn_getMatches = (req, res, next, msg) => {

	console.log('\n\t\t1. msg: ', msg, '\n\n');
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);

		const db = client.db(dbName);
		var find_user = [];
		var user_matches = [];
		var match_criteria = {};
		const collection = db.collection('users');

		console.log('\n\t\t2. msg: ', msg, '\n\n');
		(() => {
			switch (req.session.oriantation) {
				case 'hetrosexual':
					if (req.session.gender == 'male') {
						match_criteria = { gender: "female", exception: "homosexual" };
						console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
						// user_matches = helper.search_DB(usr_data.gender, usr_data.exception);
					} else {
						match_criteria = { gender: "male", exception: "homosexual" };
						console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
					}
					break;
				case 'homosexual':
					if (req.session.gender == 'male') {
						match_criteria = { gender: "male", exception: "hetrosexual" };
						console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
					} else {
						match_criteria = { gender: "female", exception: "hetrosexual" };
						console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
					}
					break;
				case 'bisexual':
					if (req.session.gender == 'male') {
						match_criteria = { gender: "male", exception: "hetrosexual" };
						match_criteria = { gender: "female", exception: "homosexual" };
						console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
					} else if (req.session.gender == 'female') {
						usr_match_criteriadata = { gender: "female", exception: "homosexual" };
						match_criteria = { gender: "male", exception: "hetrosexual" };
						console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
					}
					break;
				default:
					console.log('Please make sure your gender and oriantation is specified');
					break;
			}
			// console.log(doc.oriantation, " ", match_criteria.exception, "\n");
			console.log(match_criteria);
			console.log("oriantation: ", match_criteria.oriantation);
			console.log("gender: ", match_criteria.gender);
			
			// collection.find({gender: "male"}).forEach(function (doc, err) {
			collection.find({gender: match_criteria.gender}).forEach(function (doc, err) {
				assert.equal(null, err);
				if (doc.oriantation != match_criteria.exception && doc._id != req.session.uid) {
					(!doc.profile) ? doc.profile = "/images/ionicons.designerpack/md-person.svg" : 0;
					user_matches.push(doc);
					console.log("Found a ", doc.oriantation, " ", doc.gender, " named ", doc.usr_user);
				} else {
					console.log("\t", doc.oriantation, " ", doc.gender, " named ", doc.usr_user, " Rejected");
				}
			})
		})(), (() => {
			client.close();
			setTimeout(() => {
				console.log('\n\t\t3. msg: ', msg, '\n\num  ++', user_matches.length);
						fn_render_index(req, res, next, msg, user_matches);
					}, 1500);
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

// // HANDLE Error or success messages.
router.get('/:redirect_msg', function (req, res, next) {
		// fn_render_index(req, res, next, '', matches)
	console.log('0. req.params.redirect_msg ', req.params.redirect_msg);
	
	fn_getMatches(req, res, next, req.params.redirect_msg);
	// fn_getMatches(req, res, next, message);
	// fn_render_index(req, res, next, req.params.redirect_msg, matches)
});

module.exports = router;
