var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'mk_matcha';
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
				// console.log(doc);
			}, () => {
				if (result.length == 1) {
					client.close();
					// console.log(result[0].picture);

					res.render('take_picture', {
						page: page_name,
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
		MongoClient.connect(url, (err, client) => {
			const db = client.db(dbName);
			assert.equal(null, err);
			console.log('\n\t\t3\n');
			const collection = db.collection('users');

			let userObj = [];
			let picNum = 0;
			collection.find({ '_id': objectId(req.session.uid) }).forEach((doc, err) => {
				userObj.push(doc);
			}, () => {
				(userObj[0].picture) ? picNum = userObj[0].picture.length : 0;
				// setTimeout(() => {
					if (req.body.save == 'save') {
						console.log('picNum: ', picNum);
						
						if (picNum < 5) {
							console.log('\n\t\t4. Saving new picture\n');
							collection.updateOne({ '_id': objectId(req.session.uid) }, {
								$addToSet: { 'picture': pic }
							}, () => {
								assert.equal(null, err);
								client.close();
								console.log('redirecting to profile page');
								res.redirect('/take_picture');
							});
						} else {
							console.log('Too many pictures');
							res.redirect('/take_picture');
						}
					} else if (req.body.change == 'change') {
						if (pic) {
							console.log('\n\t\t4. Changing profile picture\n');
							collection.updateOne({
								'_id': objectId(req.session.uid)
							}, {
								$set: { 'profile': pic }
							}, () => {
								assert.equal(null, err);
								client.close();
								res.redirect('/take_picture');
								// res.redirect('/profile');
							});
						} else {
							console.log('\t\tNo picture\n');
							res.redirect('/take_picture');
						}
					} else if (req.body.delete == 'delete') {
						console.log('\n\t\t4. Deleting Picture\n');
						collection.updateOne({
							'_id': objectId(req.session.uid)
						}, {
							$pull:
								{ 'picture': pic }
						}, () => {
							assert.equal(null, err);
							client.close();
							res.redirect('/take_picture');
							// res.redirect('/profile');
						});
					} else if (req.body.cancel == 'cancel') {
						console.log('\n\t\t5\n');
						res.redirect('/take_picture');
					}
				// }, 1000);
			});

		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
