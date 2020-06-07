const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const helper = require('./helper_functions'); // Helper functions Mk
const message_helper = require('./Helper_messages');

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';;					// Database Name

router.get('/', function (req, res) {
	let page_name = 'notify';
	if (req.session.uid) {
		let notifications = '';
		usersArray = [];

		MongoClient.connect(url, (err, client) => {
			const collection = client.db(dbName).collection('users');
			assert.equal(err, null);
			let time = Date.now();
			collection.updateOne({ '_id': objectId(usersArray._id) }, {
				$set: { login_time: time }
			}, () => client.close());
		});

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
		MongoClient.connect(url, (err, client) => {
			assert.equal(null, err);
			client.db(dbName).collection('users').updateOne({
				'_id': objectId(req.session.uid)
			}, {
				$set: {
					'gps': location
				}
			})
		});
	} else
		console.log('body not found');
});

module.exports = router;
