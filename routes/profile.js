var express = require('express');
var router = express.Router();

/* GET profile listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('profile', {
		title: 'Profile',
		fname: 'fname',
		lanme: 'lanme',
		age: 20,
		email: 'name@domain.post',
		gender: 'gender:m/f',
		orintion: 'orinttion',
		bio: 'User baisic and generic bio'
	});
});

module.exports = router;