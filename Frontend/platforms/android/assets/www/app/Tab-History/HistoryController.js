(function() {
    'use strict';
    angular.module('starter')

    // History CONTROLLER
    .controller('HistoryController', function($scope, IonicLogin, $ionicModal, 
        $state, $ionicLoading, $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout) {

        $scope.$on('$ionicView.enter', function(e) {

        });

        $scope.preventFocus = function() {
            ionic.DomUtil.blurAll();
        }


        $scope.message = {
            text: ''
        };

        $scope.messages = [
            { id: 1, user: 'Danger', avatar: 'app/img/avatar1.png', date: 'Nov 12th', text: 'hello world!' }
        ];

        $scope.ajustarScroll = function() {
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollBottom(true);
        }

        $scope.sendMessage = function(message) {
            $scope.messages.push({ user: 'Danger', avatar: 'app/img/avatar1.png', date: '10:43 AM', text: message.text });
            $scope.message.text = '';
            $ionicScrollDelegate.scrollBottom(true);
        }

    })
})();
