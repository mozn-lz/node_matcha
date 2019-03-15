var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var page = 'home';
	req.session.email;
	req.session.destroy();
	res.redirect('/login/' + 'pass_sucYou have successfully signed out.')
});

module.exports = router;
