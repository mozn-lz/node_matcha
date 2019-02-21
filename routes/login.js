var express = require('express');
var router = express.Router();

/* GET login listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('login', { page: 'Login' });
});
router.get('/:user', function(req, res, next) {
	res.render('login', {username: req.params.user});
});


module.exports = router;
