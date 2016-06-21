angular.module('starter')


.controller('SplashController', function($scope, $state, $window, $http) {

    $scope.$on("$ionicView.enter", function(event) {
        $scope.checkSession();
    });

    $scope.checkSession = function() {
        if (Parse.User.current()) {
            $state.go('tab.dash');
        } else {
            $state.go('login');
        }
    }
})