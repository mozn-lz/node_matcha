const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';;					// Database Name

// (req.session.uid) ? helper.logTme : 0;	//	update last online

router.get('/', function (req, res) {
	let page_name = 'notify';
	if (req.session.uid) {
		let notifications = '';
		usersArray = [];

		MongoClient.connect(url, (err, client) => {
			const collection = client.db(dbName).collection('users');
			assert.equal(err, null);
			collection.find({ '_id': objectId(req.session.uid) }).forEach((doc, err) => {
				assert.equal(err, null);
				usersArray.push(doc);
			}, () => {
				if (usersArray) {
					(usersArray[0].notifications) ? notifications = usersArray[0].notifications : notifications = null;
					let time = Date.now();
					collection.updateOne({ '_id': objectId(usersArray[0]._id) }, {
						$set: { login_time: time }
					});
					// console.log(notifications);
					setTimeout(() => {
						client.close();
						res.send({ notifications });
					}, 1000);
				}
			});
		});
	}
	//  else {
	// 	res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	// }
});

module.exports = router;
