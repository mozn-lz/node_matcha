const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';;					// Database Name

router.get('/', function (req, res) {
	let page_name = 'notify';
	if (req.session.uid) {
		let notifications = '';
		usersArray = [];

		MongoClient.connect(url, (err, client) => {
			const db = client.db(dbName);
			assert.equal(err, null);
			db.collection('users').find({ '_id': objectId(req.session.uid) }).forEach((doc, err) => {
				assert.equal(err, null);
				usersArray.push(doc);
			}, () => {
				if (usersArray) {
					(usersArray[0].notifications) ? notifications = usersArray[0].notifications : notifications = null;
					console.log(notifications);
					setTimeout(() => {
						res.send({ notifications });
					}, 1000);
				}
			});
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;
