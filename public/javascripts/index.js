let lastOpo;
let userList;

let display_user_list = data => {
	let displayArr = [];
	userList = data;
	console.log(data.length);
	if (data.length == 0) {
		displayArr = '<p><br><h5>No match found</h5></p>';
	} else {
				for (let i = 0; i < data.length; i++) {
					const element = data[i];
					
					displayArr.push(
						'<a href="/view_profile/'+element._id+'">' +
							'<div class="users row">' +
								'<div class="left "><img src=' + element.profile_pic + ' alt="Profile Picture" width="150px" height="150px"></div>' +
								'<div class="" style="width: 18rem;">' +
									'<div class="card-body">' +
										'<h5 class="card-title">'+element.usr_user+'</h5>' +
										'<h6 class="card-subtitle mb-2 text-muted">'+element.usr_name+' &nbsp; '+element.usr_surname+'</h6>' +
										'<p class="card-text">' +
											'Bio:' + element.bio +
										'</p>' +
									'</div>' +
								'</div>' +
								'<div class="right ">'+element.rating+'/5</div>' +
							'</div>' +
						'</a>'
					);
				}
	}
	$('#match-list').html(displayArr);
}

//	SORTING FUNCTIONS
let sort_fame = () => {
	console.info('soring fame' + userList);
	if (lastOpo != 'fame') {
		let sortFame = (fame_arr) => {
			console.info('fame_arr');
			console.info(fame_arr);
			for (var i = 0; i < fame_arr.length; i++) {
				if (fame_arr[i + 1] && fame_arr[i].rating > fame_arr[i + 1].rating) {
					let tmp = fame_arr[i];
					fame_arr[i] = fame_arr[i + 1];
					fame_arr[i + 1] = tmp;
				}
			}
			return (fame_arr);
		}
		for (var i = 0; i < userList.length; i++) {
			if (userList[i + 1] && userList[i].rating > userList[i + 1].rating) {
				i = 0;
				userList = sortFame(userList);
			}
		}
		// return (userList);
	}
	lastOpo = 'fame';
	display_user_list(userList.reverse());
}
let sort_age = () => {
	if (lastOpo != 'age') {
		let sortAge = (age_arr) => {
			for (var i = 0; i < age_arr.length; i++) {
				if (age_arr[i + 1] && age_arr[i].age > age_arr[i + 1].age) {
					let tmp = age_arr[i];
					age_arr[i] = age_arr[i + 1];
					age_arr[i + 1] = tmp;
				}
			}
			return (age_arr);
		}
		for (var i = 0; i < userList.length; i++) {
			if (userList[i + 1] && userList[i].age > userList[i + 1].age) {
				i = 0;
				userList = sortAge(userList);
			}
		}
		// return (userList);
	}
	lastOpo = 'age';
	display_user_list(userList.reverse());
}
let sort_tags = (userList, tags) => {
	let sorted = [];
	for (let i = 0; i < tags.length; i++) {
		// iterte through user tag array
		for (let j = 0; j < userList.length; j++) {	// itterate through users
			(!userList[j].score) ? userList[j].score = 0 : 0;
			if (userList[j].intrests.includes(tags[i])) {
				userList[j].score++;	// if user's tags includes tag increase user score
			}
		}
	}
	for (let i = 7; i >= 0; i--) {	// i = max tags
		for (let j = 0; j < userList.length; j++) {
			if (userList[j].score == j) {
				sorted.push(userList[j]);	// push users inso 'sorted' by max score
			}
		}
	}
	return (sorted);
}
let sort_locate = (userList, location) => {
	let sorted = [];
	location = JSON.parse(location);
	for (let i = 0; i < userList.length; i++) {
		const element = userList[i];
		if (element.gps && typeof (element.gps) != 'object') {

			console.log(`${element.usr_user} ${element.gps}`);
			element.gps = JSON.parse(element.gps)
		}
	}
	console.info('locate__', userList.length);
	// userList[0].gps = JSON.parse(userList[0].gps);
	console.log(`${JSON.stringify(location.country)}`);
	console.log(`${JSON.stringify(location.city)}`);
	console.log(`${userList[0].usr_name}: ${((userList[0].gps.country))}`);
	console.log(`${userList[0].usr_name}: ${((userList[0].gps))}`);
	for (let i = 0; i < userList.length; i++) {
		// userList[i].gps = JSON.parse(userList[i].gps); 
		if ((JSON.stringify(userList[i].gps.country) == JSON.stringify(location.country)) && (JSON.stringify(userList[i].gps.city) == JSON.stringify(location.city))) {
			console.log(`\t\t1. ${userList[i].usr_user}`);
			sorted.push(userList[i]);
		}
	}
	for (let i = 0; i < userList.length; i++) {
		if ((JSON.stringify(userList[i].gps.country) == JSON.stringify(location.country)) && (JSON.stringify(userList[i].gps.city) != JSON.stringify(location.city))) {
			console.log(`\t\t2. ${userList[i].usr_user}`);
			sorted.push(userList[i]);
		}
	}
	for (let i = 0; i < userList.length; i++) {
		if ((JSON.stringify(userList[i].gps.country) != JSON.stringify(location.country)) && (JSON.stringify(userList[i].gps.city) != JSON.stringify(location.city))) {
			console.log(`\t\t3. ${userList[i].usr_user}`);
			sorted.push(userList[i]);
		}
	}
	// console.log(`sorting ${sorted}`);
	// return (sorted);
	display_user_list(sorted);
}




$('#advanced').submit(e => {

	e.preventDefault();

	$.ajax({
		type: $('#advanced').attr('method'),
		url: $('#advanced').attr('action'),
		data: $('#advanced').serialize(),
		success: (data) => {
			console.log('Submission was successful.');
			console.log(data);
			if (data) {
				display_user_list(data);
			}
		},
		error: data => {
			console.log('An error occurred.');
			console.log(data);
		},
	});
});

$(document).ready(
	$.ajax({
		type: 'GET',
		url: '/search',
		success: data => {
			display_user_list(data);
		}
	})
);