var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/index');
	// res.render('users', { title: 'Profile' });
});

module.exports = router;
//  https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/