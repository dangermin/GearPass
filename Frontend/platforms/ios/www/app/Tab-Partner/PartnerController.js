angular.module('starter')

.controller('PartnerController', function($scope, $ionicModal, IonicLogin, $state) {

    //tell modal how to be
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    //define variables for this scope
    $scope.ShopName = { value: "" };
    $scope.Open = { value: "" };
    $scope.Close = { value: "" };
    $scope.ContactName = { value: "" };
    $scope.Phone = { value: "" };
    $scope.Boards = { value: "" };
    $scope.Location = { value: "" };
    $scope.WebAddress = { value: "" };

    //function to update partner profile, currently you need to retype all fields
    $scope.updatePartner = function() {

        console.log($scope.thisShop.value);

        updateShop = $scope.thisShop.value;

        updateShop.set('ShopName', $scope.ShopName.value);
        updateShop.set('Hours', $scope.Open.open + "-" + $scope.Close.value);
        updateShop.set('ContactName', $scope.ContactName.value);
        updateShop.set('PhoneNumber', $scope.Phone.value);
        updateShop.set('WebAddress', $scope.WebAddress.value);
        updateShop.set('Address', $scope.Location.value.formatted_address);
        updateShop.set('Location', location);


        updateShop.save();
        alert('All done!');

        $scope.modal.hide();

    }

    //create new partner function, only shows if user is not a partner
    $scope.createPartner = function() {

        var ShopSchema = Parse.Object.extend('Shop');

        var shop = new ShopSchema();

        var location = new Parse.GeoPoint($scope.Location.value.geometry.location.lat(), $scope.Location.value.geometry.location.lng())

        shop.set('ShopName', $scope.ShopName.value);
        shop.set('Hours', $scope.Open.open + "-" + $scope.Close.value);
        shop.set('ContactName', $scope.ContactName.value);
        shop.set('PhoneNumber', $scope.Phone.value);
        shop.set('WebAddress', $scope.WebAddress.value);
        shop.set('Address', $scope.Location.value.formatted_address);
        shop.set('Location', location);

        shop.save().then(
            function(newShop) {
                var promises = [];

                for (var i = 0; i < $scope.Boards.value; i++) {
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
                console.log("could not add shop");
            }
        );

        $scope.modal.hide();
    }

    //always check if user is a partner first
    //if true, set display values to match partner profile
    //set partner variable to true so the user sees appropriate content
    // var query = new Parse.Query(Parse.Object.extend("Shop"));
    // return query.each(function(shop) {
    //     var user = shop.get('User');
    //     if (user.id == $scope.currentUser.id) {
    //         var shopName = shop.get('ShopName');
    //         var location = shop.get('Address');
    //         var phone = shop.get('PhoneNumber');
    //         $scope.thisShop = { "value": shop };
    //         $scope.$apply(function() {
    //             $scope.partner = { "ShopName": shopName, "Location": location, "PhoneNumber": phone, "value": true };
    //         });
    //         console.log($scope.partner);
    //     } else {
    //         console.log("attempting to find partner profile");
    //     }

    // });

});
