angular.module('starter')

.controller('ProfileController', function($scope, $ionicModal, IonicLogin, $state) {


    $ionicModal.fromTemplateUrl('templates/profileModal.html', {
        scope: $scope
    }).then(function(profileModal) {
        $scope.profileModal = profileModal;
    });

    $scope.publicFirstName = { "value": "" };
    $scope.publicLastName = { "value": "" };
    $scope.publicLocation = { "value": "" };

    $scope.addPublicProfileToCurrentUser = function() {

        var PublicProfileSchema = Parse.Object.extend('PublicProfile');

        var public = new PublicProfileSchema();

        public.set('User', Parse.User.current());
        public.set('Email', $scope.displayEmail.email);
        public.set('FirstName', $scope.publicFirstName.value);
        public.set('LastName', $scope.publicLastName.value);
        public.set('Location', $scope.publicLocation.value.formatted_address);


        public.save();

        $scope.hasProfile = { "value": true }

        $scope.profileModal.hide();
    }
});
