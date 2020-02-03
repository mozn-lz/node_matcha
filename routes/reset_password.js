var express = require('express');
var router = express.Router();

/* GET reset_password listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('reset_password', { page: 'Reset Password' });
});

module.exports = router;
