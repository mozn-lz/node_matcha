var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';	// Database(mongo) url
const dbName = 'matcha';		// Database Name
const page_name = 'View Messages';		// page name

/* GET view_messages listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	res.render('view_messages', { page: 'View Messages' });
});

router.get('/:user', function (req, res, next) {
	let chatId = req.params.user;
	
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var find_user = [];
		const collection = db.collection('users');

		collection.find({'_id': objectId(chatId)}).forEach(function (doc, err) {
			assert.equal(null, err);
			find_user.push(doc);
			console.log('\t\t doc: ' + doc);
			
		}, function () {
			client.close();
			console.log('find_user.length: ', find_user.length);
			if (find_user.length == 1) {
				console.log('if: find_user.length', find_user.length == 1);
				 res.render('view_messages', {
					page: 'View Messages',
					id: chatId,
					chat_data : find_user[0]
				});
			} else {
				console.log("Else " + chatId + " not found");
				// res.redirect('/messages');
				//  (chatId.search('pass_suc') == 0) ? res.render(page_name, {
			}
			console.log('exiting render misfunction');			
		});
	});
});

module.exports = router;
