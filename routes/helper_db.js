const assert = require('assert');
const mysql = require('mysql2');

var helper = require('./helper_functions'); // Helper functions Mk

const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	port: 3306,
	password: 'admin',
	database: 'matcha'
});

module.exports = {
	db_create: (table, new_data, cb) => {
		// console.log('create' + new_data);
		// console.log(new_data);
		let sql = 'INSERT INTO ' + table + ' SET ?';
		conn.query(sql, new_data, (err, result) => {
			// console.log(conn.query(sql, new_data));
			if (err) throw err;
			// console.log(`\nuser created\n`);
			// console.log(result);
			// conn.end();
			cb();
		});
	},
	db_read: (table, find_data, callback) => {
		// console.log('fn_read Tb', table, '.\tData:', find_data);
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
		// }0
		(find_data == '') ? find_data == 1 : 0;
		let sql = 'SELECT * FROM ' + table + ' WHERE ?';
		conn.query(sql, find_data, (err, res_arr) => {
			// console.log(conn.query(sql, find_data));
			if (err) throw err;
			// console.log(`READ:  (${res_arr.length}): ${res_arr.usr_user}`);
			callback(res_arr);
		});
	},
	db_update: (table, find_data, update_data, callback) => {
		// console.log('update T', table, ' D:', find_data, 'U:', update_data);

		(find_data == '') ? find_data == 1 : 0;
		// let quiry_data = { update_data, find_data };
		let quiry_data = [update_data, find_data];
		let sql = 'UPDATE ' + table + ' SET ? WHERE ?';
		// console.log(conn.query(sql, quiry_data))
		// console.log('sql : ',sql);
		// console.log('mYsql : ', 'UPDATE ' + table + ' SET ?', update_data, ' WHERE ?', find_data);
		conn.query(sql, quiry_data, (err, result) => {
			if (err) console.log('UPDATE err : : : ', err);
			// if (err) throw err;
			// console.log('update result: ');
			// conn.end();
			callback();
		});
	},
	update_plus: (table, search, operetion, col, new_data, callback) => {

		new_data = JSON.stringify(new_data);
		// console.log('\n\n_____________ update_plus _____________');
		let i_sql = 'SELECT ' + col + ' FROM ' + table + ' WHERE ?';
		conn.query(i_sql, search, (err, user_data) => {
			if (err) {
				// console.log(conn.query(i_sql, search));
				throw err;
				callback();
			} else if (user_data) {
				if ((col == 'notifications' || col == 'blocked' || col == 'friends') &&  user_data[0][col].includes(new_data)) {
					// console.log('\n\nit works\n\n');
					callback();
				} else {
					// console.log(`\n\nnotifications is not included\n${col} \t${new_data}\t${user_data[0][col]}\n\n`);
					mutate_data = [];
					// console.log(user_data)
					user_data = user_data[0][col];
					if (user_data && user_data.length != 0) {
						user_data = JSON.parse(user_data);
						// console.log(`user_data (${typeof(user_data)}) ${user_data}`);
						(Array.isArray(user_data)) ? mutate_data = user_data : mutate_data.push(user_data);
						// console.log(`mutate_data (${typeof(mutate_data)} | ${Array.isArray(mutate_data)} ) ${mutate_data}`);

						mutate_data.push(JSON.parse(new_data));
						mutate_data = JSON.stringify(mutate_data);
					} else {
						mutate_data.push((new_data));							//	convert updated array to string
					}
					// console.log(`\n\tnew_data(${typeof(new_data)}):  ${new_data}\n\tmutate_data (${typeof(mutate_data)} | ${Array.isArray(mutate_data)}) ${mutate_data}`);
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
			}
		});

		// console.log('_____________ update_plus _____________\n\n');
	},
	update_minus: (table, search, operetion, col, new_data, callback) => {

		new_data = JSON.stringify(new_data);
		// console.log('\n\n_____________ update_minus _____________');
		let i_sql = 'SELECT ' + col + ' FROM ' + table + ' WHERE ?';
		// console.log(`col : ${col}\ntable: ${table}`);
		conn.query(i_sql, search, (err, user_data) => {
			if (err) {
				throw err;
				callback();
			} else if (user_data) {
				mutate_data = [];
				user_data = user_data[0][col];

				// console.log(`mutate_data (${typeof (user_data)} | ${Array.isArray(JSON.parse(user_data))} ) ${user_data.length}`);

				if (Array.isArray(JSON.parse(user_data))) {
					user_data = JSON.parse(user_data);
					// console.log(`user_data (${typeof(user_data)}) ${user_data}`);
					for (let i = 0; i < user_data.length; i++) {
						const element = JSON.stringify(user_data[i]);
						if (JSON.stringify(element) === JSON.stringify(new_data)) {
							// console.log(`\n_____________ ${(JSON.parse(new_data)).from} _____________\n`)
							user_data.splice(i, 1);
						} else {
							// console.log(`\nelement === JSON.stringify(new_data ? \n\t${JSON.stringify(element)}\n\t${JSON.stringify(new_data)}\n`)
						}
					}
					// (Array.isArray(user_data)) ? mutate_data = user_data : mutate_data.push(user_data);

				} else if (JSON.stringify(user_data) === JSON.stringify(new_data)) {
					user_data = '[]';							//	convert updated array to string
				}
				setTimeout(() => {
					// console.log(`mutate_data (${typeof (user_data)} | ${Array.isArray(user_data)} ) ${user_data.length}`);

					mutate_data = JSON.stringify(user_data);
					let quiry_data = [mutate_data, search];
					let sql = 'UPDATE ' + table + ' SET ' + col + ' = ? WHERE ?';
					conn.query(sql, quiry_data, (err, result) => {
						if (err) {
							// console.log(conn.query(sql, quiry_data));
							// console.log('UPDATE err : : : ', err);
						}
						callback();
					});
				}, 1500);
			}
		});
		// console.log('_____________ update_minus _____________\n\n');
	},


	find_chat : (lookup, uid, cb) => {
		let f_sql = 'SELECT * FROM chats WHERE ? AND ?';
		// console.log('find chat');
		conn.query(f_sql, lookup, (err, res_arr) => {
			// console.log(conn.'query(sql, find_data));
			// console.log(lookup);
			if (err){
				// console.log(conn.query(f_sql, lookup));
				throw err;
			}

			// console.log(`find_chat (${res_arr[0].length}): ${res_arr[0].id}`);
			cb(res_arr);
		});
	},
	db_delete: (op, table, find_data, callback) => {
		// console.log('delete');
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
			// console.log(result);
			// conn.end();
			callback;
		});
	}
};
