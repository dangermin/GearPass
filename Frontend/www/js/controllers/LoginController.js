(function() {
    'use strict';

    angular
        .module('starter')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'IonicLogin', '$ionicLoading', '$http', '$cordovaFacebook', '$state', '$cordovaOauth'];

    function LoginController($scope, IonicLogin, $ionicLoading, $http, $cordovaFacebook, $state, $cordovaOauth) {
        // REMOVE THE USER LOGIN INFORMATION WHEN RETURNING TO LOGIN SCREEN
        $scope.$on('$ionicView.enter', function(e) {
            $scope.data = {};
        });

        // LOGIN FUNCTION
        $scope.login = function() {
            IonicLogin.login($scope.data.email, $scope.data.password);
        }

        // SIGNUP FUNCTION
        $scope.signUp = function() {
            IonicLogin.signUp($scope.data.email, $scope.data.password);
        }

        // FACEBOOK LOGIN
        $scope.facebookLogin = function() {
            $cordovaFacebook.login(["public_profile", "email"]).then(
                function(success) {
                    console.log(JSON.stringify(success));
                    var expiration_date = new Date();
                    expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
                    expiration_date = expiration_date.toISOString();

                    var facebookAuthData = {
                        "id": success.authResponse.userID,
                        "access_token": success.authResponse.accessToken,
                        "expiration_date": expiration_date
                    };

                    Parse.FacebookUtils.logIn(facebookAuthData, {
                        success: function(user) {
                            console.log(JSON.stringify(user));
                            if (!user.existed()) {
                                alert('User signed up and logged in through Facebook');
                            }
                            $state.go('tab.dash');
                        },
                        error: function(user, error) {
                            alert('User cancelled the Facebook login or did not fully authorize');
                        }
                    });
                },
                function(error) {
                    alert('stuff');
                    console.log(JSON.stringify(error));
                }
            );
        }

        // GOOGLE PLUS LOGIN
        $scope.googleLogin = function() {

            var clientId = "354997883795-kmlif1hd8unv62bl3afhi9mj4fv77ere.apps.googleusercontent.com";



            $cordovaOauth.google(clientId, ["email"]).then(function(result) {
                console.log("Response Object ->" + JSON.stringify(result));
                $state.go('tab.dash');
            }, function(error) {
                console.log("Error ->" + error);
            });


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
        }



    }
})
