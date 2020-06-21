const assert = require('assert');
const mysql = require('mysql2');

var helper = require('./helper_functions'); // Helper functions Mk
// var helper_index = require('./helper_index'); // Helper functions Mk

const url = 'mongodb://localhost:27017';	// Database Address
const dbName = 'mk_matcha';					// Database Name

// const pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'admin',
// 	database: 'matcha',
// 	waitForConnections: true,
// 	connectionLimit: 10,
// 	queueLimit: 0
// });
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	port: 3306,
	password: 'admin',
	database: 'matcha'
});

module.exports = {
	db_create: (table, new_data, callback) => {
		console.log('create');
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
		let sql = 'INSERT INTO ' + table + ' SET ?';
		conn.query(sql, new_data, (err, result) => {
			if (err) throw err;
			console.log(result);
			// conn.end();
			callback;
		});
	},
	db_read: (table, find_data, callback) => {
		console.log('read T', table, ' D:', find_data);
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
		(find_data == '') ? find_data == 1 : 0;
		let sql = 'SELECT * FROM ' + table + ' WHERE ?';
		conn.query(sql, find_data, (err, res_arr) => {
			// console.log(conn.query(sql, find_data));
			if (err) throw err;
			console.log('helper_db found ', res_arr.length);
			// conn.end();
			callback(res_arr);
		});
	},
	db_update: (table, find_data, update_data, callback) => {
		console.log('update T', table, ' D:', find_data, 'U:', update_data);

		(find_data == '') ? find_data == 1 : 0;
		// let quiry_data = { update_data, find_data };
		let quiry_data = [update_data, find_data];
		let sql = 'UPDATE ' + table + ' SET ? WHERE ?';
		// console.log(conn.query(sql, quiry_data))
		// console.log('sql : ',sql);
		console.log('mYsql : ', 'UPDATE ' + table + ' SET ?', update_data, ' WHERE ?', find_data);
		conn.query(sql, quiry_data, (err, result) => {
			if (err) console.log('UPDATE err : : : ', err);
			// if (err) throw err;
			console.log('update result: ');
			// conn.end();
			callback();
		});
	},
	update_plus: (table, search, operetion, col, new_data, callback) => {

		new_data = JSON.stringify(new_data);
		console.log('\n\n_____________ update_plus _____________');
		let i_sql = 'SELECT ' + col + ' FROM ' + table + ' WHERE ?';
		conn.query(i_sql, search, (err, user_data) => {
			if (err) {
				throw err;
				callback();
			} else if (user_data) {
				mutate_data = [];
				user_data = user_data[0][col];
				if (user_data && user_data.length != 0) {
					user_data = JSON.parse(user_data);
					console.log(`user_data (${typeof(user_data)}) ${user_data}`);
					(Array.isArray(user_data)) ? mutate_data = user_data : mutate_data.push(user_data);
					console.log(`mutate_data (${typeof(mutate_data)} | ${Array.isArray(mutate_data)} ) ${mutate_data}`);

					mutate_data.push(JSON.parse(new_data));
					mutate_data = JSON.stringify(mutate_data);
				} else {
					mutate_data.push((new_data));							//	convert updated array to string
				}
				console.log(`\n\tnew_data(${typeof(new_data)}):  ${new_data}\n\tmutate_data (${typeof(mutate_data)} | ${Array.isArray(mutate_data)}) ${mutate_data}`);
				let quiry_data = [mutate_data, search];
				let sql = 'UPDATE ' + table + ' SET ' + col + ' = ? WHERE ?';
				conn.query(sql, quiry_data, (err, result) => {
					if (err) console.log('UPDATE err : : : ', err);
					callback();
					// console.log('SQL QUIERY', sql, '\n');
					// console.log('\n', conn.query(sql, quiry_data))
					// if (err) throw err;
					// console.log('____________________update result: ', result);
					// conn.end();
				});
			}
		});

		console.log('_____________ update_plus _____________\n\n');
	},
	upsert: (table, search, operetion, col, new_data, callback) => {
		this.db_read('', 'chats', search, chat => {
			if (chat) {
				this.update_plus(table, search, operetion, col, new_data, () => callback);
			} else {
				this.db_create('', table, { search, 'message': new_data }, () => {
					this.update_plus(table, search, operetion, col, new_data, () => callback);
				});
			}
		});
	},
	db_delete: (op, table, find_data, callback) => {
		console.log('delete');
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
		let sql = 'DELETE FROM ' + table + '  WHERE ?';
		conn.query(sql, find_data, (err, result) => {
			if (err) throw err;
			console.log(result);
			// conn.end();
			callback;
		});
	}
};


