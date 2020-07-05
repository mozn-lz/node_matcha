const express = require('express');
const router = express.Router();

var helper = require('./helper_functions'); // Helper functions Mk
var helper_db = require('./helper_db'); // Helper functions Mk

const multer = require('multer');
const path = require('path');

let page_name = 'take picture';

const storage = multer.diskStorage({
	destination: 'uploads',
	filename: (req, file, cb) => {
		cb(null, '/' + file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 10000000 },
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	}
}).single('uploaded_file');

let checkFileType = (file, cb) => {
	const fileTypes = /jpeg|jpg|png|gif/;
	const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
	const mimetype = fileTypes.test(file.mimetype)

	if (extname && mimetype) {
		return (cb(null, true))
	} else {
		cb(`Error: fle was not of type 'jpeg','jpg','png' or 'gif'`);
	}
}

router.post('/', (req, res, next) => {


	console.log('\n\t\t1\n');

	if (req.session.uid) {
		console.log('\n\t\t2\n');
		console.log('req.body.save: ', req.body.save);
		console.log('req.body.change: ', req.body.change);
		console.log('req.body.delete: ', req.body.delete);
		console.log('req.body.cancel: ', req.body.cancel);
		console.log('req.file = ', req.file, req.file == true);
		console.log(req.body);

		console.log('\n\t\t3\n');


		if (req.body.change == 'change') {
			if (req.body.thumb) {
				// 	console.log('\t\tpic: ', req.body.profilePic)
				// 	console.log('\n\t\t4. Changing profile picture\n');
				helper_db.db_update('users', { '_id': (req.session.uid) }, { 'profile_pic': req.body.thumb }, () => {
					res.redirect('/take_picture');
					// res.redirect('/profile');
				});
			} else {
				console.log('\t\tNo picture\n');
				res.redirect('/take_picture');
			}
		} else if (req.body.delete == 'delete') {
			console.log('\n\t\t4. Deleting Picture\n');
			helper_db.update_minus('users', { '_id': (req.session.uid) }, '$pull', 'picture', { pic: req.body.thumb }, () => {
				// helper_db.db_update('users', { '_id': (req.session.uid) }, { $pull: { 'pictre': pic } }, () => {
				res.redirect('/take_picture');
				// res.redirect('/profile');
			});
		} else {
			upload(req, res, (err) => {
				if (err) {
					console.log('uploaded_file = ', req.file, '\n')
					res.redirect('/take_picture');
					// res.render('take_picture', { msg: err });
				} else {
					console.log(`getting user for ${req.session.uid}`);
					helper_db.db_read('users', { '_id': req.session.uid }, user => {
						let picNum = 0;
						// console.log('pic: ', user[0].picture);
						(user[0].picture) ? picNum = (JSON.parse(user[0].picture)).length : 0;
						console.log(`\n\n\n\t\t${typeof(user[0].picture)}\n`);
						user[0].picture = JSON.parse(user[0].picture);
						console.log(`\n\t\t${typeof(user[0].picture)} ${user[0].picture.length
						}\n\n\n`);
						if ((picNum) < 5) {
							helper_db.update_plus('users', { '_id': req.session.uid }, '$addToSet', 'picture', { 'pic': req.file.filename }, () => {
								console.log('pic uploades');
								console.log('uploaded_file = ', req.file, '\n')
								// res.render('take_picture', { msg: 'upload succssfil' });
								res.redirect('/take_picture');
							});
						} else {
							console.log('Too many pictures');
							res.redirect('/take_picture');
						}
						// } 
						// }, 1000);
			
					});
				}
			});
		}
	} else {
		res.redirect('/login');
	}
});

/* GET take_picture listing. */
router.get('/', function (req, res, next) {
	//   res.send('respond with a resource');
	let result = [];

	if (req.session.uid) {
		helper_db.db_read('users', { '_id': (req.session.uid) }, result => {
			if (result.length == 1) {

				// console.log(result[0].picture);
				// console.log(`result[0].picture(${typeof (result[0].picture)}  | ${Array.isArray(result[0].picture)} ): 	${result[0].picture}`);

				res.render('take_picture', {
					page: page_name,
					pic: result[0].picture,
					pics: JSON.parse(result[0].picture),
					profile_pic: result[0].profile_pic
				});
			}
		});
	} else {
		res.redirect('/login/pass_errYou have to be logged in to take or upload pictures');
	}
});

module.exports = router;
