var express = require('express');
var router = express.Router();

/* GET forgot_password listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('forgot_password', { page: 'Forgot Password' });
});

router.post('/', function (req, res, next) {
	//   res.send('respond with a resource');
	MongoClient.connect(url, (error, client) => {
		db.client.collection('users').find({usr_email: res.body.email}).forEach((err, doc) => {
			user.push(doc);
		}, () => {
			user[0].usr_email;	// to email
			user[0].usr_user;	//	to name
			user[0].usr_code = Math.random();	//	verification email
		});
	});

	res.render('forgot_password', { page: 'Forgot Password' });
});

module.exports = router;
