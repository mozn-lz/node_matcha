let g_find_location = false;
/******************************/
/*     Display messages       */
/******************************/
let get_messages = (tmpUser) => {
	console.info('tmpUser: ', tmpUser, '\n');
	console.log("/view_message_service/" + tmpUser);
	$.ajax({
		type: "GET",
		url: "/view_message_service/" + tmpUser,
		success: (result) => {
			console.log("found messages: ", result);
			let displayArr = []
			for (let i = 0; i < result.message.length; i++) {
				const message_body = result.message[i];
				if (message_body.me) {
					displayArr.push(
						'<div class="message-container">' +
						'<div class="message">' + message_body.message + '</div>' +
						'<div class="about">' +
						'<div class="sender d-inline text-muted"><b>' + message_body.from + '</b> at </div>' +
						'<div class="message_time d-inline text-muted">' + message_body.time + '</div>' +
						'</div>' +
						'</div>')
				} else {
					displayArr.push(
						'<div class="message-container right">' +
						'<div class="message">' + message_body.message + '</div>' +
						'<div class="about">' +
						'<div class="sender d-inline text-muted"><b>' + message_body.from + '</b> at </div>' +
						'<div class="message_time d-inline text-muted">' + message_body.time + '</div>' +
						'</div>' +
						'</div>');
				}
				$('#message-body').html(displayArr);
			}
		}
		// , error: function (e) {
		// 	// console.log("ERROR: ", e);
		// 	console.log('view_message_service error: ', e);
		// }
	});
}
if (window.location.href.includes('http://localhost:3000/view_messages/')) {
	$(document).ready(get_messages(window.location.href.replace('http://localhost:3000/view_messages/', '')));
};

/******************************/
/*    Update Nofifications    */
/******************************/
let ajaxGet = () => {
	$.ajax({
		type: "GET",
		url: "/notify",
		success: function (result) {
			// console.log("Success: ", result.notifications.length);
			(result.gps == 'show') ? g_find_location = true : g_find_location= false;
			if (result.notifications) {
				notificationSize = result.notifications.length;
				// console.info(result.notifications);
				// console.info('URL Includes messages? ', window.location.href.includes('http://localhost:3000/view_messages/'));
				if (window.location.href.includes('http://localhost:3000/view_messages/')) {
					console.info('spooling...');
					for (let i = 0; i < result.notifications.length; i++) {
						console.info(`${result.notifications[i].type}: ${window.location.href.replace('http://localhost:3000/view_messages/', '')}  ${result.notifications[i].from}: ${window.location.href.replace('http://localhost:3000/view_messages/', '') == result.notifications[i].from}`)
						if ((result.notifications[i].type == 'send message') && (window.location.href.replace('http://localhost:3000/view_messages/', '') == result.notifications[i].from)) {
							// console.info('Mesage', result.notifications[i]);
							get_messages(window.location.href.replace('http://localhost:3000/view_messages/', ''));
							// console.info('Mesage', result.notifications[i]);
							// console.info('Mesage', result.chats);
						}
						if (i + 1 == result.notifications.length) {
							console.info('No messages\n');
						}
					}
				}
				if (notificationSize > 0) {
					console.log(notificationSize);
					$('#notificationNumber').html(notificationSize);
				}
			} else {
				console.info('No result.notifications');
			}
			if (result) {
				// console.info(result);
			}

		}
		// ,
		// error: function (e) {
		// 	// console.log("ERROR: ", e);
		// 	console.log('notification error');
		// }
	});
}
let getno = () => {
	http://localhost:3000/forgot_password
	if (!window.location.href.includes('http://localhost:3000/login') &&
		!window.location.href.includes('http://localhost:3000/register') &&
		!window.location.href.includes('http://localhost:3000/forgot_password')
	) {
		setInterval(ajaxGet, 3000);
	}
}
$(document).ready(getno);



/******************************/
/*       user location        */
/******************************/
let send_data = (response) => {
	$.ajax({
		type: "POST",
		url: "/notify",
		data: response,
		success: function (result) {
			// console.log("Success: ", result.notifications.length);
			console.info(result);
		},
		// error: function (e) {
		// 	// console.log("ERROR: ", e);
		// 	console.log('notification error');
		// }
	});
}
function getAddress(latitude, longitude) {
	let key = 'AIzaSyCslBsfbEEI917NgkFvd0WwwCf7T_DJ7as'
	$.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng = ' + latitude + ', ' + longitude + ' & key=' + key)
		.then(function success(response) {
			console.log('User\'s Address Data is ', response);
			send_data(response);
		}
			// ,function fail(status) {
			// 		console.log('Request failed. Returned status of ', status);
			// 	}
		)
}
function ipLookUp() {
	$.ajax('http://ip-api.com/json')
		.then(function success(response) {
			console.log('User\'s Location Data is ', response);
			console.log('User\'s Country ', response.country);
			send_data(response);
			getAddress(response.lat, response.lon);
		}
			// , function fail(data, status) {
			// 	console.log('Request failed.');
			// 	// console.log('Request failed.  Returned status of ', status);
			// }
		);
}
if (g_find_location) {
	for (let i = 0; i < navigator.length; i++) {
		console.log(navigator[i]);
	}
	
	if ("geolocation" in navigator) {
		// check if geolocation is supported/enabled on current browser
		navigator.geolocation.getCurrentPosition(
			function success(position) {
				// for when getting location is a success
				console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);
				getAddress(position.coords.latitude, position.coords.longitude);
			}
			, function error(error_message) {
				// for when getting location results in an error
				// console.error('An error has occured while retrieving location', error_message);
				ipLookUp();
			}
		);
	} else {
		// geolocation is not supported
		// get your location some other way
		console.log('geolocation is not enabled on this browser');
		ipLookUp();
	}
} else {
	ipLookUp();
}
