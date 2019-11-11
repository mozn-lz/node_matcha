var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'home';


/* GET view_profile listing. */
router.get('/', function (req, res, next) {
	console.log("************Friend Req(N/A)************\n");

	res.redirect('/index');
});


router.get('/:reqId', (req, res, next) => {
	console.log("************Friend req(ARG)************\n");

	let message = null;
	if (req.session.usrId) {
		let friendReqId = req.params.reqId
		console.log("1. usrId: ", req.session.usrId, '\n');
		console.log("1. friendId: ", friendReqId, '\n');

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
					request: req.session.usrId 
				}
			}, (err, result) => {
				client.close();
				message = 'pass_sucFriend request has been made';
				res.redirect('/index/' + message);
			});
		});
	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;