(function() {
    'use strict';

    angular
        .module('starter')
        .controller('DashController', DashController);

    DashController.$inject = ['$scope', 'IonicLogin', '$state', '$cordovaGeolocation'];

    function DashController($scope, IonicLogin, $state, $cordovaGeolocation) {
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

        }, function(error) {
            console.log("Could not get location");
        });

        $scope.logout = function() {
            console.log('DashCtrl - logout');
            Parse.User.logOut().then(function() {
                window.localStorage['session'] = "";
                $state.go('login');
            });
        }

        $scope.addAShopToCurrentUser = function() {
            var ShopSchema = Parse.Object.extend('Shop');

            var shop = new ShopSchema();

            shop.set('user', Parse.User.current());
            shop.set('name', 'Hey look a shop!');
            shop.set('openingHours', '9am to 5pm');

            shop.save().then(
                function(newShop) {
                    var promises = [];

                    for (var i = 0; i < 10; i++) {
                        var GearSchema = Parse.Object.extend('Gear');

                        var gear = new GearSchema();

                        gear.set('name', 'Surfboard #' + (i + 1));

                        promises.push(gear.save());
                    }

                    Promise.all(promises).then(function() {
                        alert('All done!');
                    });
                },
                function(err) {

                }
            );
        }

    }
})
