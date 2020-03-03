//API DOC REFERENCE USED: https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
// let mapGetURL = "http://localhost:39999/get-stranding-locations";
let mapGetURL = "http://flip1.engr.oregonstate.edu:39999/get-stranding-locations";

mapboxgl.accessToken = 'pk.eyJ1IjoianJ0MjI1IiwiYSI6ImNqcWJzMGVvcjA2Nng0MnFvNHIwdnc5YnYifQ.OZxuEOysWuDEmYUAWdTELA';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    zoom: 2
});

// Add geolocate control to the map.
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(geolocate);

map.on('load', function()
{
    //geolocate.trigger();
});

map.on('load', function(event) {
        let getResponders = new XMLHttpRequest();

        getResponders.open("GET", mapGetURL, true);
        getResponders.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        getResponders.addEventListener('load', function () {
            if (getResponders.status >= 200 && getResponders.status < 400) {
                let getResponse = JSON.parse(getResponders.responseText);

                for (let idx = 0; idx < getResponse.length; idx++) {
                    //Create a popup
                    let strandingPopup = new mapboxgl.Popup({offset: 25}).setHTML (
                        "<p>"+
                        "Stranding Active: " + getResponse[idx].active + "<br>" +
                        "City: " + getResponse[idx].city + "<br>" +
                        "County: " + getResponse[idx].county + "<br>" +
                        "State: " + getResponse[idx].state + "<br>" +
                        "Location Note: " + getResponse[idx].note +
                        "</p>"
                    );

                    let element = document.createElement('div');
                    element.id = 'marker';

                    new mapboxgl.Marker(element)
                        .setLngLat([getResponse[idx].longitude, getResponse[idx].latitude])
                        .setPopup(strandingPopup)
                        .addTo(map);

                }
            }
        });

        getResponders.send();

        event.preventDefault();
});
