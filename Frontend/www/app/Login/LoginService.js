angular.module('starter')

.factory('IonicLogin', function($http, $q, $log, $state, $ionicPopup, $ionicLoading) {


    // Parse.Cloud.run('generateMembershipNumber',
    //     function(data) {
    //         console.log(data);
    //     },
    //     function(err) {
    //         console.log(err);
    //     });

    function signUp(data) {

        $ionicLoading.show({
            template: 'Creating Account...'
        });

        Parse.User.signUp(data.email, data.password, { email: data.email, first: data.first, last: data.last, street1: data.street1, street2: data.street2, city: data.city, state: data.state, zip: data.zip }).then(
            function() {
                Parse.User.logOut();
                $ionicLoading.hide();
            },
            function(err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Username Taken',
                    template: 'Username taken, try another one.'
                });
            }
        );


    }


    function login(email, password) {

        if (!email || !password) {
            $ionicPopup.alert({
                title: 'Login',
                template: 'Please fill out all fields'
            });
        } else {

            $ionicLoading.show({
                template: 'Logging In...'
            });

            Parse.User.logIn(email, password, {
                success: function(user) {
                    console.log(user);
                    $ionicLoading.hide();
                    $state.go('splash');
                },
                error: function(user, error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Login',
                        template: 'Wrong User or Password'
                    });
                }
            });
        }
    }


    function logout() {

        Parse.User.logOut().then(
            function(user) {
                $state.go('splash');
            });
    }

    // function socialLogin(email, password) {

    //     $ionicLoading.show({
    //         template: 'Logging In...'
    //     });

    //     $http.post("http://localhost:3000/socialLogin", {
    //             params: {
    //                 "email": email,
    //                 "password": password
    //             }
    //         })
    //         .success(function(response) {

    //             $ionicLoading.hide();

    //             window.localStorage['session'] = JSON.stringify(response);
    //             $state.transitionTo('tab.dash');

    //         })
    //         .error(function(response) {
    //             $ionicLoading.hide();

    //             $ionicPopup.alert({
    //                 title: 'Account',
    //                 template: 'Service unavailable, make sure you are online.'
    //             });
    //         });
    // }

    return {

        login: login,
        signUp: signUp,
        logout: logout
            // socialLogin: socialLogin

    };
});
