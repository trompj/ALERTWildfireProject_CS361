/*
Reference: https://www.w3schools.com/html/html5_geolocation.asp
*/

document.getElementById('get-location').addEventListener('click', getLocation);

let longitiude = 0;
let latitude = 0;

function reportStranding() {
    navigator.geolocation.getCurrentPosition(getCoor, errorCoor, {maximumAge:50000, timeout:5500, enableHighAccuracy:true});

    window.location.replace("../report.html");
}

function getLocation(event) {
    event.preventDefault();
    
    navigator.geolocation.getCurrentPosition(getCoor, errorCoor, {maximumAge:50000, timeout:5500, enableHighAccuracy:true});
}

function getCoor(position) {
    document.getElementById("latitude").value = position.coords.latitude;
    document.getElementById("longitude").value = position.coords.longitude;;
}

function errorCoor() {
    alert("Error gathering coordinates.");
}