var express = require('express');
var router = express.Router();

/* GET take_picture listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('take_picture', { page: 'Take Picture' });
});

module.exports = router;
