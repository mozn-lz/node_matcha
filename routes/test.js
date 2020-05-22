var express = require('express');
var router = express.Router();
const helper = require('./helper_functions');

router.get('/', (req, res, next) => {
	console.log('\n\n');
	// res.redirect('/index');
	// res.render('users', { title: 'Profile' });
	res.render('test')
});

router.post('/', (req, res) => {
	let from = '';
	let email = req.body.email;
	let subject  = req.body.subject;
	let message = req.body.message;
	
	console.log('from: ', from);
	console.log('email: ', email);
	console.log('subject: ', subject);
	console.log('message: ', message);
	console.log('\n\n');

	helper.sendMail(from, email, subject, message, () => res.redirect('test'));
});
module.exports = router;
//  https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/