angular.module('starter')

.controller('PartnerController', function($scope, $ionicModal, IonicLogin, $state) {

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });


    $scope.ShopName = { shopName: "" };
    $scope.Open = { open: "" };
    $scope.Close = { close: "" };
    $scope.ContactName = { contactName: "" };
    $scope.Phone = { phone: "" };
    $scope.Boards = { boards: "" };
    $scope.Location = { location: "" };
    $scope.WebAddress = { webAddress: "" };


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
        shop.set('ShopName', $scope.ShopName.shopName);
        shop.set('Hours', $scope.Open.open + "-" + $scope.Close.close);
        shop.set('ContactName', $scope.ContactName.contactName);
        shop.set('PhoneNumber', $scope.Phone.phone);
        shop.set('WebAddress', $scope.WebAddress.webAddress);
        shop.set('Location', $scope.Location.location.formatted_address);
        shop.set('Lat', parseInt($scope.Location.location.geometry.location.lat()));
        shop.set('Lng', parseInt($scope.Location.location.geometry.location.lng()));

        shop.save().then(
            function(newShop) {
                var promises = [];

                for (var i = 0; i < $scope.Boards.boards; i++) {
                    var GearSchema = Parse.Object.extend('Gear');

                    var gear = new GearSchema();

                    gear.set('Name', 'Surfboard #' + (i + 1));
                    gear.set('Shop', $scope.ShopName.shopName + Parse.User.current().id);

                    promises.push(gear.save());
                }

                Promise.all(promises).then(function() {
                    alert('All done!');
                });
            },
            function(err) {

            }
        );


        $scope.modal.hide();
    }

});
