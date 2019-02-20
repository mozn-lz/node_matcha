var express = require('express');
var router = express.Router();

/* GET verify listing. */
router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
  res.render('verify', { page: 'Verify' });
});

module.exports = router;
