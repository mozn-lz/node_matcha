const express = require('express');
const router = express.Router();

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk


router.get('/', function (req, res) {
	let page_name = 'notify';
	if (req.session.uid) {
		let notifications = '';

		let time = Date.now();
		helper_db.db_update('users', { '_id': req.session.uid }, { 'login_time': time }, () => {
			console.log('set time to ', time, ' for user with id ', req.session.uid);
		});
		
		helper.calc_fame(req.session.uid);	//	update fame rating

		// helper_db.db_read('users', { 'usr_email': email }, find_user => { });
		helper_db.db_read('users', { '_id': req.session.uid }, usersArray => {
			usersArray = usersArray[0];
			// console.log('usersArray ', usersArray)
			// helper.findUserById(req.session.uid, (usersArray) => {
			if (usersArray) {
				console.log('user found');
				(usersArray.notifications) ? notifications = JSON.parse(usersArray.notifications) : notifications = null;
				setTimeout(() => {
					console.log(notifications);
					res.send({ notifications });
				}, 1000);
			} else {
				console.log('user not found');
			}
		});
	}
	//  else {
	// 	res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	// }
});

router.post('/', (req, res) => {
	let location = {};
	let data = JSON.parse(JSON.stringify(req.body));
	if (req.body && req.session.uid) {
		location.country = data.country;
		location.city = data.city;
		location.timezone = data.timezone;
		console.log('\t\t Location* ', location);
		req.session.gps = location;

		helper_db.db_update('users', { '_id': (req.session.uid) }, { 'gps': JSON.stringify(location) }, () => {
			console.log('location updated to ' + location)
		});
	} else
		console.log('body not found');
});

module.exports = router;
