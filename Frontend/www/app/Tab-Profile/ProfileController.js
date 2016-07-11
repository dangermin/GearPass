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

    // $scope.deleteAccount = function() {
    //     var thisUser = Parse.User.current().id;
    //     console.log(thisUser);
    //     var uQ = = new Parse.Query("User");
    //     uQ.equalTo('objectId', thisUser);
    //     uQ.first({
    //         success: function(obj) {
    //             obj.distory({
    //                 success: function(obj) {
    //                     console.log('Delete');
    //                 },
    //                 error: function(err) {
    //                     console.log('Not Deleted';)
    //                 }
    //             })
    //         },
    //         error: function(err) {
    //             console.log('Deleted error');
    //         }
    //     })
    // }


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

    //User Profile
    var profile = Parse.User.current();
    var First = profile.get('first');
    var Last = profile.get('last');
    var City = profile.get('city');
    var State = profile.get('state');
    var Email = profile.get('email');
    var Phone = profile.get('Phone');
    var Tier = profile.get('MembershipTier');
    var TierID = Tier.id;
    var Created = profile.get('createdAt');
    var Rating = profile.get('Rating');

    $scope.benefits = {};
    var tQ = new Parse.Query("Tier");
    tQ.equalTo('objectId', TierID);
    tQ.find({
        success: function(obj) {
            var tObj = obj;
            var userTier = tObj[0].get('level');
            var userBenefit = tObj[0].get('benefits');
            var tObj = {
                "Tier": userTier,
                "Benefit": userBenefit
            };

            $scope.$apply(function() {
                $scope.benefits = tObj;
            });
        },
        error: function(err) {
            console.log(err);
        }
    });

    var avg = Rating;
    var len = Rating.length;
    var total = .2;
    for (var i in avg) { total += avg[i] / len };
    var Rating = Math.round(total);

    var Month = Created.toDateString().substring(4, 7);
    var Year = Created.toDateString().substring(11, 15);

    $scope.profile = { "FirstName": First, "LastName": Last, "City": City, "State": State, "Email": Email, "Phone": Phone, "value": true, "Rating": Rating, "Month": Month, "Year": Year };
});
