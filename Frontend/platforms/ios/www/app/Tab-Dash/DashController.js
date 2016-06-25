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
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        google.maps.event.addListener($scope.map, 'click', function() {
            infowindow.close();
        });

        Parse.GeoPoint.current({
            success: function(point) {
                var shopList = [];
                var LatLng = [];
                var avgLoc = [];
                // var contentString = [];
                var query = new Parse.Query(Parse.Object.extend("Shop"));
                // query.setLimit(3);
                query.each(function(shop) {
                    var Name = shop.get('ShopName');
                    var Location = shop.get('Location');
                    var Lat = Location._latitude;
                    var Lng = Location._longitude;
                    var LatLng = { lat: Lat, lng: Lng };
                    var Numb = shop.get('PhoneNumber');
                    var Address = shop.get('Address');
                    var Web = shop.get('WebAddres');
                    var Hrs = shop.get('Hours');

                   
                    contentString = Name, Numb, Address, Web, Hrs;
                  

                    // console.log(contentString);
                    shopList.push({ "Name": Name, "Location": Location });

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: LatLng,
                    });

                    var infowindow = new google.maps.InfoWindow();
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent(contentString);
                        infowindow.open($scope.map, this);
                    });
                });
            },
            error: function(err) {
                console.log(err);
            }
        });

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
