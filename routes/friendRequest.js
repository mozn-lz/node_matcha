var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';;					// Database Name
var page_name = 'friend request';

/* GET view_profile listing. */
router.get('/', function (req, res, next) {
	console.log("************Friend Req(N/A)************\n");

	res.redirect('/index');
});


router.get('/:reqId', (req, res, next) => {
	console.log("************Friend req(ARG)************\n");

	let message = null;
	if (req.session.uid) {
		helper.findUserById(req.session.uid, (user) => {
			// if (user.picture)
			if (user.picture && user.picture.length <= 1) {
				let friendReqId = req.params.reqId
				console.log("1. usrId: ", req.session.uid, '\n');
				console.log("1. friendId: ", friendReqId, '\n');

				let notification = {	// notification object
					from: req.session.uid,
					type: 'friend request'
				}
				// Connect and save data to mongodb
				MongoClient.connect(url, function (err, client) {
					assert.equal(null, err);
					console.log("\tConnected to server and mongo connected Successfully");
					const db = client.db(dbName);
					const collection = db.collection('users');
					collection.updateOne({
						'_id': objectId(friendReqId)
					}, {
						$addToSet: {
							request: req.session.uid
						}
					}, (() => {
						console.log('Sending notification');
						collection.updateOne({ '_id': objectId(friendReqId) }, 	// send norification to 'friend'
							{
								$addToSet: {
									notifications: notification
								}
							});
					})(), (err, result) => {
						console.log('Hahahah, notifications are fucking up');
						client.close();
						message = 'pass_sucFriend request has been made';
						res.redirect('/index/' + message);
					});
				});
			} else {
				message = 'pass_errPlease upouad a picture first';
				res.redirect('/index/' + message);
			}
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;
