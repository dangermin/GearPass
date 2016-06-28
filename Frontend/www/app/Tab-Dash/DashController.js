(function() {
    'use strict';
    angular.module('starter')

    // HOME PAGE CONTROLLER
    .controller('DashController', function($scope, IonicLogin, $ionicModal, $state, $cordovaGeolocation, $ionicLoading, $compile) {
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
                    $scope.shops = [];
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
                                '<p><a href="shop.Web">' + shop.Web + '</a> ' +
                                '<button id="requestBnt" class="button button-calm" ng-click="requestModal.show()">Request</button>' +
                                '</div>';


                            var compiled = $compile(infoWindowContent)($scope);

                            var infoWindow = new google.maps.InfoWindow({
                                content: compiled[0]
                            });

                            $ionicModal.fromTemplateUrl('templates/modalContent.html', {
                                scope: $scope
                            }).then(function(requestModal) {
                                $scope.requestModal = requestModal;
                            });



                            $scope.openModal = function() {
                                $scope.requestModal.show();
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



                            // $scope.requestModal = $ionicModal.fromTemplate('<ion-modal-view>' +
                            //     ' <ion-header-bar>' +
                            //     '<h1 class = "title">Modal Title</h1>' +
                            //     '</ion-header-bar>' +

                            //     '<ion-content>' +
                            //     '<button class="button icon icon-left ion-ios-close-outline" ng-click="closeModal()">Close Modal </button>' +
                            //     '</ion-content>' +

                            //     '</ion-modal-view>', {
                            //         scope: $scope,
                            //         animation: 'slide-in-up'
                            //     })

                            addInfoWindow(marker, compiled[0], shop);
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
                infoWindow.open($scope.map, this);
            });
            google.maps.event.addListener($scope.map, 'click', function() {
                infoWindow.close($scope.map, this);
            });
        }

        $scope.request = { "gear": "", "quantity": "", "message": ""};

        function comfirm(gear, quantity, message){

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