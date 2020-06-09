const express = require('express');
const router = express.Router();
let objectId = require('mongodb').ObjectID;

const helper = require('./helper_functions'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk


router.get('/', function (req, res) {
	let page_name = 'notify';
	if (req.session.uid) {
		let notifications = '';
		usersArray = [];

		let time = Date.now();
		helper_db.db_update('', 'users', { '_id': objectId(usersArray._id) }, { $set: { login_time: time } }, () => {});

		helper.findUserById(req.session.uid, (usersArray) => {
			if (usersArray) {
				console.log('user found');
				(usersArray.notifications) ? notifications = usersArray.notifications : notifications = null;
				setTimeout(() => {
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

		helper_db.db_update('', 'users', { '_id': objectId(req.session.uid) }, { $set: { 'gps': location } }, () => { });
	} else
		console.log('body not found');
});

module.exports = router;
