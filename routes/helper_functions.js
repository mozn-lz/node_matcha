
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let objectId = require('mongodb').ObjectID;
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

	}
};