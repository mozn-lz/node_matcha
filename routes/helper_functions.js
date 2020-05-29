
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let objectId = require('mongodb').ObjectID;
let nodemailer = require('nodemailer');
// var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

module.exports = {
	findUserById: (user_id, callback) => {

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			var user = [];

			client.db(dbName).collection('users').find({ '_id': objectId(user_id) }).forEach(function (doc, err) {
				assert.equal(null, err);
				user.push(doc);
				console.log("RESULT: Name: " + doc.usr_name);
			}, function () {
				client.close();
				console.log("\nfn_Helper : db search complete. " + user.length + " matches found\n");
				callback(user[0]);
			});
		});
	},

	logTme: () => {
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			client.db(dbName).collection('users').updateOne({ '_id': objectId(req.session.uid) }, {
				$set: { 'login_time': Date.now() }
			}, () => {
				assert.equal(null, err);
				client.close();
				console.log('Time');
			});
		});

	},

	sendMail: (from, to, subject, message, callback) => {
		//email Sender
		// var transporter = nodemailer.createTransport({
		// 	service: 'gmail',
		// 	auth: {
		// 		user: 'unathinkomo16@gmail.com',
		// 		pass: '0786324448'
		// 	}
		// });

		const mailCredentials = {
			user: 'mozn.lozn2000@gmail.com',
			pass: 'm0zzy10zzy'
		}
		if (from === '') from = 'mozn.lozn2000@gmail.com';

		console.log('___fn_Mail___\nfrom: ', from, '\nto: ', to, '\nsubject:', subject, '\nmessage: ', message);

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: mailCredentials
		});

		// Sending email to recipiant
		var mailOptions = {
			'from': from,
			'to': to,
			'subject': subject,
			'html': message
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);

			} else {
				console.log('\t\tEmail sent: ' + info.response);
			}
		});
		//	end email
		callback();
	},

//	START SORTING FUNCTIONS
	sort_fame: (toSort) => {
		let sortFame = (fame_arr) => {
			for (var i = 0; i < fame_arr.length; i++) {
				if (fame_arr[i + 1].fame && fame_arr[i].fame > fame_arr[i + 1].fame) {
					let tmp = fame_arr[i];
					fame_arr[i] = fame_arr[i = 1];
					fame_arr[i + 1] = tmp;
				}
			}
			return (fame_arr);
		}
		for (var i = 0; i < toSort.length; i++) {
			if (toSort[i + 1] && toSort[i] > toSort[i + 1]) {
				i = 0;
				toSort = sortFame(toSort);
			}
		}
	},
	sort_age: (toSort) => {
		let sortAge = (age_arr) => {
			for (var i = 0; i < age_arr.length; i++) {
				if (age_arr[i + 1] && age_arr[i] > age_arr[i + 1]) {
					let tmp = age_arr[i];
					age_arr[i] = age_arr[i = 1];
					age_arr[i + 1] = tmp;
				}
			}
			return (age_arr);
		}
		for (var i = 0; i < toSort.length; i++) {
			if (toSort[i + 1] && toSort[i] > toSort[i + 1]) {
				i = 0;
				toSort = sortAge(toSort);
			}
		}
		return (toSort);
	},
	sort_tags: (matches, tags) => {
		let sorted = [];
		for (let i = 0; i < tags.length; i++) {
			for (let j = 0; j < matches.length; j++) {
				(!matches[j].score) ? matches[j].score = 0 : 0;
				if (matches[j].intrests.includes(tags[i])) {
					matches[j].score++;
				}
			}
		}
		for (let i = 7; i >= 0; i--) {
			for (let j = 0; j < matches.length; j++) {
				if (matches[j].score == j) {
					sorted.push(matches[j]);
				}
			}
		}
		return (sorted);
	},
	sort_locate: (matches, location) => {
		let sorted = [];
		console.info('locate__', matches.length);
		for (let i = 0; i < matches.length; i++) {
			if (matches[i].gps.city == location) {
				sorted.push(matches[i]);
			}
			// console.info('oinfo , city');
		}
		for (let i = 0; i < matches.length; i++) {
			if ((matches[i].gps.country == location) && (matches[i].gps.city != location)) {
				sorted.push(matches[i]);
			}
		}
		for (let i = 0; i < matches.length; i++) {
			if ((matches[i].gps.country != location) && (matches[i].gps.city != location)) {
				sorted.push(matches[i]);
			}
		}
		// (sorted.length == 0) ? sorted = matches : 0;
		return (sorted);
	},
//	END SORTING FUNCTIONS

//	START FILTERING FUNCTIONS
	filter_fame: (filter_arr, begin, range) => {
		let result = [];
		for (let i = 0; i < filter_arr.length; i++) {
			if ((filter_arr[i] <= (begin + range)) &&
				(filter_arr[i] >= (begin[i] - range))) {
				result.push(filter_arr);
			}
		}
		return (result);
	},
	filter_age: (age_arr, begin, range) => {
		let result = [];
		for (var i = 0; i < age_arr.length; i++) {
			if ((age_arr[i] <= (begin + range)) &&
				(age_arr[i] >= (age_arr[i] - range))) {
				result.push(age_arr);
			}
		}
		return (result);
	},
	filter_tags: (matches, tags) => {
		let result = [];
		for (let i = 0; i < tags.length; i++) {
			for (let j = 0; j < matches.length; j++) {
				(!matches[j].score) ? matches[j].score = 0 : 0;
				if (matches[j].intrests.includes(tags[i])) {
					matches[j].score++;
				}
			}
		}
		for (let i = 7; i >= 0; i--) {
			for (let j = 0; j < matches.length; j++) {
				if (matches[j].score == j) {
					result.push(matches[j]);
				}
			}
		}
		return (result);
	},
	filter_locate: (matches, location) => {
		let result = [];
		for (let i = 0; i < matches.length; i++) {
			if ((matches[i].gps.country == location.country) && (matches[i].gps.city == location.city)) {
				result.push(matches[i]);
			}
		}
		for (let i = 0; i < matches.length; i++) {
			if ((matches[i].gps.country == location.country) && (matches[i].gps.city != location.city)) {
				result.push(matches[i]);
			}
		}
		for (let i = 0; i < matches.length; i++) {
			if ((matches[i].gps.country != location.country) && (matches[i].gps.city != location.city)) {
				result.push(matches[i]);
			}
		}
		return (result);
	}
//	END FILTERING FUNCTIONS
};