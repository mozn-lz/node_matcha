let width = 500,
	height = 0,
	filter = 'none',
	streaming = false;

const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('photo-button');
const photoFiller = document.getElementById('photo-filler');

var video = document.getElementById('video');

/******************/
/*     OVERLAY    */
/******************/

var none = document.getElementById('none');
var crazy = document.getElementById('crazy');
var catface = document.getElementById('catface');

var overlay = document.getElementById('tmpImg');

none.addEventListener('change', function (e) {
	overlay.src = none.value;
}, false);
crazy.addEventListener('change', function (e) {
	overlay.src = crazy.value;
}, false);
catface.addEventListener('change', function (e) {
	overlay.src = catface.value;
}, false);

var back = document.getElementById('overlay2');
var overlay2 = document.getElementById('tmpImg2');
back.addEventListener('change', function (e) {
	if (back.checked == true) {
		overlay2.style.visibility = "visible";
		overlay2.src = back.value;
		console.log(overlay2.src);
	} else if (back.checked == false) {
		overlay2.style.visibility = "hidden";
		overlay2.src = '';
		console.log(overlay2.src);
	}
}, false);


/************************/
/*      Take Picture    */
/************************/
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: false
})
	.then(function (stream) {
		// Link to video source
		video.srcObject = stream;
		// Play video
		video.play();
	})
	.catch(function (err) {
		console.log(`Error: ${err}`);
	});

// Play when ready 
video.addEventListener('canplay', function (e) {
	if (!streaming) {
		height = video.videoHeight / (video.videoWidth / width);
		video.setAttribute('width', width);
		video.setAttribute('height', height);
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);
		streaming = true;
	}
}, false);
// Photo button Event Listener
photoButton.addEventListener('click', function (e) {
	takePicture();
	e.preventDefault();
}, false);


/*****************************************************************/
/*							Upload image						 */
/*****************************************************************/
var file;
var reader;

function encodeImageFileAsURL(element) {
	file = element.files[0];
	reader = new FileReader();
	reader.onloadend = function () {
		video.style.visibility = "hidden";
		// console.log('RESULT', reader.result);
		var upload = reader.result;
		var uploadImage = document.createElement("img");
		uploadImage.src = reader.result;
		uploadImage.id = "uploadImage";
		uploadImage.width = "350";
		document.getElementById('vid_div').appendChild(uploadImage);
		document.getElementById('imgVidDiv').style.display = "none";

		// var uploadImage		= document.getElementById('uploadImage');
	}
	reader.readAsDataURL(file);
}
/*****************************************************************/


/*****************************************************************/
/*							Take picture						 */
/*****************************************************************/
function takePicture() {
	// Create Canvas
	const context = canvas.getContext('2d');
	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		if (video.style.visibility != "hidden") {
			// Draw image of the video on the canvas
			context.drawImage(video, 0, 0, width, height);
			context.drawImage(overlay, 150, 0, 200, 200);
			context.drawImage(overlay2, 150, 0, 200, 200);

			// Create image from canvas
			const imgUrl = canvas.toDataURL("image/png");
			// Create image element
			//mj
			// console.log(imgUrl);
			const capture = document.createElement('img');
			capture.setAttribute('src', imgUrl);

			var imageObj1 = new Image();
			var imageObj2 = new Image();
			var imageObj3 = new Image();
			imageObj1 = capture;
			imageObj2 = (overlay);
			imageObj3 = (overlay2);
			// console.log("Obj1: " + imageObj1 + '\n');

			imageObj1.onload = function () {
				context.drawImage(imageObj1, 0, 0, width, height);
				imageObj2.onload = function () {
					context.drawImage(imageObj2, 0, 0, width, height);
					imageObj3.onload = function () {
						context.drawImage(imageObj3, 0, 0, width, height);
						var img = context.toDataURL("image/png");
					}
				}
			};
		}
		if (video.style.visibility == "hidden") {
			console.log("1. uploadImage.src: " + uploadImage);
			// Draw image of the video on the canvas
			console.log("uploadImage:> " + uploadImage + "\n");
			console.log("overlay:> " + overlay + "\n");
			context.drawImage(uploadImage, 0, 0, width, height);
			context.drawImage(overlay, 150, 0, 200, 200);
			context.drawImage(overlay2, 150, 0, 200, 200);

			// Create image from canvas
			const imgUrl = canvas.toDataURL("image/png");
			// Create image element

			const capture = document.createElement('img');
			capture.setAttribute('src', imgUrl);

			var imageObj1 = new Image();
			var imageObj2 = new Image();
			var imageObj3 = new Image();
			imageObj1 = capture;
			imageObj2 = (overlay);
			imageObj3 = (overlay2);
			imageObj1.onload = function () {
				context.drawImage(imageObj1, 0, 0, width, height);
				imageObj2.onload = function () {
					context.drawImage(imageObj2, 0, 0, width, height);
					imageObj3.onload = function () {
						context.drawImage(imageObj3, 0, 0, width, height);
						var img = context.toDataURL("image/png");
					};
				};
			};
		}
	}

	var selfiePic = document.getElementById('selfie');
	var modal = document.getElementById('myModal');

	// Get the image and insert it inside the modal - use its "alt" text as a caption
	// var img = document.getElementById('selfie');
	var modalImg = document.getElementById("img01");
	var captionText = document.getElementById("caption");

	selfiePic.addEventListener('load', function () {
		overlay.style.display = "none";
		video.style.display = "none";
		modal.style.display = "block";
		modalImg.src = this.src;
		captionText.innerHTML = this.alt;
	});
	selfiePic = document.getElementById('selfie').src = imageObj1.src;
	document.getElementById('thmb').value = selfiePic;

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		window.location.replace('./take_picture');
		modal.style.display = "none";
	}
}

//	
$('.profile').click(function () {
	console.log("Fuck");
	// console.log('lolol ',this.src);
	$('#profilePic').attr("src", this.src);
	console.log('it works:  ', $('#profilePic').attr("src"));
	if ($('#profilePic').attr('src') == this.src) {
		console.log('it works');
	}
	// console.log(this.src);

	$( "input[name='thmb']").val(this.src);
	console.log('input val= ', $( "input[name='thmb']").val());
});
$('#profilePic').click(() =>{
	alert('Hello world');
	console.log($('#profilePic').src);
	
});