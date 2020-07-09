const mysql = require('mysql2');

const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	port: 3306,
	password: 'admin',
	database: 'mk_matcha'
});


let db_name = 'matcha';
let chat_table = 'chats';
let users_table = 'users';

// -- Database: `matcha`

let dbq = 'CREATE DATABASE IF NOT EXISTS ' + db_name + ' DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci';
conn.query(dbq, (err, result) => { if (err) throw err; });

// -- Table structure for table chat_table

let dropChatTableq = 'DROP TABLE IF EXISTS ' + db_name + '.' + chat_table;
let createChatTable = 'CREATE TABLE IF NOT EXISTS ' + db_name + '.' + chat_table +
	` (  id int(100) NOT NULL,  user_id int(6) NOT NULL,  partner int(6) NOT NULL,  message text NOT NULL)`;
conn.query(dropChatTableq, (err, result) => { if (err) throw err; });
conn.query(createChatTable, (err, result) => { if (err) throw err; });

// Table structure for table users_table
let dropUsersTable = 'DROP TABLE IF EXISTS ' + db_name + '.' + users_table;
let createUsersTable = 'CREATE TABLE IF NOT EXISTS ' + db_name + '.' + users_table +
	` (_id int(6) NOT NULL, 
	usr_user varchar(30) NOT NULL, 
	usr_email varchar(50) NOT NULL, 
	usr_name varchar(30) NOT NULL, 
	usr_surname varchar(30) NOT NULL, 
	usr_psswd varchar(255) NOT NULL, 
	login_time varchar(50) NOT NULL, 
	profile_pic varchar(255) NOT NULL DEFAULT '/images/ionicons.designerpack/md-person.svg', 
	age int(3) NOT NULL, 
	gender varchar(10) NOT NULL, 
	oriantation varchar(20) NOT NULL, 
	rating int(1) NOT NULL, 
	bio varchar(255) NOT NULL, 
	gps_switch varchar(4) NOT NULL, 
	gps varchar(255) NOT NULL, 
	verified int(1) NOT NULL, 
	confirm_code varchar(255) NOT NULL, 
	intrests varchar(255) NOT NULL, 
	blocked varchar(255) DEFAULT '[]', 
	friends text DEFAULT '[]', 
	notifications text DEFAULT '[]', 
	picture text DEFAULT '[]', 
	history text DEFAULT '[]')`;

conn.query(dropUsersTable, (err, result) => { if (err) throw err; });
conn.query(createUsersTable, (err, result) => { if (err) throw err; });

// -- Indexes for dumped tables

// -- Indexes for table + chat_table
let chatPK = 'ALTER TABLE ' + db_name + '.' + chat_table + ' ADD PRIMARY KEY (`id`)';
conn.query(chatPK, (err, result) => { if (err) throw err; });
// -- Indexes for table users_table
let usersPK = 'ALTER TABLE ' + db_name + '.' + users_table + ' ADD PRIMARY KEY (`_id`)';
conn.query(usersPK, (err, result) => { if (err) throw err; });


// -- AUTO_INCREMENT for dumped tables

// -- AUTO_INCREMENT for table chat_table
let chatAI = 'ALTER TABLE ' + db_name + '.' + chat_table + ' MODIFY `id` int(100) NOT NULL AUTO_INCREMENT';
conn.query(chatAI, (err, result) => { if (err) throw err; });
// -- AUTO_INCREMENT for table users_table
let usersAI = 'ALTER TABLE ' + db_name + '.' + users_table + ' MODIFY `_id` int(6) NOT NULL AUTO_INCREMENT';
conn.query(usersAI, (err, result) => { if (err) throw err; });


