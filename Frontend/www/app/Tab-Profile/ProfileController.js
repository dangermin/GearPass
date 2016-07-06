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


    $scope.updateProfile = function() {

        profile = $scope.thisProfile.value;

        profile.set('User', Parse.User.current());
        profile.set('FirstName', $scope.publicFirstName.value);
        profile.set('LastName', $scope.publicLastName.value);
        profile.set('Location', $scope.publicLocation.value.formatted_address);


        profile.save();
        alert('All done!');

        $scope.profileModal.hide();

    }


    $scope.createProfile = function() {

        var PublicProfileSchema = Parse.Object.extend('PublicProfile');

        var public = new PublicProfileSchema();

        public.set('User', Parse.User.current());
        public.set('FirstName', $scope.publicFirstName.value);
        public.set('LastName', $scope.publicLastName.value);
        public.set('Location', $scope.publicLocation.value.formatted_address);


        public.save();
        alert("all done");

        $scope.profileModal.hide();
    }

    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(200, 200, 100)',
        iconOffColor: 'rgb(200, 100, 100)',
        rating: 2,
        minRating: 1,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };

    $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
    };

    var query = new Parse.Query(Parse.Object.extend("PublicProfile"));
    return query.each(function(profile) {
        var user = profile.get('User');
        if (user.id == $scope.currentUser.id) {
            var First = profile.get('FirstName');
            var Last = profile.get('LastName');
            var Location = profile.get('Location');
            var Email = profile.get('Email');
            $scope.thisProfile = { "value": profile };
            $scope.$apply(function() {
                $scope.profile = { "FirstName": First, "LastName": Last, "Location": Location, "Email": Email, "value": true };
            });
            console.log($scope.partner);
        } else {
            console.log("attempting to find partner profile");
        }

    });
});
