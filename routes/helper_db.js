const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let objectId = require('mongodb').ObjectID;
var helper = require('./helper_functions'); // Helper functions Mk
// var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name


module.exports = {
	db_create: (op, table, new_data, callback) => {

		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			client.db(dbName).collection(table).insertOne(new_data, (err, result) => {
				assert.equal(null, err);
			}, () => {
				client.close();
				callback;
			});
		});
	},
	db_read: (op, table, find_data, callback) => {
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			let res_arr = [];
			client.db(dbName).collection(table).find(find_data).forEach((doc, err) => {
				assert.equal(null, err);
				res_arr.push(doc);
			}, () => {
				client.close();
				callback(res_arr);
			});
		});
	},
	db_update: (op, table, find_data, update_data, callback) => {
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			client.db(dbName).collection(table).updateOne(find_data, update_data, () => {
				assert.equal(null, err);
				client.close();
				callback();
			});
		});
	},
	db_delete: (op, table, find_data, callback) => {
		MongoClient.connect(url, function (err, client) {
			assert.equal(null, err);
			client.db(dbName).collection(table).remove(find_data, () => {
				assert.equal(null, err); client.close();
			}, () => {
				client.close();
				callback;
			});
		});
	}
};



