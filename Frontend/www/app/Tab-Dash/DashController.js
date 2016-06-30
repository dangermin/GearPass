(function() {
    'use strict';
    angular.module('starter')

    // HOME PAGE CONTROLLER
    .controller('DashController', function($scope, $ionicModal, $state, $cordovaGeolocation, $ionicLoading, $compile, $cordovaLaunchNavigator) {
        var map = null;
        $scope.shops = [];
        // console.log($scope.shops);
        initMap();
        var markerPos = [];

        function initMap() {
            var options = { timeout: 10000, enableHighAccuracy: true };
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                //Wait till map is laoded
                google.maps.event.addListenerOnce($scope.map, 'idle', function() {
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
                    // $scope.shops = [];
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
                        $scope.newObj.Location = shop.get('Location');

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
                                '<div style="float:left; width:5%; padding-right:2cm"><img src="app/img/surf.png" width="60" height="40"/></div>' +
                                '<div style="float:right">' +
                                '<h5>' + shop.Name + '</h5>' +
                                '<div>' +
                                '<h6>' + shop.Numb + '</h6>' +
                                '<h6>' + shop.Address + '</h6>' +
                                '</div>' +
                                '<div id="webLink" style="float:left">' +
                                '<p><a href="#" onclick="cordova.InAppBrowser.open(google.com);">' + shop.Web + '</a> ' +
                                '<button id="requestBtn" class="button button-calm" ng-click="openModal(\'' + shop.Name + '\',\'' + shop.Email + '\')">Request</button>' +
                                '<button id="requestBtn" class="button button-calm" ng-click="navigate(\'' + markerPos + '\')">Navigate</button>' +
                                '</div>';


                            var compiled = $compile(infoWindowContent)($scope);

                            var infoWindow = new google.maps.InfoWindow({
                                content: compiled[0]
                            });

                            addInfoWindow(marker, compiled[0], shop);
                            // $scope.openModal(compiled[0]);
                        }
                    });
                }
            })
        }


        $ionicModal.fromTemplateUrl('templates/modalContent.html', {
            scope: $scope
        }).then(function(requestModal) {
            $scope.requestModal = requestModal;
        });



        $scope.openModal = function(name, email) {
            $scope.requestModal.show();
            $scope.request = { "name": name, "email": email };
        };

        $scope.closeModal = function() {
            $scope.requestModal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        function addInfoWindow(marker, message, shop) {

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });
            //Binde selected shop to infoWindow
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open($scope.map, this);
                $scope.selected = shop;
                $scope.$apply();
            });

            google.maps.event.addListener($scope.map, 'click', function() {
                infoWindow.close($scope.map, this);
            });
        }

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

        // Loading URLs outside of the app
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            console.log("window.open works well");
        }

        var inAppBrowserRef = undefined;

        function showHelp(url) {

            var target = "_blank";

            var options = "location=yes,hidden=yes";

            inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

            var inAppBrowserRef = function() {

                addEventListener('loadstart', loadStartCallBack);

                addEventListener('loadstop', loadStopCallBack);

                addEventListener('loaderror', loadErrorCallBack);
            }

        }

        function loadStartCallBack() {

            $('#status-message').text("loading please wait ...");

        }

        function loadStopCallBack() {

            if (inAppBrowserRef != undefined) {

                inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;" });

                $('#status-message').text("");

                inAppBrowserRef.show();
            }

        }

        function loadErrorCallBack(params) {

            $('#status-message').text("");

            var scriptErrorMesssage =
                "alert('Sorry we cannot open that page. Message from the server is : " + params.message + "');"

            inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, executeScriptCallBack);

            inAppBrowserRef.close();

            inAppBrowserRef = undefined;

        }

        function executeScriptCallBack(params) {

            if (params[0] == null) {

                $('#status-message').text(
                    "Sorry we couldn't open that page. Message from the server is : '" + params.message + "'");
            }

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
