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

        $scope.requests = [];

        var query = new Parse.Query(Parse.Object.extend("Request"));
        return query.each(function(request) {
            var user = request.get('User');
            if (user.id == $scope.currentUser.id) {
                var shopName = request.get('ShopName');
                var quantity = request.get('Quantity');
                var gear = request.get('Gear');
                var date = request.get('createdAt');

                var request = { "ShopName": shopName, "Quantity": quantity, "Gear": gear, "Date": date };
                $scope.requests.push(request);
            } else {
                console.log("attempting to find request");
            }

        });

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
