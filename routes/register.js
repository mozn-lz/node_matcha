var express	= require('express');
var router	= express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url	= 'mongodb://localhost:27017';

// Database Name
const dbName = 'matcha';

/* GET register listing. */
router.get('/', function(req, res, next) {
  res.render('register', { page: 'Register' });
});

router.post('/', function(req, res, next) {
	var user	= req.body.username;
	var email	= req.body.email;
	var name	= req.body.name;
	var surname	= req.body.surname;
	var psswd	= req.body.psswd;
	var psswd1	= req.body.psswd1;

	console.log('username: '	+ user + "\n");
	console.log('email: '	+ email + "\n");
	console.log('name: '	+ name + "\n");
	console.log('surname: ' + surname + "\n");
	console.log('psswd: '	+ psswd + "\n");
	console.log('psswd1: '	+ psswd1 + "\n");

	var usr_data = {
		usr_id : '',
		usr_user : user,
		usr_email : email,
		usr_name : name,
		usr_surname : surname,
		usr_psswd : psswd,
		login_time : '',
		pic : [],
		gender : '',
		oriantation : '',
		rating : '',
		bio : '',
		intrests : [],
		gps : '',
		viewd : [],
		liked : []
	};

	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		console.log("Connected to server and mongo connected Successfully");
		const db = client.db(dbName);

		const collection = db.collection('users');

		collection.insertOne(usr_data, function(err, result) {
			assert.equal(null, err);
			console.log("Documents added to database: " + dbName);
			client.close();
		});
	});
	// mongo.connect(url, function(err, db) {
	// 	assert.equal(null, err);
	// 	db.collection('users').insertOne(usr_data, function(err, result) {
	// 		assert.equal(null, err);
	// 		console.log('entry added');
	// 		db.close();			
	// 	});
	// });

});   

module.exports = router;
