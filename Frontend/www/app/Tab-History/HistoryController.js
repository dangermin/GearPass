(function() {
    'use strict';
    angular.module('starter')

    // History CONTROLLER
    .controller('HistoryController', function($scope, $state, $ionicLoading, $ionicScrollDelegate, $timeout) {
        //IonicLogin, $ionicModal, $ionicSideMenuDelegate,
        // $scope.$on('$ionicView.enter', function(e) {

        // });

        $scope.preventFocus = function() {
            ionic.DomUtil.blurAll();
        }


        $scope.$on('$ionicView.enter', function(e) {

            $ionicLoading.show({
                template: 'Fetching History...'
            });

            $scope.requests = [];

            var query = new Parse.Query("Request");
            var query2 = new Parse.Query('Shop');
            query.each(function(request) {
                var req = request;
                var user = request.get('User');
                var shop = request.get('Shop');
                query2.get(shop.id, {
                    success: function(object) {
                        if (user.id == $scope.currentUser.id) {
                            var newShop = object;
                            var shopName = newShop.get('ShopName');
                            var address = newShop.get('Address');
                            var phone = newShop.get('PhoneNumber');
                            var hours = newShop.get('Hours');
                            var completed = req.get('Completed');
                            var quantity = req.get('Quantity');
                            var gear = req.get('Gear');
                            var date = req.get('createdAt');
                            var prettyDate = moment(date).format('dddd, MMMM Do YYYY');
                            var prettyTime = moment(date).format('h:mm a');


                            var request = {
                                "ShopName": shopName,
                                "Address": address,
                                "Phone": phone,
                                "Hours": hours,
                                "Completed": completed,
                                "Quantity": quantity,
                                "Gear": gear,
                                "Date": prettyDate,
                                "Time": prettyTime,
                                "Created": date
                            };


                            $scope.$apply(function() {
                                $scope.requests.push(request);
                            });
                            console.log($scope.requests);
                        } else {
                            console.log("attempting to find request");
                        }
                    },

                    error: function(object, error) {
                        console.log(error);
                    }
                });


                $ionicLoading.hide();
            });
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
