angular.module('starter')

// ACCOUNT SETTINGS CONTROLLER
.controller('TabController', function($scope, $ionicModal, IonicLogin, $state) {

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

    }
});
