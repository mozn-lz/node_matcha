var express = require('express');
var router = express.Router();

/* GET messages listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('messages', {
		page: 'Messages',
		"Messages": [{
				"usr0": "Reading",
				"usr1": "usr1_msg",
				"usr0": "usr0_msg",
				"usr1": "usr1_msg"
			},
			{
				"usr0": "Playing",
				"usr1": "usr1_msg",
				"usr0": "usr0_msg",
				"usr1": "usr1_msg"
			},
			{
				"usr0": "Socialg",
				"usr1": "usr1_msg",
				"usr0": "usr0_msg",
				"usr1": "usr1_msg"
			}
		]
	});
});

module.exports = router;