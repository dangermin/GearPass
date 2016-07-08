angular.module('starter')

// LOGIN PAGE CONTROLLER
.controller('PaymentController', function($scope, $ionicModal, IonicLogin, $ionicLoading, $state, $cordovaOauth) {

    //define the payment Modal
    $ionicModal.fromTemplateUrl('templates/paymentModal.html', {
        scope: $scope
    }).then(function(paymentModal) {
        $scope.paymentModal = paymentModal;
    });

    $ionicModal.fromTemplateUrl('templates/profileModal.html', {
        scope: $scope
    }).then(function(profileModal) {
        $scope.profileModal = profileModal;
    });

    $scope.$on('$ionicView.enter', function(e) {
        $scope.profileModal.show();
    });

    //set a variable to capture user profile information
    $scope.data = {
        "first": "",
        "last": "",
        "email": "",
        "password": "",
        "confirmpassword": "",
        "street1": "",
        "street2": "",
        "city": "",
        "state": "",
        "zip": "",
        "phone": ""
    };

    //check if passwords match, create user account, show payment Modal
    $scope.continueToPayment = function() {

        if ($scope.data.password != $scope.data.confirmpassword) {
            $ionicPopup.alert("Passwords do not match!");
        } else {
            IonicLogin.signUp($scope.data);
            //set billing information same as profile information, for convenience
            $scope.payment = {
                "first": $scope.data.first,
                "last": $scope.data.last,
                "street1": $scope.data.street1,
                "street2": $scope.data.street2,
                "city": $scope.data.city,
                "state": $scope.data.state,
                "zip": $scope.data.zip
            };
            $scope.profileModal.hide();
            $scope.paymentModal.show();
        }

        // IonicLogin.signUp($scope.data.email, $scope.data.password);
        // Parse.Cloud.run('generateMembershipNumber').then(
        //     function(data) {
        //         console.log(data);
        //     },
        //     function(err) {
        //         console.log(err);
        //     }
        // );
    }

    //user can clear billing information if different from profile information
    $scope.clearContactInfo = function() {
        $scope.payment = {};
    }

    //once credit card info is filled out, continue to show them profile and have them confirm payment
    $scope.continueToCheckout = function() {
        $scope.paymentModal.hide();
    }

    //Stripe configuration
    $scope.collectPaymentInformation = function() {

        // var cardInfo = {
        //     // "city": $scope.paymentContactInfo.city,
        //     // "state": $scope.paymentContactInfo.state,
        //     "number": $scope.payment.cardNumber,
        //     "month": $scope.payment.month,
        //     "year": $scope.payment.year,
        //     "cvc": $scope.payment.cvc
        // };

        // Parse.Cloud.run('collectPaymentInformation', cardInfo, {
        //     success: function(customer) {
        //         console.log("check");
        //         console.log(customer);
        //     },
        //     error: function(err) {
        //         console.log(err);
        //     }
        // });

        Parse.Cloud.run('generateMembershipNumber',
            function(data) {
                console.log(data);
            },
            function(err) {
                console.log(err);
            });


        $state.go('login');
    }


})
