var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.7769137, lng: -122.4235541},
        zoom: 14
    });

    createMarkerList();

}

// set map markers from static data
function createMarkerList() {

    // map() method creates a new array with the results of calling a provided
    // function on every element in this array
    vm.placeFiltered().map(function(place) {
        geocodeAddress(place, false);
    });

    // below method errored when backspacing
    //for (var i = 0; i < vm.placeFiltered().length; i++) {
    // get a lat/long from the address
    //geocodeAddress(vm.placeFiltered()[i].address());
    //}

}

// Adds a marker to the map from a lat-long object
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        // make all default markers w/ icon maker
        icon: makeMarkerIcon('0091ff'),
        map: map
    });

    // Style the markers a bit
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    markers.push(marker);

    return marker;

}

// get geo code lat/long from a full address
function geocodeAddress(place, pan=false) {

    var location = place.address();
    var geocoder = new google.maps.Geocoder();

    var address =
        geocoder.geocode({'address': location}, function(results, status) {
            if (status === 'OK') {
                var latLong = results[0].geometry.location;
                var marker = addMarker(latLong);

                marker.addListener('click', function() {
                    // make sure we're doing updates for both interactions
                    vm.currentPlace(place);
                    vm.getFSRating(place.fs_id());
                    marker.setAnimation(google.maps.Animation.DROP);
                });

                // Pans to marker on the map if enabled
                if (pan) map.panTo(marker.getPosition());
            }
            else {
                console.log('Geocode was not successful for the following reason: ' + status);
                alert('Could not find a location that matched' + location + '.');
            }
        });
}


// This function will loop through the markers and hide them all.
function clearMarkers() {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    markers = [];

}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}
