let show = document.getElementById("show_location");
let hide = document.getElementById("hide_location");

show.addEventListener('click', () => {
	console.log('show: ', this.value);
});
hide.addEventListener('click', () => {
	console.log('hide: ', this.value);
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}