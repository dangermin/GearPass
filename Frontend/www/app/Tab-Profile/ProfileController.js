angular.module('starter')

// ACCOUNT SETTINGS CONTROLLER
.controller('ProfileController', function($scope, $ionicModal, IonicLogin, $state) {

    activate();


    function activate() {
        var currentUser = Parse.User.current().id;

        var emailQuery = new Parse.Query('User');
        emailQuery.get(currentUser, {
            success: function(object) {
                $scope.displayEmail = { "email": object.get('email') };
                $apply();
            },

            error: function(object, error) {
                // error is an instance of Parse.Error.
            }
        });

        var profileQuery = new Parse.Query("PublicProfile");
        profileQuery.get(currentUser, {
            success: function(object) {
                console.log(object);
                $scope.firstName = { "value": object.get('FirstName') };
                $scope.lastName = { "value": object.get('LastName') };
                $scope.adjective = { "value": object.get('Adjective') };
                $apply();
            },

            error: function(object, error) {
                // error is an instance of Parse.Error.
            }
        });

        
        var query = new Parse.Query(Parse.Role);
        query.get('DCb5bDvloZ', {
            success: function(role) {
                var users = role.getUsers().query().find({
                    success: function(result) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].id == currentUser) {
                                $scope.Partner = { "value": true };
                                $apply();
                            } else {
                                $scope.User = { "value": true };
                            }
                        }
                    },
                    error: function(result) {

                    }
                });
                console.log(users);
            },

            error: function(role, error) {
                // error is an instance of Parse.Error.
            }
        });

    };
    $scope.logout = function() {
        console.log('DashCtrl - logout');
        Parse.User.logOut().then(function() {
            window.localStorage['session'] = "";
            $state.go('login');
        });
    }

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/profileModal.html', {
        scope: $scope
    }).then(function(profileModal) {
        $scope.profileModal = profileModal;
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

    $scope.ppFirstName = { "value": "" };
    $scope.ppLastName = { "value": "" };
    $scope.ppAdjective = { "value": "" };

    $scope.addPublicProfileToCurrentUser = function() {

        var PublicProfileSchema = Parse.Object.extend('PublicProfile');

        var pp = new PublicProfileSchema();

        pp.set('User', Parse.User.current());
        pp.set('FirstName', $scope.ppFirstName.value);
        pp.set('LastName', $scope.ppLastName.value);
        pp.set('Adjective', $scope.ppAdjective.value);


        pp.save();


        $scope.profileModal.hide();
    }
});
