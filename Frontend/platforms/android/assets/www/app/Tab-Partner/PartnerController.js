angular.module('starter')

.controller('PartnerController', function($scope, $ionicModal, IonicLogin, $state) {

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });


    $scope.ShopName = { value: "" };
    $scope.Open = { value: "" };
    $scope.Close = { value: "" };
    $scope.ContactName = { value: "" };
    $scope.Phone = { value: "" };
    $scope.Boards = { value: "" };
    $scope.Location = { value: "" };
    $scope.WebAddress = { value: "" };


    $scope.addAShopToCurrentUser = function() {

        query = new Parse.Query(Parse.Role);
        query.equalTo("name", "Partner");
        query.first({
            success: function(role) {
                role.getUsers().add(Parse.User.current());
                role.save();
            },
            error: function(error) {
                throw "Got an error " + error.code + " : " + error.message;
            }
        });

        var ShopSchema = Parse.Object.extend('Shop');

        var shop = new ShopSchema();

        shop.set('User', Parse.User.current());
        shop.set('ShopName', $scope.ShopName.value);
        shop.set('Hours', $scope.Open.open + "-" + $scope.Close.value);
        shop.set('ContactName', $scope.ContactName.value);
        shop.set('PhoneNumber', $scope.Phone.value);
        shop.set('WebAddress', $scope.WebAddress.value);
        shop.set('Location', $scope.Location.value.formatted_address);
        shop.set('Lat', parseInt($scope.Location.value.geometry.location.lat()));
        shop.set('Lng', parseInt($scope.Location.value.geometry.location.lng()));

        shop.save().then(
            function(newShop) {
                var promises = [];

                for (var i = 0; i < $scope.Boards.boards; i++) {
                    var GearSchema = Parse.Object.extend('Gear');

                    var gear = new GearSchema();

                    gear.set('Name', 'Surfboard #' + (i + 1));
                    gear.set('Shop', $scope.ShopName.value + Parse.User.current().id);

                    promises.push(gear.save());
                }

                Promise.all(promises).then(function() {
                    alert('All done!');
                });
            },
            function(err) {

            }
        );

        $scope.Partner = { "value": true }

        $scope.modal.hide();
    }

});
