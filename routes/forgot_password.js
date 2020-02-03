var express = require('express');
var router = express.Router();

/* GET forgot_password listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('forgot_password', { page: 'Forgot Password', condition: true });
});

module.exports = router;
