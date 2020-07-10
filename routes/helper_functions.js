const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const assert = require('assert');

const helper_index = require('./helper_index'); // Helper functions Mk
const helper_db = require('./helper_db'); // Helper functions Mk

module.exports = {
	fn_getMatches: (req, res, callback) => {

		// console.log('PING ifconfig ');

		var user_matches = [];
		var match_criteria = {};
		let match_criteria2 = {};

		switch (req.session.oriantation) {
			case 'hetrosexual':
				if (req.session.gender == 'male') {
					match_criteria = { gender: "female", exception: "homosexual" };
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
				} else {
					match_criteria = { gender: "male", exception: "homosexual" };
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
				}
				break;
			case 'homosexual':
				if (req.session.gender == 'male') {
					match_criteria = { gender: "male", exception: "hetrosexual" };
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
				} else {
					match_criteria = { gender: "female", exception: "hetrosexual" };
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
				}
				break;
			case 'bisexual':
				if (req.session.gender == 'male') {
					match_criteria = { gender: "male", exception: "hetrosexual" };
					match_criteria2 = { gender: "female", exception: "homosexual" };
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
				} else if (req.session.gender == 'female') {
					match_criteria = { gender: "male", exception: "homosexual" };
					match_criteria2 = { gender: "female", exception: "hetrosexual" };
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender, ", but one thats not ", match_criteria.exception);
					// console.log("A ", req.session.oriantation, " ", req.session.gender, " looking for a ", match_criteria.gender2, ", but one thats not ", match_criteria.exception2);
				}
				break;
			default:
				// console.log('Please make sure your gender and oriantation is specified');
				break;
		};
		// console.log('A ', req.session.oriantation, ' ', req.session.gender);

		helper_db.db_read('users', 1, doc => {
			for (let i = 0; i < doc.length; i++) {
				if (doc[i]._id != req.session.uid) {
					(!doc[i].profile_pic) ? doc[i].profile_pic = "/images/ionicons.designerpack/md-person.svg" : 0;
					if ((match_criteria && doc[i].gender == match_criteria.gender && doc[i].oriantation != match_criteria.exception) &&
						!req.session.blocked.includes(doc[i]._id)) {
						user_matches.push({
								_id: doc[i]._id,
								usr_user: doc[i].usr_user,
								usr_email: doc[i].usr_email,
								usr_name: doc[i].usr_name,
								usr_surname: doc[i].usr_surname,
								profile_pic: doc[i].profile_pic,
								age: doc[i].age,
								rating: doc[i].rating,
								bio: doc[i].bio,
								intrests: doc[i].intrests,
								gps: doc[i].gps
							});
						// console.log("Found a ", doc[i].oriantation, " ", doc[i].gender, " named ", doc[i].usr_user);
					}
					if ((match_criteria2 && doc[i].gender == match_criteria2.gender && doc[i].oriantation != match_criteria2.exception) &&
						!req.session.blocked.includes(doc[i]._id)) {
						user_matches.push({
								_id: doc[i]._id,
								usr_user: doc[i].usr_user,
								usr_email: doc[i].usr_email,
								usr_name: doc[i].usr_name,
								usr_surname: doc[i].usr_surname,
								profile_pic: doc[i].profile_pic,
								age: doc[i].age,
								rating: doc[i].rating,
								bio: doc[i].bio,
								intrests: doc[i].intrests,
								gps: doc[i].gps
							});
							// console.log("2Found a ", doc[i].oriantation, " ", doc[i].gender, " named ", doc[i].usr_user);
					}
					if (req.session.gender == '') {
						user_matches.push({
							_id: doc[i]._id,
							usr_user: doc[i].usr_user,
							usr_email: doc[i].usr_email,
							usr_name: doc[i].usr_name,
							usr_surname: doc[i].usr_surname,
							profile_pic: doc[i].profile_pic,
							age: doc[i].age,
							rating: doc[i].rating,
							bio: doc[i].bio,
							intrests: doc[i].intrests,
							gps: doc[i].gps
						});
						// console.log("\t", doc[i].oriantation, " ", doc[i].gender, " named ", doc[i].usr_user, " Rejected");
					}
				}
			}
			// callback(doc[i][0]);
			setTimeout(() => {
				// console.log('\n\n\t\tfound ' + user_matches.length + '\n\n');
				// console.log(user_matches);

				callback(user_matches);
			}, 1500);
		});

		// collection.find().forEach((doc, err) => {
		// 	assert.equal(null, err);
		// 	if (doc._id != req.session.uid) {
		// 		(!doc.profile_pic) ? doc.profile_pic = "/images/ionicons.designerpack/md-person.svg" : 0;
		// 		if ((match_criteria && doc.gender == match_criteria.gender && doc.oriantation != match_criteria.exception) || (match_criteria2 && doc.gender == match_criteria2.gender && doc.oriantation != match_criteria2.exception)) {
		// 			user_matches.push(doc);
		// 			// console.log("Found a ", doc.oriantation, " ", doc.gender, " named ", doc.usr_user);
		// 		} else {
		// 			// console.log("\t", doc.oriantation, " ", doc.gender, " named ", doc.usr_user, " Rejected");
		// 		}
		// 	}
		// })
	},
	findUserById: (user_id, callback) => {

		// MongoClient.connect(url, function (err, client) {
		// 	assert.equal(null, err);

		// 	var user = [];

		// 	client.db(dbName).collection('users').find({ '_id': (user_id) }).forEach(function (doc, err) {
		// 		assert.equal(null, err);
		// 		user.push(doc);
		// 		// console.log("\nRESULT Name: " + doc.usr_name);
		// 	}, function () {
		// 		client.close();
		// 		// console.log("fn_Helper : db search complete. " + user.length + " matches found\n");
		// 		callback(user[0]);
		// 	});
		// });
	},
	sendMail: (from, to, subject, message, callback) => {
		// let email = 'unathinkomo16@gmail.com';
		// let pass = '0786324448';

		let email = 'thfrstgmlccnt@gmail.com';
		let pass = '!!11QQqq';
		const mailCredentials = {
			user: email,
			pass: pass
		}
		if (from === '') from = email;

		// console.log('___fn_Mail___\nfrom: ', from, '\nto: ', to, '\nsubject:', subject, '\nmessage: ', message);

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: mailCredentials
		});

		// Sending email to recipiant
		var mailOptions = {
			'from': from,
			'to': to,
			'subject': subject,
			'html': message
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				// console.log(error);
			} else {
				// console.log('\t\tEmail sent: ' + info.response);
			}
		});
		//	end email
		callback();
	},

	//	START SORTING FUNCTIONS
	sort_fame: (toSort) => {
		let sortFame = (fame_arr) => {
			for (var i = 0; i < fame_arr.length; i++) {
				if (fame_arr[i + 1].fame && fame_arr[i].fame > fame_arr[i + 1].fame) {
					let tmp = fame_arr[i];
					fame_arr[i] = fame_arr[i = 1];
					fame_arr[i + 1] = tmp;
				}
			}
			return (fame_arr);
		}
		for (var i = 0; i < toSort.length; i++) {
			if (toSort[i + 1] && toSort[i] > toSort[i + 1]) {
				i = 0;
				toSort = sortFame(toSort);
			}
		}
		return (toSort);
	},
	sort_age: (toSort) => {
		let sortAge = (age_arr) => {
			for (var i = 0; i < age_arr.length; i++) {
				if (age_arr[i + 1] && age_arr[i] > age_arr[i + 1]) {
					let tmp = age_arr[i];
					age_arr[i] = age_arr[i = 1];
					age_arr[i + 1] = tmp;
				}
			}
			return (age_arr);
		}
		for (var i = 0; i < toSort.length; i++) {
			if (toSort[i + 1] && toSort[i] > toSort[i + 1]) {
				i = 0;
				toSort = sortAge(toSort);
			}
		}
		return (toSort);
	},
	sort_tags: (matches, tags) => {
		let sorted = [];
		for (let i = 0; i < tags.length; i++) {
			// iterte through user tag array
			for (let j = 0; j < matches.length; j++) {	// itterate through users
				(!matches[j].score) ? matches[j].score = 0 : 0;
				if (matches[j].intrests.includes(tags[i])) {
					matches[j].score++;	// if user's tags includes tag increase user score
				}
			}
		}
		for (let i = 7; i >= 0; i--) {	// i = max tags
			for (let j = 0; j < matches.length; j++) {
				if (matches[j].score == j) {
					sorted.push(matches[j]);	// push users inso 'sorted' by max score
				}
			}
		}
		return (sorted);
	},
	sort_locate: (matches, location) => {
		let sorted = [];
		(location) ? location = JSON.parse(location) : 0;
		for (let i = 0; i < matches.length; i++) {
			const element = matches[i];
			if (element.gps && typeof (element.gps) != 'object') {

				// console.log(`${element.usr_user} ${element.gps}`);
				element.gps = JSON.parse(element.gps)
			}
		}
		// console.info('locate__', matches.length);
		// // matches[0].gps = JSON.parse(matches[0].gps);
		// console.log(`${JSON.stringify(location.country)}`);
		// console.log(`${JSON.stringify(location.city)}`);
		// console.log(`${matches[0].usr_name}: ${((matches[0].gps.country))}`);
		// console.log(`${matches[0].usr_name}: ${((matches[0].gps))}`);
		for (let i = 0; i < matches.length; i++) {
			// matches[i].gps = JSON.parse(matches[i].gps); 
			if ((JSON.stringify(matches[i].gps.country) == JSON.stringify(location.country)) && (JSON.stringify(matches[i].gps.city) == JSON.stringify(location.city))) {
				// console.log(`\t\t1. ${matches[i].usr_user}`);
				sorted.push(matches[i]);
			}
		}
		for (let i = 0; i < matches.length; i++) {
			if ((JSON.stringify(matches[i].gps.country) == JSON.stringify(location.country)) && (JSON.stringify(matches[i].gps.city) != JSON.stringify(location.city))) {
				// console.log(`\t\t2. ${matches[i].usr_user}`);
				sorted.push(matches[i]);
			}
		}
		for (let i = 0; i < matches.length; i++) {
			if ((JSON.stringify(matches[i].gps.country) != JSON.stringify(location.country)) && (JSON.stringify(matches[i].gps.city) != JSON.stringify(location.city))) {
				// console.log(`\t\t3. ${matches[i].usr_user}`);
				sorted.push(matches[i]);
			}
		}
		// console.log(`sorting ${sorted}`);
		return (sorted);
	},
	//	END SORTING FUNCTIONS

	//	START FILTERING FUNCTIONS
	filter_fame: (filter_arr, begin, end) => {
		let result = [];
		begin = Number(begin);
		end = Number(end);
		// console.log('begin: ' + begin);
		// console.log('range: ' + end);
		for (let i = 0; i < filter_arr.length; i++) {
			if ((filter_arr[i].rating <= (end)) &&
				(filter_arr[i].rating >= (begin))) {
				// console.log(`A: ${filter_arr[i].usr_name} : ${filter_arr[i].rating}`);
				result.push(filter_arr[i]);
			} else {
				// console.log(`R: ${filter_arr[i].usr_name} : ${filter_arr[i].rating}`);
			}
		}
		return (result);
	},
	filter_age: (age_arr, begin, end) => {
		// console.log("\n\n______filter_age______");
		let result = [];
		begin = Number(begin);
		end = Number(end);
		// console.log("age_arr.length:", age_arr.length);
		for (var i = 0; i < age_arr.length; i++) {
			if ((age_arr[i].age <= (end)) &&
				(age_arr[i].age >= (begin))) {
				// console.log(`A: ${age_arr[i].usr_name} : ${age_arr[i].age}`);
				result.push(age_arr[i]);
			} else {
				// console.log(`R: ${age_arr[i].usr_name} : ${age_arr[i].age}`);
			}
		}
		return (result);
	},
	filter_tags: (matches, tags) => {
		// console.log('\n\n_____filter_tags_____');
		let result = [];

		(typeof (tags) == "string") ? tags = [tags] : 0;	//	convert string to object

		for (let i = 0; i < tags.length; i++) {
			for (let j = 0; j < matches.length; j++) {
				(!matches[j].score) ? matches[j].score = 0 : 0;
				(typeof(matches[j].intrests) == 'string') ? matches[j].intrests = JSON.parse(matches[j].intrests) : 0;
				for (const tag in matches[j].intrests) {
					if (matches[j].intrests[tag] == (tags[i])) {
						matches[j].score++;
						// console.log(i, `> ${matches[j].usr_user} : ${matches[j].score}`);
					}
				}
			}
		}
		for (let i = 7; i > 0; i--) {
			for (let j = 0; j < matches.length; j++) {
				if (matches[j].score == i) {
					result.push(matches[j]);
				}
			}
			if (result.length > 0) {
				return (result);
			}
		}
		return (result);
	},
	filter_locate: (matches, location) => {
		// console.log('filtering location');
		let result = [];

		// location = JSON.parse(location);
		for (let i = 0; i < matches.length; i++) {
			const element = matches[i];
			if (element.gps && typeof (element.gps) != 'object') {
				// console.log(`${element.usr_user} ${element.gps}`);
				element.gps = JSON.parse(element.gps)
			}
		}
		for (let i = 0; i < matches.length; i++) {
			if (matches[i].gps.country && matches[i].gps.city) {
				if ((matches[i].gps.country.toLowerCase() == location.toLowerCase()) || (matches[i].gps.city.toLowerCase() == location.toLowerCase())) {
					result.push(matches[i]);
				}
			}
		}
		return (result);
	},
	filer_name: (search_arr, name) => {
		let filter_arr = [];
		// console.log('\n\t\tfiltering for age\n');
		for (let i = 0; i < search_arr.length; i++) {
			const el = search_arr[i];
			if (el.usr_user.toLowerCase() == name.toLowerCase() || el.usr_name.toLowerCase() == name.toLowerCase() || el.usr_surname.toLowerCase() == name.toLowerCase()) {
				filter_arr.push(el);
				// console.log(`\n\tmatch ${el.usr_name}\n`);
			}
		}
		// setTimeout(() => {
		// console.log(`returning ${filter_arr.length}`);
		// console.log(filter_arr);
		return (filter_arr);
		// }, 500);
	},
	//	END FILTERING FUNCTIONS
	send_notifications: (find, notification, cb) => {
		helper_db.update_plus('users', find, '$addToSet', 'notifications', notification, () => {
			cb;
		});

	},
	is_blocked: (id) => {
		helper_db.db_read('users', { '_id': id }, user => {
			if (user.blocked && user.blocked.includes(req.session.uid)) {
				return (true);
			} else {
				return (false);
			}
		});
	},
	calc_fame: (uid) => {
		// console.log(`1********** fame rating **********`);
		helper_db.db_read('users', { '_id': uid }, user => {
			let rating = 0;
			// let get_fame = (na, cb) => {
			let score = 0;
			// console.log(`\nuser ${user[0].usr_user}\n`);
			let friends = JSON.parse(user[0].friends)
			// console.log('_______________friends');
			setTimeout(() => {
				if (friends && friends.length > 0) {
					// console.log(`\nfrends ${friends.length}\n`);
					for (let i = 0; i < friends.length; i++) {
						helper_db.find_chat([{ 'user_id': uid }, { 'partner': friends[i] }], uid, conversation => {
							// console.log(conversation);
							// console.log(conversation[0].message);
							if (conversation[0] && conversation[0].message) {
								let chat = JSON.parse(conversation[0].message);
								let j = 0;
								// console.log(chat);
								while (j < chat.length) {
									j++;
								}
								if (chat[j - 1].time >= (Date.now() - 1000 * 60 * 3600 * 24 * 7)) {
									score++;
									// console.log('chat time' + chat[j - 1].time);
									// console.log('date  now' + Date.now() - 1000 * 60 * 3600 * 24 * 7);
								} else {
									// console.log('chat time' + chat[j - 1].time);
									// console.log('date  now' + Date.now() - 1000 * 60 * 3600 * 24 * 7);
								}
							}
						});
						// console.log(`${i}\n`);
						// console.log('score ' + score);
					}
				} else {
					// console.log(`@ No Friends \tfame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
					rating = 0;
				}

				// cb(score);
			}, 500);
			// }
			// get_fame('uid', (score) => {
			setTimeout(() => {
				// console.log('_______________ callback')
				rating = (score / friends.length) * 5;
				// console.log(`cb rating `, score / friends.length * 5);
				if (rating == 0) {
					rating = 1;
					// console.log(`0fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				} else if (rating > 0 && rating <= 1) {
					rating = 1;
					// console.log(`1fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				} else if (rating > 1 && rating <= 2) {
					rating = 2;
					// console.log(`2fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				} else if (rating > 2 && rating <= 3) {
					rating = 3;
					// console.log(`3fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				} else if (rating > 3 && rating <= 4) {
					rating = 4;
					// console.log(`4fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				} else if (rating > 4 && rating <= 5) {
					rating = 5;
					// console.log(`5fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				} else {
					rating = 3;
					// console.log(`@ Else \tfame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				}
				helper_db.db_update('users', { '_id': uid }, { rating }, () => {
					// console.log(`L fame is = ${rating}\tscore is ${score}\t friendslen = ${friends.length}`);
				});
			}, 1000);
			// });
		});
	},
	data_exists: (data) => {
		if (data && data != undefined && data != null) {
			return true;
		} else {
			return false;
		}
	},
	complete_profile: (id, cb) => {
		helper_db.db_read('users', { '_id': id }, (user) => {
			// console.log('user retirn');
			if ((user[0].usr_user && user[0].usr_user != undefined && user[0].usr_user != null) &&
				(user[0].usr_email && user[0].usr_email != undefined && user[0].usr_email != null) &&
				(user[0].usr_name && user[0].usr_name != undefined && user[0].usr_name != null) &&
				(user[0].usr_surname && user[0].usr_surname != undefined && user[0].usr_surname != null) &&
				(user[0].age && user[0].age != undefined && user[0].age != null) &&
				(user[0].intrests && user[0].intrests != undefined && user[0].intrests != null) &&
				(user[0].bio && user[0].bio != undefined && user[0].bio != null)) {
				// console.log('___________ret true');
				cb(true);
			} else {
				// console.log('___________ret false');
				cb(false);
			}
		});
	}
	,
	hash_pass: (pass, cb) => {
		bcrypt.genSalt(saltRounds, (err, salt) => {
			bcrypt.hash(pass, salt, (err, hash) => {
				// Store hash in your password DB.
				// console.log('\n\nhash: ' + hash);
				cb(hash);
			});
		});
	},
	check_pass: (login_pass, passwd, cb) => {
		bcrypt.compare(login_pass, passwd, (err, result) => {
			// console.log('\n\ncheck pass: ' + result);
			cb(result);
		});
	}
};