/*
Reference: https://www.w3schools.com/html/html5_geolocation.asp
*/

let serverURL = "http://localhost:39999/";
//let serverURL = "http://flip1.engr.oregonstate.edu:39999/";

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
        let error = false;

        //Reset error input validation indicators in case present
        document.getElementById("state").style.borderColor = "black";
        document.getElementById("county").style.borderColor = "black";
        document.getElementById("alive").style.borderColor = "black";

        let city = document.getElementById('city').value;
        let state = document.getElementById('state').value;
        if (state !== "WA" && state !== "OR" && state !== "CA" && state !== "TX" && state !== "LA" && state !== "MS"
            && state !== "AL" && state !== "FL" && state !== "GA" && state !== "SC" && state !== "NC" && state !== "VA" && state !== "DC" && state !== "DE"
            && state !== "NJ" && state !== "NY" && state !== "CT" && state !== "RI" && state !== "MA" && state !== "NH" && state !== "ME") {
            document.getElementById("state").style.borderColor = "red";
            error = true
        }

        let county = document.getElementById('county').value;
        if (county === "" || county == null) {
            document.getElementById("county").style.borderColor = "red";
            error = true
        }

        let alive = document.getElementById('alive').value;
        if (alive == null) {
            document.getElementById("alive").style.borderColor = "red";
            error = true
        }

        let longitude = document.getElementById('longitude').value;
        if (longitude < -180 && longitude > 180) {
            document.getElementById('longitude').style.borderColor = "red";
            error = true
        }
        let latitude = document.getElementById('latitude').value;
        if (longitude < -90 && longitude > 90) {
            document.getElementById('longitude').style.borderColor = "red";
            error = true
        }
        let mammalNote = document.getElementById('mammalNote').value;
        let locationNote = document.getElementById('locationNote').value;


        if (error !== true) {
            let postRequest = new XMLHttpRequest();


            let postBody = "city=" + city + "&" + "state=" + state + "&" + "county=" + county + "&" + "alive=" + alive +
                "&" + "longitude=" + longitude + "&" + "latitude=" + latitude + "&" + "mammalNote=" + mammalNote + "&" +
                "locationNote=" + locationNote;

            let apiURL = serverURL + "add-stranding";
            postRequest.open("POST", apiURL, true);
            postRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            postRequest.addEventListener('load', function () {

                if (postRequest.status >= 200 && postRequest.status < 400) {
                    let response = JSON.parse(postRequest.responseText);

                    alert("Stranding #" + response +" Added")
                }
                else {
                    alert("Failed to add stranding")
                }

            });

            postRequest.send(postBody);
        }
        else {
            alert("Failed to add stranding")
        }

        event.preventDefault();
    })
}