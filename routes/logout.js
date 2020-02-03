var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var page = 'home';
	req.session.uid
	req.session.destroy();
	res.redirect('/login/' + 'pass_sucYou have successfully signed out.')
});

// handling Error or success messages. 
router.get('/:user', function (req, res, next) {
	(req.params.user.search('pass_err') == 0) ? res.render(page_name, {
		error_list: (req.params.user).slice(8)
	}): 0;
	(req.params.user.search('pass_suc') == 0) ? res.render(page_name, {
		username: (req.params.user).slice(8)
	}): 0;
	res.render(page_name, {
		username: req.params.user
	});
});


module.exports = router;
