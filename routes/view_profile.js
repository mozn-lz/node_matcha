const express = require('express');
const router = express.Router();


var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk


var page_name = 'view_profile';

let renderProfile = (res, data) => {
	let time = Date.now();
	if (data.login_time) {
		// console.log('(time - 300000) <= data.login_time = ', (time - 300000) <= data.login_time);
		data.login_time = Number(data.login_time);
		if ((time - 10000) <= data.login_time) {
			data.login_time = 'online';
			// console.log('t', time);
			// console.log('Login time: ', data.login_time);
		} else {
			// console.log(data.login_time);
			data.login_time = new Date(data.login_time);
		}
	} else {
		// console.log('data.login_time; ', data.login_time);
		data.login_time = '-';
		// console.log('data.login_time; ', data.login_time);
	}
	// (data.intrests) ? JSON.parse(data.intrests) : 0;
	// console.log(typeof(data.intrests));
	data.intrests ? data.intrests = JSON.parse(data.intrests) : 0;
	// console.log(typeof(data.intrests));
	// console.log(`\n${typeof (data.history)}\ndata.history\n`);
	data.history ? data.history = JSON.parse(data.history) : 0;
	// console.log(`\n${typeof (data.history)}\ndata.history\n`);

	(data.history != undefined && Array.isArray(data.history)) ? data.history = data.history.reverse() : 0;
	res.render(page_name, {
		title: page_name,
		id: data._id,
		picture: data.profile_pic,
		username: data.usr_user,
		fname: data.usr_name,
		lname: data.usr_surname,
		bio: data.bio,
		intrests: data.intrests,
		oriantation: data.oriantation,
		pic: data.pic,
		age: data.age,
		gender: data.gender,
		rating: data.rating,
		gps: data.gps,
		viewd: data.viewd,
		liked: data.liked,
		history: data.history,
		checkin: data.login_time
	});
}

router.get('/:reqId', (req, res, next) => {
	// console.log("************View Profle************\n");

	if (req.session.uid) {
		helper.complete_profile(req.session.uid, complete_profile =>{
			if (complete_profile) {
				let friendId = req.params.reqId;
		
				// console.log('friendid -_-: ', friendId);
				let notification = {	// notification object
					from: req.session.uid,
					type: 'view profile'
				}
		
				helper_db.db_read('users', { '_id': (friendId) }, find_user => {
					let blk = find_user[0].blocked.includes(req.session.uid);
					// console.log(`find_user[0].blocked ${find_user[0].blocked}\n` + 'find_user.blocked.includes(req.session.uid): ' + find_user[0].blocked.includes(req.session.uid));
					console.log(blk);
					
					if (!blk) {
						// Add to visit hostory 
						helper_db.update_plus('users', { '_id': (req.session.uid) }, '$addToSet', 'history', { id: find_user[0]._id, name: find_user[0].usr_name, surname: find_user[0].usr_surname, date: new Date(Date.now()) }, () => {
							// console.log('history added');
		
							// send notification to 'friend'
							helper_db.update_plus('users', { '_id': (friendId) }, '$addToSet', 'notifications', notification, () => {
								// console.log('notification added');
		
								let message = '';
								if (find_user.length == 1) {
									helper_db.db_read('users', { '_id': req.session.uid }, user => {
										user = user[0];
										// console.log(`\ttypeof(user) ${typeof(user)}`);
										// user.history = JSON.parse(user.history);
										// console.log(`\ttypeof(history) ${typeof (user.history)}\n\tis array ${Array.isArray(user.history)}`)
										// console.log(`\ttypeof(history) ${typeof (user.history)}\n\tis array ${Array.isArray(user.history)}`)
										// helper.findUserById(req.session.uid, user => {
										find_user[0].history = user.history;	// bad code #quickfix
										renderProfile(res, find_user[0]);
									});
								} else {
									message = "pass_errError: friend requiest unsuccessfill, please try again";
									res.redirect('/index');
								}
							});
						});
					} else {
						res.redirect('/index');
					}
				});
			} else {
				res.redirect('/index/pass_errPlease complete your profile first');
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});
router.get('/', (req, res, next) => {
	res.redirect('/index/');
});

module.exports = router;