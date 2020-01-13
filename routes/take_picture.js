var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'matcha';

let page_name = 'take picture';

/* GET take_picture listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	let result = [];

	if (req.session.uid) {
		MongoClient.connect(url, (err, client) => {

			const db = client.db(dbName);
			const collection = db.collection('users');
			assert.equal(null, err);
			collection.find({ '_id': objectId(req.session.uid) }).forEach((doc, err) => {
				assert.equal(null, err);
				result.push(doc);
			}, () => {
				if (result.length == 1) {
					(!result[0].profile) ? result[0].profile = 'https://www.billboard.com/files/styles/article_main_image/public/media/Oasis-press-photo-credit-Jill-Furmanovsky-2016-billboard-1548.jpg' : 0;
					client.close();
					res.render('take_picture', {
						page: 'Take Picture',
						pic: result[0].picture,
						profile: result[0].profile
					});
				}
			});
		});
	} else {
		res.redirect('/login/pass_errYou have to be logged in to take or upload pictures');
	}
});

router.post('/', (req, res, next) => {
	let pic = req.body.thmb;

	console.log('Post>pic ', pic);

	if (req.session.uid) {
		console.log('req.body.save: ', req.body.save);
		console.log('req.body.change: ', req.body.change);
		console.log('req.body.delete: ', req.body.delete);
		console.log('req.body.cancel: ', req.body.cancel);
		MongoClient.connect(url, (err, client) => {
			const db = client.db(dbName);
			assert.equal(null, err);
			const collection = db.collection('users');
			if (req.body.save == 'save') {
				collection.update({
					'_id': objectId(req.session.uid)
				}, {
					$push:
						{ 'picture': pic }
				}, () => {
					assert.equal(null, err);
					client.close();
					console.log('redirecting to profile page');
					res.redirect('/profile');
					// res.redirect('/take_picture');
				});
			} else if (req.body.change == 'change') {
				collection.update({
					'_id': objectId(req.session.uid)
				}, {
					'profile': pic
				}, () => {
					assert.equal(null, err);
					client.close();
					res.redirect('/profile');
					// res.redirect('/take_picture');
				});
			} else if (req.body.delete == 'delete') {
				collection.update,({
					'_id': objectId(req.session.uid)
				}, {
					$pull:
						{ 'picture': pic }
				}, () => {
					assert.equal(null, err);
					client.close();
					res.redirect('/profile');
					// res.redirect('/take_picture');
				});
			} else if (req.body.cancel == 'cancel') {
				res.redirect('/take_picture');
			}
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
