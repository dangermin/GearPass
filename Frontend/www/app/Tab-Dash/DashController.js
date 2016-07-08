(function() {
    'use strict';
    angular.module('starter')

    // HOME PAGE CONTROLLER
    .controller('DashController', function($scope, $ionicModal, $state, $cordovaGeolocation, $ionicLoading, $compile, $cordovaLaunchNavigator, $cordovaInAppBrowser, $timeout) {


        $scope.$on('$ionicView.enter', function(e) {

            var map = null;
            $scope.selectedRating = {};
            $scope.shops = [];
            initMap();
            var markerPos = [];
        });



        function CenterControl(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            // controlUI.style.border = '1px solid #fff';
            controlUI.style.borderRadius = '4px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = '#387EF5';
            // controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '25px';
            controlText.style.fontWeight = 'bold';
            controlText.style.lineHeight = '25px';
            controlText.style.paddingLeft = '3px';
            controlText.style.paddingRight = '3px';
            controlText.innerHTML = "<span class='ion-pinpoint'></span>";
            controlUI.appendChild(controlText);

            controlUI.addEventListener('click', function() {
                $cordovaGeolocation.getCurrentPosition().then(function(position) {
                    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $scope.map.setCenter(latLng);
                    $scope.map.setZoom(11);
                });
            });

        }

        function initMap() {
            var options = { timeout: 10000, enableHighAccuracy: true };
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log(latLng);
                var mapOptions = {
                    center: latLng,
                    zoom: 11,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP

                };
                $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                //Wait till map is laoded
                var centerControlDiv = document.createElement('div');
                var centerControl = new CenterControl(centerControlDiv, options);
                centerControlDiv.index = 1;
                $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

                google.maps.event.addListenerOnce($scope.map, 'idle', function() {
                    loadMarkers();
                });
            }, function(error) {
                console.log("Could not ger location");
                loadMarkers();
            });
        }

        function loadMarkers() {
            Parse.GeoPoint.current({
                success: function(point) {
                    var LatLng = [];
                    var avgLoc = [];
                    var contentString = [];
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
                        $scope.newObj.Email = shop.get('EmailAddress');
                        $scope.newObj.Rating = shop.get('Rating');
                        var location = $scope.newObj.Location;
                        var avg = $scope.newObj.Rating;
                        var len = $scope.newObj.Rating.length;
                        var total = .2;
                        for (var i in avg) { total += avg[i] / len };
                        $scope.newObj.Rating = Math.round(total);
                        $scope.newObj.Marker = new google.maps.LatLng(location._latitude, location._longitude).toString();
                        $scope.shops.push($scope.newObj);

                        for (var i = 0; i < $scope.shops.length; i++) {
                            var shop = $scope.shops[i];
                            var markerPos = new google.maps.LatLng($scope.shops[i].Location._latitude, $scope.shops[i].Location._longitude);
                            $scope.MarkerPos = markerPos;

                            shop.Rated = {
                                rating: shop.Rating,
                                readOnly: true,
                            };

                            var marker = new google.maps.Marker({
                                map: $scope.map,
                                animation: google.maps.Animation.DROP,
                                position: markerPos,
                            });

                            var infoWindowContent = '<div id="content">' +
                                '<div style="float:left; width:5%; padding-right:2cm"><img src="app/img/surf.png" width="60" height="40"/></div>' +
                                '<div style="float:right">' +
                                '<h5>' + shop.Name + '</h5>' +
                                '<div>' +
                                '<h6>' + shop.Numb + '</h6>' +
                                '<h6>' + shop.Address + '</h6>' +
                                '<ionic-ratings ratingsobj="{rating: ' + shop.Rating + ', readOnly: ' + true + ' }" style="float: right"></ionic-ratings>' +
                                '</div>' +
                                '<div id="webLink" style="float:left">' +
                                '<p><a href="#" onclick="openBrowser(google.com);">' + shop.Web + '</a> ' +
                                '<button id="requestBtn" class="button button-calm" ng-click="openModal(\'' + shop.Name + '\',\'' + shop.Email + '\')">Request</button>' +
                                '<button id="requestBtn" class="button button-calm" ng-click="navigate(\'' + markerPos + '\')">Navigate</button>' +
                                '</div>';

                            var compiled = $compile(infoWindowContent)($scope);
                            var infoWindow = new google.maps.InfoWindow({
                                content: compiled[0]
                            });

                            addInfoWindow(marker, compiled[0], shop);
                        }
                    });
                }
            })
        }

        //InfoWindow
        function addInfoWindow(marker, message, shop) {

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });

            $scope.selected = shop;

            //Binde selected shop to infoWindow
            google.maps.event.addListener(marker, 'click', function() {
                // infoWindow.open($scope.map, this);
                $scope.selected = shop;
                $scope.selectedRating = $scope.selected.Rated.rating;

                $scope.$apply();
            });

            $scope.selectedRating = $scope.selected.Rated.rating;

            google.maps.event.addListener($scope.map, 'click', function() {
                infoWindow.close($scope.map, this);
            });
        }

        //Request Modal
        $ionicModal.fromTemplateUrl('templates/modalContent.html', {
            scope: $scope
        }).then(function(requestModal) {
            $scope.requestModal = requestModal;
        });

        $scope.openModal = function(name, email) {
            $scope.requestModal.show();
            $scope.request = { "name": name, "email": email, "date": new moment().format() };
        };

        $scope.closeModal = function() {
            $scope.requestModal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        //create new partner function, only shows if user is not a partner
        $scope.Confirm = function() {

            var query = new Parse.Query('Shop');
            query.equalTo("ShopName", $scope.request.name);
            query.first({
                success: function(object) {
                    var shop = object;
                    console.log(shop);
                    var RequestSchema = Parse.Object.extend('Request');
                    var request = new RequestSchema();
                    request.set('User', Parse.User.current());
                    request.set('Shop', shop);
                    request.set('Quantity', $scope.request.quantity);
                    request.set('Gear', $scope.request.gear);
                    request.set('Message', $scope.request.message);
                    request.set('Completed', false);

                    request.save();

                    Parse.Cloud.run('requestMail', $scope.request, {
                        success: function(data) {
                            console.log(data);
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });

                    $scope.requestModal.hide();

                },
                error: function(err) {
                    console.log(err);
                }
            });
        }

        // Navigation
        $scope.navigate = function(destination) {
            $cordovaGeolocation.getCurrentPosition().then(function(start) {
                $cordovaLaunchNavigator.navigate(destination, {
                    start: [start.coords.latitude, start.coords.longitude],
                    enableDebug: true
                }).then(function() {
                    alert("Navigator Launched");
                }, function(err) {
                    alert(err);
                });
            });
        }

        $scope.openBrowser = function(url) {
            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
            };
            $cordovaInAppBrowser.open(url, '_blank', options)

            .then(function(event) {
                // success
            })

            .catch(function(event) {
                // error
            });
        }

        // Calculate average location
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

    });
})();
