mapboxgl.accessToken = 'pk.eyJ1IjoianJ0MjI1IiwiYSI6ImNqcWJzMGVvcjA2Nng0MnFvNHIwdnc5YnYifQ.OZxuEOysWuDEmYUAWdTELA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11'
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
    geolocate.trigger();
});

map.on('load', function() {
    map.loadImage(
        'https://img.icons8.com/material/24/000000/marker--v1.png',
        function(error, image) {
            if (error) throw error;
            map.addImage('map-icon', image);

            let locationURL = "http://localhost:39999/get-stranding-locations";
            let getResponders = new XMLHttpRequest();

            getResponders.open("GET", locationURL, true);
            getResponders.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            getResponders.addEventListener('load', function () {
                if (getResponders.status >= 200 && getResponders.status < 400) {
                    let getResponse = JSON.parse(getResponders.responseText);

                    for (let idx = 0; idx < getResponse.length; idx++) {
                        map.addSource('point', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [getResponse[idx].longitude, getResponse[idx].latitude]
                                        }
                                    }
                                ]
                            }
                        });

                        map.addLayer({
                            'id': 'points',
                            'type': 'symbol',
                            'source': 'point',
                            'layout': {
                                'icon-image': 'map-icon',
                                'icon-size': 0.75
                            }
                        });
                    }
                }
            });

            getResponders.send();

            event.preventDefault();

        }
    )
});
