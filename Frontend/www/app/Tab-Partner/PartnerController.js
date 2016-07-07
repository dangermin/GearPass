angular.module('starter')

.controller('PartnerController', function($scope, $ionicModal, IonicLogin, $state, $ionicLoading, $timeout) {

    //search results box is hidden
    $scope.partnerSearchResults = false;
    $scope.userSearchResults = false;


    //set current date
    $scope.currentDate = { "value": new moment().format("MMM d, YYYY").toString() };

    //show welcome message
    $scope.welcomeMessageShowing = true;

    //wait 2 seconds and then hide welcome message
    $scope.$on('$ionicView.enter', function(e) {
        $scope.welcomeMessageShowing = true;
        $timeout(function() {
            $scope.welcomeMessageShowing = false;
        }, 2000);
    });

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

    // define email input variable
    $scope.partnerSearch = { "email": "" };

    //define shop search results variable
    $scope.thisShop;

    //function called when searching for partners 
    $scope.searchPartners = function() {

        var thisShop = {
            "ShopName": "",
            "Hours": "",
            "ContactName": "",
            "PhoneNumber": "",
            "WebAddress": "",
            "Address": "",
            "Location": "",
            "Pending": ""
        };

        var pendingQuery = new Parse.Query('Request');
        var email = $scope.partnerSearch.email;
        PartnerQuery.equalTo('EmailAddress', email);
        PartnerQuery.first({
            success: function(partner) {
                if (!partner) {
                    console.log("coulcn't find partner");
                } else {
                    pendingQuery.equalTo('Shop', partner);
                    pendingQuery.equalTo('Completed', false);
                    pendingQuery.count({
                        success: function(count) {
                            thisShop.Pending = count;
                            thisShop.ShopName = partner.get('ShopName');
                            thisShop.Hours = partner.get('Hours');
                            thisShop.ContactName = partner.get('ContactName');
                            thisShop.PhoneNumber = partner.get('PhoneNumber');
                            thisShop.WebAddress = partner.get('WebAddress');
                            thisShop.Address = partner.get('Address');
                            thisShop.Location = partner.get('Location');
                            $scope.$apply(function() {
                                $scope.userSearchResults = false;
                                $scope.partnerSearchResults = true;
                                $scope.thisShop = thisShop;
                                $scope.partnerSearch = { "email": "" };

                            })
                        },
                        error: function(err) {
                            console.log(err);
                        }

                    })
                }

            },
            error: function(partner, err) {
                alert('could not find partner with that email address');
                console.log(err);
            }
        })
    }


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

    //set user email search variable
    $scope.userSearch = { "email": "" };

    //set search results variable
    $scope.thisUser;

    //function called when searching users
    $scope.searchUsers = function() {

        var thisUser = {
            "First": "",
            "Last": "",
            "Email": ""
        };

        var email = $scope.userSearch.email;
        UserQuery.equalTo('email', email);
        UserQuery.first({
            success: function(user) {
                if (!user) {
                    console.log("coulcn't find user");
                } else {
                    thisUser.First = user.get('first');
                    thisUser.Last = user.get('last');
                    thisUser.Email = user.get('email');
                    thisUser.MembershipTier = user.get('MembershipTier');
                }
                $scope.$apply(function() {
                    $scope.partnerSearchResults = false;
                    $scope.userSearchResults = true;
                    $scope.thisUser = thisUser;
                    $scope.userSearch = { "email": "" };

                })
            },
            error: function(user, err) {
                alert('could not find user with that email address');
                console.log(err);
            }
        })
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

        shop.save()

        $scope.modal.hide();
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
