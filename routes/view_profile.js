const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
let objectId = require('mongodb').ObjectID;
const assert = require('assert');
var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

var page_name = 'view_profile';

let renderProfile = (res, data) => {
	// console.log('profile pic ', data.profile);
	console.log('data.history ', data.history);
	// console.log('rendering page: ', page_name);
	res.render(page_name, {
		title: page_name,
		id: data._id,
		picture: data.profile,
		username: data.usr_user,
		fname: data.usr_name,
		lname: data.usr_surname,
		bio: data.bio,
		intrests: data.intrests,
		pic: data.pic,
		age: data.age,
		gender: data.gender,
		rating: data.rating,
		gps: data.gps,
		viewd: data.viewd,
		liked: data.liked,
		history: data.history
	});
}

router.get('/:reqId', (req, res, next) => {
	console.log("************View Profle************\n");

	if (req.session.uid) {
		let friendId = req.params.reqId

		console.log('friendid -_-: ', friendId);
		let notification = {	// notification object
			from: req.session.uid,
			type: 'view profile'
		}

		MongoClient.connect(url, (err, client) => {
			assert.equal(null, err);
			const db = client.db(dbName);
			var find_user = [];
			const collection = db.collection('users');
			collection.find({ '_id': objectId(friendId) }).forEach((doc, err) => {
				assert.equal(null, err);
				find_user.push(doc);
				console.log('\t\t doc: ' + doc);
			}, () => {
				collection.updateOne({ '_id': objectId(req.session.uid) }, 	// Add to visit history
					{
						$addToSet: {
							history: {
								id: find_user[0].uid,
								name: find_user[0].name,
								surname: find_user[0].surname,
								date: Date.now()
							}
						}
					});
				collection.updateOne({ '_id': objectId(friendId) }, 	// send norification to 'friend'
					{
						$addToSet: {
							notifications: notification
						}
					});
				client.close();
				let message = '';
				if (find_user.length == 1) {
					helper.findUserById(req.session.uid, (user) => {
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
		res.redirect('/login/' + 'pass_errYou have to be logged in to view the ' + page_name + ' page ');
	}
});

module.exports = router;