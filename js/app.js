var Place = function(data) {

    var self = this;

    this.name = ko.observable(data.name);
    this.description = ko.observable(data.description);
    this.address = ko.observable(data.address);
    this.fs_id = ko.observable(data.fs_id);

    this.marker = null;
    this.currentPlace = ko.observable('');

}

var ViewModel = function() {

    var self = this;

    // create place observable array
    self.places = ko.observableArray([]);

    // get the data stored in data.js & put it into an array of Place objects
    initialPlaceData.forEach(function(placeItem) {
        self.places.push(new Place(placeItem))
    });

    // set initial place to nothing
    self.currentPlace = ko.observable('');

    // this controls what happens when a user clicks on any of the places
    self.setCurrentPlace = function(place) {

        //access the viewmodel using self & update the view w/ the new place
        self.currentPlace(place);
        google.maps.event.trigger(place.marker, 'click');

        // TODO - do something else for the place
        self.getFSRating(place.fs_id());

    };

    // Handle typing filter, reset visible places in the list
    self.filterText = ko.observable('');

    // adapted from http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    self.placeFiltered = ko.computed(function() {

        // check to see if nothing is typed, then return the whole array
        if (self.filterText() === "") {
            return self.places();
        }
        else {
            // filter the array
            return ko.utils.arrayFilter(self.places(), function(place) {
                return place.name()
                        .toLowerCase()
                        .indexOf(self.filterText().toLowerCase()) !== -1;
            })
        }
    });

    // Add a subscription for every time the filter changes to remap markers
    self.placeFiltered.subscribe(function() {
        showMarkers();
    });


    self.currentFSRating = ko.observable('');

    // get info from Foursquare since Yelp v3 is a biatch
    self.getFSRating = function(place) {
        // console.log(place);
        FSUrl = 'https://api.foursquare.com/v2/venues/' + place +
            '?client_id=SOGFZWO3UKCUHIJKX3GJIWZXKT3404LWT2H2GTBZM230A0XS' +
            '&client_secret=3RBGJ2JAFGHO3TQ3UHRLLREMJII3WUSG5J5PJB3MQXUVI32U' +
            '&v=20170529'
        $.ajax({
            url: FSUrl,
            dataType: "jsonp",
            success: function(data) {

                // get the parsed response key value
                place_rating = data.response.venue.rating;

                // assign the rating
                self.currentFSRating(place_rating);

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
                alert("Error: " + errorThrown);
                self.currentFSRating(null);
            }
        })
        // if ajax request fails, show the user an error
        .fail(function() {
            console.log("There was an error getting the Foursquare rating!");
            // added an alert box since a console message was not enough
            alert("There was an error getting the Foursquare rating!");
        });

    };

};
var vm = new ViewModel;

ko.applyBindings(vm);