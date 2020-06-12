const express = require('express');
const router = express.Router();

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

let page_name = 'take picture';

/* GET take_picture listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	let result = [];

	if (req.session.uid) {
		helper_db.db_read('sql', 'users', { '_id': (req.session.uid) }, result => {
			if (result.length == 1) {
				// console.log(result[0].picture);

				res.render('take_picture', {
					page: page_name,
					pic: result[0].picture,
					profile: result[0].profile
				});
			}
		});
	} else {
		res.redirect('/login/pass_errYou have to be logged in to take or upload pictures');
	}
});

router.post('/', upload.single('profilePciture'), (req, res, next) => {
	let pic = req.body.thmb;

	if (pic) {
		console.log('Pic Present\n');
		// console.log('Pic Present, ', pic);
	}
	console.log('\n\t\t1\n');

	if (req.session.uid) {
		console.log('\n\t\t2\n');
		console.log('req.body.save: ', req.body.save);
		console.log('req.body.change: ', req.body.change);
		console.log('req.body.delete: ', req.body.delete);
		console.log('req.body.cancel: ', req.body.cancel);
		console.log('\n\t\t3\n');

		let picNum = 0;
		helper_db.db_read('sql', 'users', { '_id': (req.session.uid) }, user => {
			(user[0].picture) ? picNum = user[0].picture.length : 0;
			// setTimeout(() => {
			if (req.body.save == 'save') {
				console.log('picNum: ', picNum);

				if (picNum < 5) {
					console.log('\n\t\t4. Saving new picture\n');
					helper_db.db_update('sql', 'users', { '_id': (req.session.uid) }, { $addToSet: { 'picture': pic } }, () => {
						console.log('redirecting to profile page');
						res.redirect('/take_picture');
					});
				} else {
					console.log('Too many pictures');
					res.redirect('/take_picture');
				}
			} else if (req.body.change == 'change') {
				if (pic.length > 20) {
					console.log('\t\tpic: ', pic)
					console.log('\n\t\t4. Changing profile picture\n');
					helper_db.db_update('sql', 'users', { '_id': (req.session.uid) }, { $set: { 'profile': pic } }, () => {
						res.redirect('/take_picture');
						// res.redirect('/profile');
					});
				} else {
					console.log('\t\tNo picture\n');
					res.redirect('/take_picture');
				}
			} else if (req.body.delete == 'delete') {
				console.log('\n\t\t4. Deleting Picture\n');
				helper_db.db_update('sql', 'users', { '_id': (req.session.uid) }, { $pull: { 'picture': pic } }, () => {
					res.redirect('/take_picture');
					// res.redirect('/profile');
				});
			} else if (req.body.cancel == 'cancel') {
				console.log('\n\t\t5\n');
				res.redirect('/take_picture');
			}
			// }, 1000);

		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
