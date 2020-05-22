
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let objectId = require('mongodb').ObjectID;
let nodemailer = require('nodemailer');
// var helper = require('./helper_functions'); // Helper functions Mk
var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

module.exports = {
	// Finds ireq.body.psswds string is empty
	is_empty: function (str) {
		ret = str.trim();

		if (ret.length == 0) {
			console.log('\t\tis_empty: Returning true for ' + str + ' of length ' + ret.length);
			return (true);
		}
		console.log('\t\tis_empty: Returning false for ' + str + ' of length ' + ret.length);
		return (false);
	},

	// finds if param1 is equal to param 2
	is_match: function (str1, str2) {
		if ((this.is_empty(str1) && this.is_empty(str2)) || (str1 !== str2)) {
			return (false);
		}
		return (true);
	},
	search_DB: function (usr_data, exception) {

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);

			const db = client.db(dbName);
			var user_matches = [];
			const collection = db.collection('users');

			console.log(usr_data);

			collection.find({ gender: usr_data }).forEach(function (doc, err) {
				assert.equal(null, err);
				if (doc.oriantation != exception) {
					user_matches.push(doc);
					console.log("RESULT: Name: " + doc.usr_name + ", Orinat: " + doc.oriantation + " (AKA) !" + exception);
				}
			}, function () {
				client.close();
				console.log("\nfn_Helper : db search complete. " + user_matches.length + " matches found\n");
				// for (let i = 0; i < res_arr.length; i++) {
				// 	// const element = res_arr[i];
				// 	console.log("res_arr[" + i + "] " + res_arr[i].usr_name);
				// }
				return (user_matches);
			});
		});
	},

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

			var user = [];

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
		// var transporter = nodemailer.createTransport({
		// 	service: 'yahoo',
		// 	auth: {
		// 		user: 'mozn_lozn@yahoo.com',
		// 		pass: 'M0zzy10zzy'
		// 	}
		// });
		const mailCredentials = {
			user: 'mozn.lozn2000@gmail.com',
			pass: 'm0zzy10zzy'
		}
		if(from === '') from = 'mozn.lozn2000@gmail.com';
		
		console.log('___fn_Mail___\nfrom: ',from, '\nto: ', to, '\nsubject:', subject,'\nmessage: ', message);
		
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: mailCredentials
		});

		// Sending email to recipiant
		var mailOptions = {
			'from' : from,
			'to' : to,
			'subject' : subject,
			'html' : message
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
	}
};