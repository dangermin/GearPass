angular.module('starter')

// LOGIN PAGE CONTROLLER
.controller('LoginController', function($scope, $ionicModal, IonicLogin, $ionicLoading, $state, $cordovaOauth) {

    //tell modal how to be
    $ionicModal.fromTemplateUrl('templates/applicationModal.html', {
        scope: $scope
    }).then(function(applicationModal) {
        $scope.applicationModal = applicationModal;
    });

    // REMOVE THE USER LOGIN INFORMATION WHEN RETURNING TO LOGIN SCREEN
    $scope.data = { "email": "", "password": "" };

    // LOGIN FUNCTION
    $scope.login = function() {
        console.log("step 1");
        IonicLogin.login($scope.data.email, $scope.data.password);
    }


    $scope.goToPayment = function(tier) {
        $scope.applicationModal.hide();
        $state.go('payment', { tier: tier });
    }

    // SIGNUP FUNCTION
    $scope.signUp = function() {
        IonicLogin.signUp($scope.data.email, $scope.data.password);
        $scope.applicationModal.hide();

    }

})










// // // FACEBOOK LOGIN
// // $scope.facebookLogin = function() {
// //     $cordovaFacebook.login(["public_profile", "email"]).then(
// //         function(success) {
// //             console.log(JSON.stringify(success));
// //             var expiration_date = new Date();
// //             expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
// //             expiration_date = expiration_date.toISOString();

// //             var facebookAuthData = {
// //                 "id": success.authResponse.userID,
// //                 "access_token": success.authResponse.accessToken,
// //                 "expiration_date": expiration_date
// //             };

// //             Parse.FacebookUtils.logIn(facebookAuthData, {
// //                 success: function(user) {
// //                     console.log(JSON.stringify(user));
// //                     if (!user.existed()) {
// //                         alert('User signed up and logged in through Facebook');
// //                     }
// //                     $state.go('tab.dash');
// //                 },
// //                 error: function(user, error) {
// //                     alert('User cancelled the Facebook login or did not fully authorize');
// //                 }
// //             });
// //         },
// //         function(error) {
// //             alert('stuff');
// //             console.log(JSON.stringify(error));
// //         }
// //     );
// // }

// // GOOGLE PLUS LOGIN
// $scope.googleLogin = function() {

//     var clientId = "354997883795-kmlif1hd8unv62bl3afhi9mj4fv77ere.apps.googleusercontent.com";



//     $cordovaOauth.google(clientId, ["email"]).then(function(result) {
//         console.log("Response Object ->" + JSON.stringify(result));
//         $state.go('tab.dash');
//     }, function(error) {
//         console.log("Error ->" + error);
//     });


// // CREATE A PROJECT ON GOOGLE DEVELOPER CONSOLE AND PUT YOUR CLIENT ID HERE
// // GOOGLE OAUTH DOES NOT GIVE US EMAIL RIGHT AWAY SO WE HAVE TO MAKE 2 API CALLS
// $cordovaOauth.google("584540832467-tv8i4a8utt7tk5aih3ej8a6gc65sjk87.apps.googleusercontent.com", ["email"], { redirect_uri: "http://localhost/callback" }).then(function(result) {
//     //   alert("Response Object -> " + JSON.stringify(result));

//     $http.get("https://www.googleapis.com/plus/v1/people/me", // TO GET THE USER'S EMAIL
//             {
//                 params: {
//                     access_token: result.access_token,
//                     key: "584540832467-tv8i4a8utt7tk5aih3ej8a6gc65sjk87.apps.googleusercontent.com"
//                 }
//             })
//         .then(function(user) {
//             //      alert(JSON.stringify(user));
//             IonicLogin.socialLogin(user.data.emails[0].value, result.access_token); // USING ID TO GENERATE A HASH PASSWORD
//         });
// });
// }

// // TWITTER LOGIN
// $scope.twitterLogin = function() {

//     // YOUR TWITTER CALLBACK WILL HAVE TO BE HTTP://LOCALHOST/CALLBACK FOR TESTING BUT
//     // IT NEEDS TO BE SET VIA TINYURL.COM
//     var consumerKey = "fMNg8ecQmeOTHNFGgJKsGwYbw"; // PUT YOUR CONSUMER KEY HERE
//     var consumerSecretKey = "cPOHMNSrDXLb1dXrVQP0e3CaeSlVGONzYgGq92gpPh38q9g51Q"; // PUT YOUR SECRET KEY HERE
//     var oathToken = ""
//     var oathSecret = "";

//     $cordovaOauth.twitter(consumerKey, consumerSecretKey)
//         .then(function(result) {
//             // alert(JSON.stringify(user));
//             oathToken = result.oauth_token;
//             oathSecret = result.oauth_token_secret;

//             // IF YOU WANT TO GET TWITTER USERS EMAIL ADDRESS YOU WILL HAVE TO WHITELIST YOUR APP WITH TWITTER
//             // THEY DO NOT ALLOW IT BY DEFAULT
//             // https://dev.twitter.com/rest/reference/get/account/verify_credentials
//             IonicLogin.socialLogin(result.screen_name, result.user_id); // USING ID TO GENERATE A HASH PASSWORD
//         });
// }

// // INSTAGRAM LOGIN
// $scope.instagramLogin = function() {

//     var clientID = "a0c936f91d4d4219b3230fb96650216d"; // PUT YOUR CLIENT ID HERE
//     var redirectURL = "http://tinyurl.com/krmpchb" // PUT YOUR REDIRECT URL HERE

//     $cordovaOauth.instagram(clientID, ["basic"], { redirect_uri: redirectURL })
//         .then(function(result) {
//             // INSTAGRAM OAUTH DOES NOT GIVE US USERNAME SO WE HAVE TO MAKE 2 API CALLS
//             $http.get("https://api.instagram.com/v1/users/self/", // TO GET THE USERSNAME
//                     { params: { access_token: result.access_token } })
//                 .then(function(user) {
//                     //     alert(JSON.stringify(user));
//                     IonicLogin.socialLogin(user.data.data.username, result.access_token); // USING ID TO GENERATE A HASH PASSWORD
//                 });
//         });
// }
