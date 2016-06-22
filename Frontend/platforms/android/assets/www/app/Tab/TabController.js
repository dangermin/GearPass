angular.module('starter')

// ACCOUNT SETTINGS CONTROLLER
.controller('TabController', function($scope, $ionicModal, IonicLogin, $state) {

    activate();

    $scope.logout = function() {
        Parse.User.logOut().then(function() {
            $state.go('login');
            $scope.displayEmail = { "email": "" };
        });
    };

    $scope.getProfile = function() {
        console.log("heck yeah!");
    };

    function activate() {
        $scope.currentUser = { "id": Parse.User.current().id };


        var test = Parse.User.current().relation('Shop');

        console.log(test);

        //always get email of current user 
        var emailQuery = new Parse.Query('User');
        emailQuery.get($scope.currentUser.id, {
            success: function(object) {
                $scope.displayEmail = { "email": object.get('email') };
            },

            error: function(object, error) {
                console.log(error);
            }
        });

        query = new Parse.Query(Parse.Role);
        query.equalTo("name", "Member");
        query.first({
            success: function(role) {
                role.getUsers().add(Parse.User.current());
                role.save();
                console.log("member added");
            },
            error: function(error) {
                throw "Got an error " + error.code + " : " + error.message;
            }
        });



        var query = new Parse.Query(Parse.Role);
        query.get('DCb5bDvloZ', {
            success: function(role) {
                var users = role.getUsers().query().find({
                    success: function(result) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].id == $scope.currentUser.id) {
                                $scope.Partner = { "value": true };
                            } else {
                                console.log("attempt" + i);
                            }
                        }
                    },
                    error: function(result) {

                    }
                });
            },

            error: function(role, error) {
                console.log(error);
            }
        });

    }
});
