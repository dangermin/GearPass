angular.module('starter')

.controller('PartnerController', function($scope, $ionicModal, IonicLogin, $state, $ionicLoading, $timeout, PartnerService) {

    //show welcome message
    $scope.welcomeMessageShowing = true;

    //wait 2 seconds and then hide welcome message
    $scope.$on('$ionicView.enter', function(e) {
        //search results box is hidden
        $scope.partnerSearchResults = false;
        $scope.userSearchResults = false;
        //set current date
        $scope.currentDate = moment().format("MMMM D, YYYY").toString();
        //show welcome message
        $scope.welcomeMessageShowing = true;
        $timeout(function() {
            //hide welcome message
            $scope.welcomeMessageShowing = false;
        }, 2000);

        //get a count of current PARTNERS
        var PartnerQuery = new Parse.Query('Shop');
        PartnerQuery.count({
            success: function(count) {
                $scope.partnerCount = count;
            },
            error: function(err) {
                console.log("error getting partners");
            }
        });

        //get a count of current USERS
        var UserQuery = new Parse.Query('User');
        UserQuery.count({
            success: function(count) {
                $scope.userCount = count;
            },
            error: function(err) {
                console.log("error getting users");
            }
        });
    });


    // define email input variable
    $scope.partnerSearch = { "email": "" };
    //define shop search results variable
    $scope.thisShop;
    //function called when searching for partners 
    $scope.searchPartners = function() {
        var email = $scope.partnerSearch.email;
        PartnerService.SearchPartners(email);
        $timeout(function() {
            $scope.userSearchResults = false;
            $scope.partnerSearchResults = true;
            $scope.thisShop = PartnerService.thisShop;
            console.log($scope.thisShop);
            $scope.partnerSearch = { "email": "" };
        }, 1000);
    }



    //set user email search variable
    $scope.userSearch = { "email": "" };
    //set search results variable
    $scope.thisUser;
    //function called when searching users
    $scope.searchUsers = function() {
        var email = $scope.userSearch.email;
        PartnerService.SearchUsers(email);
        $timeout(function() {
            $scope.partnerSearchResults = false;
            $scope.userSearchResults = true;
            $scope.thisUser = PartnerService.thisUser;
            $scope.userSearch = { "email": "" };
        }, 1000);
    }



    //define the PARTNER modal
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //define PARTNER variables for this scope
    $scope.ShopName = { value: "" };
    $scope.EmailAddress = { value: "" };
    $scope.Open = { value: "" };
    $scope.Close = { value: "" };
    $scope.ContactName = { value: "" };
    $scope.Phone = { value: "" };
    $scope.Location = { value: "" };
    $scope.WebAddress = { value: "" };

    //function to create new PARTNER
    $scope.createPartner = function() {

        var ShopSchema = Parse.Object.extend('Shop');

        var shop = new ShopSchema();

        var location = new Parse.GeoPoint($scope.Location.value.geometry.location.lat(), $scope.Location.value.geometry.location.lng())

        shop.set('ShopName', $scope.ShopName.value);
        shop.set('EmailAddress', $scope.EmailAddress.value);
        shop.set('Hours', $scope.Open.value + "-" + $scope.Close.value);
        shop.set('ContactName', $scope.ContactName.value);
        shop.set('PhoneNumber', $scope.Phone.value);
        shop.set('WebAddress', $scope.WebAddress.value);
        shop.set('Address', $scope.Location.value.formatted_address);
        shop.set('Location', location);

        shop.save();

        $scope.modal.hide();
    }


    //function to delete partner
    $scope.deletePartner = function(address) {
        $scope.thisShop = {};
        var PQ = new Parse.Query('Shop');
        PQ.equalTo("Address", address);
        PQ.first({
            success: function(object) {
                object.destroy({
                    success: function(object) {
                        console.log("deleted");
                    },
                    error: function(err) {
                        console.log("not deleted");
                    }

                })
            },
            error: function() {
                console.log("error");
            }
        })



    }


    //function to update PARTNER 
    // $scope.updatePartner = function() {

    //     console.log($scope.thisShop.value);

    //     updateShop = $scope.thisShop.value;

    //     updateShop.set('ShopName', $scope.ShopName.value);
    //     updateShop.set
    //     updateShop.set('Hours', $scope.Open.value + "-" + $scope.Close.value);
    //     updateShop.set('ContactName', $scope.ContactName.value);
    //     updateShop.set('PhoneNumber', $scope.Phone.value);
    //     updateShop.set('WebAddress', $scope.WebAddress.value);
    //     updateShop.set('Address', $scope.Location.value.formatted_address);
    //     updateShop.set('Location', location);


    //     updateShop.save();
    //     alert('All done!');

    //     $scope.modal.hide();

    // }

});
