angular.module('starter')


// HOME PAGE CONTROLLER
.controller('DashController', function($scope, IonicLogin, $state, $cordovaGeolocation) {
    $scope.shops = [];
    var options = { timeout: 10000, enableHighAccuracy: true };
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(latLng);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        var marker = new google.maps.Marker({
            position: latLng,
            map: $scope.map,
            title: 'Your location'
        });
        // var request = {
        //     location: latLng,
        //     radius: '500',
        //     types: ['food']
        // };
        // service = new google.maps.places.PlacesService($scope.map);
        // service.nearbySearch(request, callback);
        // function callback(results, status) {
        //     if (status === google.maps.places.PlacesServiceStatus.OK) {
        //         for (var i = 0; i < results.length; i++) {
        //             createMarker(results[i]);
        //         }
        //     }
        // }
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: place.geometry.location
            });
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open($scope.map, this);
            });
        }
        $scope.searchShops = function() {
            Parse.GeoPoint.current({
                success: function(point) {
                    var shopList = [];
                    var LatLng = [];
                    var query = new Parse.Query(Parse.Object.extend("Shop"));
                    // query.setLimit(3);
                    query.each(function(shop) {
                        var Name = shop.get('ShopName');
                        var Location = shop.get('Location');
                        var Lat = Location._latitude;
                        var Lng = Location._longitude;
                        var LatLng = { lat: Lat, lng: Lng };

                        shopList.push({ "Name": Name, "Location": Location });

                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            position: LatLng,
                        });
                    });
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    }, function(error) {
        console.log("Could not get location");
    });
})
