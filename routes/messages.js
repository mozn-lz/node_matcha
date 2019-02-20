var express = require('express');
var router = express.Router();

/* GET messages listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('messages', {
	page: 'Messages',
	messages : [
		{msg: 'Reading'},
		{msg: 'playing music'},
		{msg: 'Social medias'}
	] });
});

module.exports = router;
