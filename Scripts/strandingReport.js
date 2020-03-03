/*
Reference: https://www.w3schools.com/html/html5_geolocation.asp
*/

// let serverURL = "http://localhost:39999/";
let serverURL = "http://flip1.engr.oregonstate.edu:39999/";

document.getElementById('get-location').addEventListener('click', getLocation);
document.addEventListener('DOMContentLoaded', postStranding);

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
    document.getElementById("longitude").value = position.coords.longitude;
}

function errorCoor() {
    alert("Error gathering coordinates.");
}

function postStranding() {
    document.getElementById('postStranding').addEventListener('click', function(event) {
        let postRequest = new XMLHttpRequest();

        let city = document.getElementById('city').value;
        let state = document.getElementById('state').value;
        let county = document.getElementById('county').value;
        let alive = document.getElementById('alive').value;
        let longitude = document.getElementById('longitude').value;
        let latitude = document.getElementById('latitude').value;
        let mammalNote = document.getElementById('mammalNote').value;
        let locationNote = document.getElementById('locationNote').value;


        let postBody = "city=" + city + "&" + "state=" + state + "&" + "county=" + county + "&" + "alive=" + alive +
            "&" + "longitude=" + longitude + "&" + "latitude=" + latitude + "&" + "mammalNote=" + mammalNote + "&" +
            "locationNote=" + locationNote;

        let apiURL = serverURL + "add-stranding";
        postRequest.open("POST", apiURL, true);
        postRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        postRequest.addEventListener('load', function() {

        });

        postRequest.send(postBody);

        event.preventDefault();
    })
}