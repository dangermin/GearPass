angular.module('starter')

// ACCOUNT SETTINGS CONTROLLER
.controller('TabController', function($scope, $ionicModal, IonicLogin, $state) {

    $scope.logout = function() {
        Parse.User.logOut().then(function() {
            $state.go('login');
        });
    };

    $scope.activate = function() {
        $scope.currentUser = { "id": Parse.User.current().id };

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




    }

    $scope.activate();
});
