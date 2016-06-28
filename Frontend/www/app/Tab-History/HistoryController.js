(function() {
    'use strict';
    angular.module('starter')

    // History CONTROLLER
    .controller('HistoryController', function($scope, $state, $ionicLoading,
        $ionicScrollDelegate, $timeout) {
        //IonicLogin, $ionicModal, $ionicSideMenuDelegate,
        // $scope.$on('$ionicView.enter', function(e) {

        // });

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
            // var MessageSchema = Parse.Object.extend('MessageSchema');

            // var messages = new MessageSchema();

            // messages.set('User', Parse.User.current());
            // console.log(User);
            // // messages.set('ShopName', Parse.Shop.ShopName.value);
            // messages.set('Text', $scope.Text.value);
            // messages.set('Date', $scope.Date.value);

            // messages.save();
            // alert('All done!');


            $scope.messages.push({ user: 'Danger', avatar: 'app/img/avatar1.png', date: '10:43 AM', text: message.text });
            $scope.message.Text = '';
            $ionicScrollDelegate.scrollBottom(true);
        }
    })
})();
