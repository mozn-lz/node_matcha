var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'matcha';					// Database Name

var page_name = 'view_profile';

var renderProfile = (res, data) => {
	res.render(page_name, {
		title	: page_name,
		id		: data._id,
		picture	: data.pic,
		username: data.usr_user,
		fname	: data.usr_name,
		lname	: data.usr_surname,
		bio			: data.bio,
		intrests	: data.intrests,
		pic		: data.pic,
		age		: data.age,
		gender	: data.gender,
		rating	: data.rating,
		gps		: data.gps,
		viewd	: data.viewd,
		liked	: data.liked
	});
}


router.get('/:reqId', (req, res, next) => {
	console.log("************View Profle************\n");
	
	if (req.session.uid) {
		let friendReqId = req.params.reqId
		console.log("friendId: ", friendReqId);

		let notification = {	// notification object
			from : req.session.uid,
			type : 'view profile'
		}

		MongoClient.connect(url, (err, client) => {
			assert.equal(null, err);
			const db = client.db(dbName);
			var find_user = [];
			const collection = db.collection('users');

			collection.find({ '_id': objectId(friendReqId) }).forEach((doc, err) => {
				assert.equal(null, err);
				// (!doc.profile) ? doc.profile = "/images/ionicons.designerpack/md-person.svg" : 0;
				find_user.push(doc);
				console.log('\t\t doc: ' + doc);

			},( () => {
				collection.updateOne({ '_id': objectId(friendReqId) }, 	// send norification to 'friend'
				{$addToSet: {
					notifications : notification
				}});
			})(), () => {
				client.close();
				console.log('find_user.length: ', find_user.length);
				let message = '';
				if (find_user.length == 1) {
					/*******************************/
					/*     make friend request     */
					/*******************************/
					console.log('if: find_user.length', find_user.length == 1);
					message = "pass_sucFriend request has been made";
					console.log("\n\t\tmessage ", message, "\n");
					(!find_user[0].profile) ? find_user[0].profile = "/images/ionicons.designerpack/md-person.svg" : 0;
					(find_user[0] == 'show') ? find_user[0].gps = gps : find_user[0].gps = '';		//
					renderProfile(res, find_user[0]);
				} else {
					console.log("Else " + friendReqId + " not found");
					// res.redirect('/messages');
					//  (friendReqId.search('pass_suc') == 0) ? res.render(page_name, {
					message = "pass_errError: friend requiest unsuccessfill, please try again";
					console.log("\n\t\tmessage ", message, "\n");
					res.redirect('/index')
					// renderProfile(res, find_user);
				}
				console.log('exiting render misfunction');
			});
		});

	} else {
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;