angular.module('starter')

.controller('ProfileController', function($scope, $ionicModal, IonicLogin, $state) {

    // Logout function
    $scope.logout = function() {
        console.log('DashCtrl - logout');
        Parse.User.logOut().then(function() {
            window.localStorage['session'] = "";
            $state.go('login');
        });
    }

    $ionicModal.fromTemplateUrl('templates/profileModal.html', {
        scope: $scope
    }).then(function(profileModal) {
        $scope.profileModal = profileModal;
    });

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
