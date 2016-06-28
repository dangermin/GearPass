angular.module('starter')

// LOGIN PAGE CONTROLLER
.controller('PaymentController', function($scope, $ionicModal, IonicLogin, $ionicLoading, $state, $cordovaOauth) {

    //tell modal how to be
    $ionicModal.fromTemplateUrl('templates/contactInfoModal.html', {
        scope: $scope
    }).then(function(contactInfoModal) {
        $scope.contactInfoModal = contactInfoModal;
    });

    // REMOVE THE USER LOGIN INFORMATION WHEN RETURNING TO LOGIN SCREEN
    $scope.$on('$ionicView.enter', function(e) {
        $scope.contactInfoModal.show()
    });

    $scope.data = { "first": "",  "last": "",  "email": "", "phone": "", "age": "" };

    $scope.continueToPayment = function() {
        $scope.contactInfoModal.hide();
        $scope.paymentContactInfo = {"first": $scope.data.first, "last": $scope.data.last,  "email": $scope.data.email, "phone": $scope.data.phone, "age": $scope.data.age };
    }

    $scope.clearContactInfo = function () {
        $scope.paymentContactInfo = {};
    }





    // LOGIN FUNCTION
    $scope.login = function() {
        IonicLogin.login($scope.data.email, $scope.data.password);
    }

    // SIGNUP FUNCTION
    $scope.signUp = function() {
        IonicLogin.signUp($scope.data.email, $scope.data.password);
        $scope.applicationModal.hide();

        Parse.Cloud.run('generateMembershipNumber').then(
            function(data) {
                console.log(data);
            },
            function(err) {
                console.log(err);
            }
        );
    }

})
