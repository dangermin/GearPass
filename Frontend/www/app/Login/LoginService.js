angular.module('starter')

.factory('IonicLogin', function($http, $state, $ionicPopup, $ionicLoading) {

    function login(email, password) {

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
                $ionicPopup.alert({
                    title: 'Login',
                    template: 'Wrong User or Password'
                });
            }
        });
    }


    function logout() {

        $ionicLoading.show({
            template: 'Logging Out...'
        });

        Parse.User.logOut().then(
            function(user) {
                $ionicLoading.hide();
                $state.go('splash');
            });
    }


    function signUp(email, password) {

        $ionicLoading.show({
            template: 'Creating Account...'
        });

        Parse.User.signUp(email, password, { email: email }).then(
            function(user) {
                $ionicLoading.hide();
                Parse.User.logIn(email, password).then(
                    function() {
                        $state.transitionTo('splash');
                    }
                );
            },
            function() {
                $ionicPopup.alert({
                    title: 'Username Taken',
                    template: 'Username taken, try another one.'
                });
            }
        );
    }


    function socialLogin(email, password) {

        $ionicLoading.show({
            template: 'Logging In...'
        });

        $http.post("http://localhost:3000/socialLogin", {
                params: {
                    "email": email,
                    "password": password
                }
            })
            .success(function(response) {

                $ionicLoading.hide();

                window.localStorage['session'] = JSON.stringify(response);
                $state.transitionTo('tab.dash');

            })
            .error(function(response) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Account',
                    template: 'Service unavailable, make sure you are online.'
                });
            });
    }

    return {

        login: login,
        signUp: signUp,
        logout: logout,
        socialLogin: socialLogin

    };
});
