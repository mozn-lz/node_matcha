var express = require('express');
var router = express.Router();

/* GET view_messages listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('view_messages', { page: 'View Messages' });
});

module.exports = router;
