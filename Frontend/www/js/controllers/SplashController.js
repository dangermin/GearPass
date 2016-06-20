(function() {
    'use strict';

    angular
        .module('starter')
        .controller('SplashController', SplashController);

    SplashController.$inject = ['$scope', '$state', '$window', '$http'];

    function SplashController($scope, $state, $window, $http) {

        $scope.$on("$ionicView.enter", function(event) {
            $scope.checkSession();
        });

        $scope.checkSession = function() {
            if (Parse.User.current()) {
                $state.go('tab.dash');
            } else {
                $state.go('login');
            };
        };
    }
});
