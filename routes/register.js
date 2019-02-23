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
	if (!is_empty(req.body.username)){
		var user	= req.body.username;
	} else {
		error_log[i++] = ' is invalid';
	}

	if (!is_empty(req.body.email)){
		var email	= req.body.email;
	} else {
		error_log[i++] = ' is invalid';
	}

	if (!is_empty(req.body.name)){
		var name	= req.body.name;
	} else {
		error_log[i++] = ' is invalid';
	}

	if (!is_empty(req.body.surname)){
		var surname	= req.body.surname;
	} else {
		error_log[i++] = ' is invalid';
	}

	if (!is_empty(req.body.psswd)){
		var psswd	= req.body.psswd;
	} else {
		error_log[i++] = ' is invalid';
	}

	if (!is_empty(req.body.psswd1)){
		var psswd1	= req.body.psswd1;
	} else {
		error_log[i++] = ' is invalid';
	}

	/* checks if there are any errors in saving variables from the user
	 and if passwords match	*/
	if (i == -1 && is_match(psswd, psswd1)) {
		// store data to JSON array, to store in mongo
		var usr_data = {
			usr_user : user,
			usr_email : email,
			usr_name : name,
			usr_surname : surname,
			usr_psswd : psswd,		// to be encrypted
			login_time : '',
			pic : [],
			gender : '',
			oriantation : '',
			rating : '',
			bio : '',
			intrests : [],
			gps : '',
			viewd : [],
			liked : [],
			verified : 0,
			confirm_code : Math.random()	// to be encrypted
		};
	
		// Connect and save data to mongodb
		MongoClient.connect(url, function(err, client) {
			assert.equal(null, err);
			console.log("Connected to server and mongo connected Successfully");
			const db = client.db(dbName);
	
			const collection = db.collection('users');
	
			collection.insertOne(usr_data, function(err, result) {
				assert.equal(null, err);
				console.log("Documents added to database: " + dbName);
				client.close();
				 res.redirect('/login/' + user);
			});
		});
	} else {
		// if passwords don't match or there are errors in the code
		error_log[i++] = 'Password error';
	}
	
	console.log('username: '	+ user + "\n");
	console.log('email: '	+ email + "\n");
	console.log('name: '	+ name + "\n");
	console.log('surname: ' + surname + "\n");
	console.log('psswd: '	+ psswd + "\n");
	console.log('psswd1: '	+ psswd1 + "\n");

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
