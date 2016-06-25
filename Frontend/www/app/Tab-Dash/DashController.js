(function() {
    'use strict';
    angular.module('starter')

    // HOME PAGE CONTROLLER
    .controller('DashController', function($scope, IonicLogin, $state, $cordovaGeolocation, $ionicLoading, $compile) {
        var map = null;
        $scope.shops = [];
        initMap();

        function initMap() {
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
                //Wait till map is laoded
                google.maps.event.addListenerOnce($scope.map, 'idle', function() {
                    console.log('test');
                    loadMarkers();
                });
            }, function(error) {
                content.log("Could not ger location");
                loadMarkers();
            });
        }

        function loadMarkers() {
            Parse.GeoPoint.current({
                success: function(point) {
                    $scope.shops = [];
                    var LatLng = [];
                    var avgLoc = [];
                    var contentString = [];
                    $scope.newOjb = {};
                    var query = new Parse.Query(Parse.Object.extend("Shop"));
                    // query.setLimit(3);
                    query.each(function(shop) {
                        $scope.newObj = {};
                        $scope.newObj.Name = shop.get('ShopName');
                        $scope.newObj.Location = shop.get('Location');
                        $scope.newObj.Numb = shop.get('PhoneNumber');
                        $scope.newObj.Address = shop.get('Address');
                        $scope.newObj.Web = shop.get('WebAddress');
                        $scope.newObj.Hrs = shop.get('Hours');

                        $scope.shops.push($scope.newObj);

                        for (var i = 0; i < $scope.shops.length; i++) {
                            var shop = $scope.shops[i];
                            var markerPos = new google.maps.LatLng($scope.shops[i].Location._latitude, $scope.shops[i].Location._longitude);
                            // Add markers to Map
                            var marker = new google.maps.Marker({
                                map: $scope.map,
                                animation: google.maps.Animation.DROP,
                                position: markerPos,
                            });

                            var infoWindowContent = '<div id="content">' +
                                            '<div style="float:left; width:20%;"><img src="app/img/surf.png" width="60" height="40"/></div>' +
                                            '<div style="float:right">' +
                                            '<h5>' + shop.Name + '</h5>' +
                                            '<div>' + 
                                            '<h6>' + shop.Numb + '</h6>' +
                                            '<h6>' + shop.Address + '</h6>' +
                                            '</div>' +
                                            '</div id="webLink" >' +
                                            '<p><a href="shop.Web">' + shop.Web + '</a> ' +
                                            '</div>';

                            addInfoWindow(marker, infoWindowContent, shop);
                        }
                    });
                }
            })
        }

        function addInfoWindow(marker, message, shop) {

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open($scope.map, marker);
            });
        }
        // // Calculate average location
                        // console.log(avgLoc);
                        // var latSum = 0;
                        // var lngSum = 0;
                        // console.log("this");
                        // for (i in avgLoc){
                        //     latSum += avgLoc[i].lat;
                        //     lngSum += avgLoc[i].lng;
                        // }
                        // var latAvg = latSum / (avgLoc.length);
                        // var lngAvg = lngSum / (avgLoc.length);
                        // console.log("this");
                        // console.log(latAvg);
                        // map.setCenter(new google.maps.LatLng(latAvg, lngAvg));
    })
})();
