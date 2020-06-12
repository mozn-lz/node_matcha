const assert = require('assert');
const mysql = require('mysql2');

var helper = require('./helper_functions'); // Helper functions Mk
// var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'matcha',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

module.exports = {
	db_create: (op, table, new_data, callback) => {
		// if (op == 'mongo') {
		// 	MongoClient.connect(url, function (err, client) {
		// 		assert.equal(null, err);
		// 		client.db(dbName).collection(table).insertOne(new_data, (err, result) => {
		// 			assert.equal(null, err);
		// 		}, () => {
		// 			client.close();
		// 			callback;
		// 		});
		// 	});
		// }
		if (op == 'sql') {
			let sql = 'INSERT INTO ' + table + ' SET ?';
			pool.query(sql, new_data, (err, result) => {
				if (err) throw err;
				console.log(result);
				pool.end();
				callback;
			});
		}
	},
	db_read: (op, table, find_data, callback) => {
		// if (op == 'mongo') {
			// 	MongoClient.connect(url, function (err, client) {
				// 		assert.equal(null, err);
		// 		let res_arr = [];
		// 		client.db(dbName).collection(table).find(find_data).forEach((doc, err) => {
		// 			assert.equal(null, err);
		// 			res_arr.push(doc);
		// 		}, () => {
		// 			client.close();
		// 			callback(res_arr);
		// 		});
		// 	});
		// }
		if (op == 'sql') {
			(find_data == '') ? find_data == 1 : 0;
			let sql = 'SELECT * FROM ' + table + ' WHERE ?';
			pool.query(sql, find_data, (err, res_arr) => {
				if (err) throw err;
				console.log('helper_db found ', res_arr.length);
				// pool.end();
				callback(res_arr);
			});
		}
	},
	db_update: (op, table, find_data, update_data, callback) => {
		// if (op == 'mongo') {
		// 	MongoClient.connect(url, function (err, client) {
		// 		assert.equal(null, err);
		// 		client.db(dbName).collection(table).updateOne(find_data, update_data, () => {
		// 			assert.equal(null, err);
		// 			client.close();
		// 			callback();
		// 		});
		// 	});
		// }
		if (op == 'sql') {
			(find_data == '') ? find_data == 1 : 0;
			let sql = 'UPDATE ' + table + ' SET ? WHERE ?' ;
			pool.query(sql, update_data, find_data, (err, result) => {
				if (err) throw err;
				console.log(result);
				pool.end();
				callback();
			});
		}
	},
	db_delete: (op, table, find_data, callback) => {
		// if (op == 'mongo') {
		// 	MongoClient.connect(url, function (err, client) {
		// 		assert.equal(null, err);
		// 		client.db(dbName).collection(table).remove(find_data, () => {
		// 			assert.equal(null, err); client.close();
		// 		}, () => {
		// 			client.close();
		// 			callback;
		// 		});
		// 	});
		// }
		if (op == 'sql') {
			let sql = 'DELETE FROM ' + table + '  WHERE ?';
			pool.query(sql, find_data, (err, result) => {
				if (err) throw err;
				console.log(result);
				callback;
			});
		}
	}
};
// 19/04


