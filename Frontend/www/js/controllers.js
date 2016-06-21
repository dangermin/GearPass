angular.module('starter.controllers', [])


// HOME PAGE CONTROLLER
.controller('DashCtrl', function($scope, IonicLogin, $state, $cordovaGeolocation) {


    var options = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {



        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(latLng);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        var marker = new google.maps.Marker({
            position: latLng,
            map: $scope.map,
            title: 'Your location'
        });

        // var request = {
        //     location: latLng,
        //     radius: '500',
        //     types: ['food']
        // };

        // service = new google.maps.places.PlacesService($scope.map);
        // service.nearbySearch(request, callback);


        // function callback(results, status) {
        //     if (status === google.maps.places.PlacesServiceStatus.OK) {
        //         for (var i = 0; i < results.length; i++) {
        //             createMarker(results[i]);
        //         }
        //     }
        // }

        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: place.geometry.location
            });

            var infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open($scope.map, this);
            });
        }





    }, function(error) {
        console.log("Could not get location");
    });

})

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

// LOGIN PAGE CONTROLLER
.controller('IonicLogin', function($scope, IonicLogin, $ionicLoading, $http, $cordovaFacebook, $state, $cordovaOauth) {

    // REMOVE THE USER LOGIN INFORMATION WHEN RETURNING TO LOGIN SCREEN
    $scope.$on('$ionicView.enter', function(e) {
        $scope.data = {};
    });

    // LOGIN FUNCTION
    $scope.login = function() {
        IonicLogin.login($scope.data.email, $scope.data.password);
    }

    // SIGNUP FUNCTION
    $scope.signUp = function() {
        IonicLogin.signUp($scope.data.email, $scope.data.password);
    }

    // FACEBOOK LOGIN
    $scope.facebookLogin = function() {
        $cordovaFacebook.login(["public_profile", "email"]).then(
            function(success) {
                console.log(JSON.stringify(success));
                var expiration_date = new Date();
                expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
                expiration_date = expiration_date.toISOString();

                var facebookAuthData = {
                    "id": success.authResponse.userID,
                    "access_token": success.authResponse.accessToken,
                    "expiration_date": expiration_date
                };

                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: function(user) {
                        console.log(JSON.stringify(user));
                        if (!user.existed()) {
                            alert('User signed up and logged in through Facebook');
                        }
                        $state.go('tab.dash');
                    },
                    error: function(user, error) {
                        alert('User cancelled the Facebook login or did not fully authorize');
                    }
                });
            },
            function(error) {
                alert('stuff');
                console.log(JSON.stringify(error));
            }
        );
    }

    // GOOGLE PLUS LOGIN
    $scope.googleLogin = function() {

        var clientId = "354997883795-kmlif1hd8unv62bl3afhi9mj4fv77ere.apps.googleusercontent.com";



        $cordovaOauth.google(clientId, ["email"]).then(function(result) {
            console.log("Response Object ->" + JSON.stringify(result));
            $state.go('tab.dash');
        }, function(error) {
            console.log("Error ->" + error);
        });


        // // CREATE A PROJECT ON GOOGLE DEVELOPER CONSOLE AND PUT YOUR CLIENT ID HERE
        // // GOOGLE OAUTH DOES NOT GIVE US EMAIL RIGHT AWAY SO WE HAVE TO MAKE 2 API CALLS
        // $cordovaOauth.google("584540832467-tv8i4a8utt7tk5aih3ej8a6gc65sjk87.apps.googleusercontent.com", ["email"], { redirect_uri: "http://localhost/callback" }).then(function(result) {
        //     //   alert("Response Object -> " + JSON.stringify(result));

        //     $http.get("https://www.googleapis.com/plus/v1/people/me", // TO GET THE USER'S EMAIL
        //             {
        //                 params: {
        //                     access_token: result.access_token,
        //                     key: "584540832467-tv8i4a8utt7tk5aih3ej8a6gc65sjk87.apps.googleusercontent.com"
        //                 }
        //             })
        //         .then(function(user) {
        //             //      alert(JSON.stringify(user));
        //             IonicLogin.socialLogin(user.data.emails[0].value, result.access_token); // USING ID TO GENERATE A HASH PASSWORD
        //         });
        // });
    }

    // // TWITTER LOGIN
    // $scope.twitterLogin = function() {

    //     // YOUR TWITTER CALLBACK WILL HAVE TO BE HTTP://LOCALHOST/CALLBACK FOR TESTING BUT
    //     // IT NEEDS TO BE SET VIA TINYURL.COM
    //     var consumerKey = "fMNg8ecQmeOTHNFGgJKsGwYbw"; // PUT YOUR CONSUMER KEY HERE
    //     var consumerSecretKey = "cPOHMNSrDXLb1dXrVQP0e3CaeSlVGONzYgGq92gpPh38q9g51Q"; // PUT YOUR SECRET KEY HERE
    //     var oathToken = ""
    //     var oathSecret = "";

    //     $cordovaOauth.twitter(consumerKey, consumerSecretKey)
    //         .then(function(result) {
    //             // alert(JSON.stringify(user));
    //             oathToken = result.oauth_token;
    //             oathSecret = result.oauth_token_secret;

    //             // IF YOU WANT TO GET TWITTER USERS EMAIL ADDRESS YOU WILL HAVE TO WHITELIST YOUR APP WITH TWITTER
    //             // THEY DO NOT ALLOW IT BY DEFAULT
    //             // https://dev.twitter.com/rest/reference/get/account/verify_credentials
    //             IonicLogin.socialLogin(result.screen_name, result.user_id); // USING ID TO GENERATE A HASH PASSWORD
    //         });
    // }

    // // INSTAGRAM LOGIN
    // $scope.instagramLogin = function() {

    //     var clientID = "a0c936f91d4d4219b3230fb96650216d"; // PUT YOUR CLIENT ID HERE
    //     var redirectURL = "http://tinyurl.com/krmpchb" // PUT YOUR REDIRECT URL HERE

    //     $cordovaOauth.instagram(clientID, ["basic"], { redirect_uri: redirectURL })
    //         .then(function(result) {
    //             // INSTAGRAM OAUTH DOES NOT GIVE US USERNAME SO WE HAVE TO MAKE 2 API CALLS
    //             $http.get("https://api.instagram.com/v1/users/self/", // TO GET THE USERSNAME
    //                     { params: { access_token: result.access_token } })
    //                 .then(function(user) {
    //                     //     alert(JSON.stringify(user));
    //                     IonicLogin.socialLogin(user.data.data.username, result.access_token); // USING ID TO GENERATE A HASH PASSWORD
    //                 });
    //         });
    // }
})

// CHAT CONTROLLER
.controller('ChatsCtrl', function($scope, $stateParams, IonicLogin) {

})

// ACCOUNT SETTINGS CONTROLLER
.controller('ProfileCtrl', function($scope, $ionicModal, IonicLogin, $state) {

    activate();


    function activate() {
        var currentUser = Parse.User.current().id;

        var emailQuery = new Parse.Query('User');
        emailQuery.get(currentUser, {
            success: function(object) {
                $scope.displayEmail = { "email": object.get('email') };
            },

            error: function(object, error) {
                // error is an instance of Parse.Error.
            }
        });

        var profileQuery = new Parse.Query('PublicProfile');
        profileQuery.get(currentUser, {
            success: function(object) {
                $scope.ppFirstName = { "value": object.get('FirstName') };
                $scope.ppLastName = { "value": object.get('LastName') };
                $scope.ppAdjective = { "value": object.get('Adjective') };
            },

            error: function(object, error) {
                // error is an instance of Parse.Error.
            }
        });

        
        var query = new Parse.Query(Parse.Role);
        query.get('DCb5bDvloZ', {
            success: function(role) {
                var users = role.getUsers().query().find({
                    success: function(result) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].id == currentUser) {
                                $scope.Partner = { "value": true };
                            } else {
                                $scope.User = { "value": true };
                            }
                        }
                    },
                    error: function(result) {

                    }
                });
                console.log(users);
            },

            error: function(role, error) {
                // error is an instance of Parse.Error.
            }
        });

    };
    $scope.logout = function() {
        console.log('DashCtrl - logout');
        Parse.User.logOut().then(function() {
            window.localStorage['session'] = "";
            $state.go('login');
        });
    }

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/profileModal.html', {
        scope: $scope
    }).then(function(profileModal) {
        $scope.profileModal = profileModal;
    });

    $scope.ShopName = { shopName: "" };
    $scope.Open = { open: "" };
    $scope.Close = { close: "" };
    $scope.ContactName = { contactName: "" };
    $scope.Phone = { phone: "" };
    $scope.Boards = { boards: "" };
    $scope.Location = { location: "" };
    $scope.WebAddress = { webAddress: "" };


    $scope.addAShopToCurrentUser = function() {

        query = new Parse.Query(Parse.Role);
        query.equalTo("name", "Partner");
        query.first({
            success: function(role) {
                role.getUsers().add(Parse.User.current());
                role.save();
            },
            error: function(error) {
                throw "Got an error " + error.code + " : " + error.message;
            }
        });

        var ShopSchema = Parse.Object.extend('Shop');

        var shop = new ShopSchema();

        shop.set('User', Parse.User.current());
        shop.set('ShopName', $scope.ShopName.shopName);
        shop.set('Hours', $scope.Open.open + "-" + $scope.Close.close);
        shop.set('ContactName', $scope.ContactName.contactName);
        shop.set('PhoneNumber', $scope.Phone.phone);
        shop.set('WebAddress', $scope.WebAddress.webAddress);
        shop.set('Location', $scope.Location.location.formatted_address);
        shop.set('Lat', parseInt($scope.Location.location.geometry.location.lat()));
        shop.set('Lng', parseInt($scope.Location.location.geometry.location.lng()));

        shop.save().then(
            function(newShop) {
                var promises = [];

                for (var i = 0; i < $scope.Boards.boards; i++) {
                    var GearSchema = Parse.Object.extend('Gear');

                    var gear = new GearSchema();

                    gear.set('Name', 'Surfboard #' + (i + 1));
                    gear.set('Shop', $scope.ShopName.shopName + Parse.User.current().id);

                    promises.push(gear.save());
                }

                Promise.all(promises).then(function() {
                    alert('All done!');
                });
            },
            function(err) {

            }
        );


        $scope.modal.hide();
    }

    $scope.ppFirstName = { "value": "" };
    $scope.ppLastName = { "value": "" };
    $scope.ppAdjective = { "value": "" };

    $scope.addPublicProfileToCurrentUser = function() {

        var PublicProfileSchema = Parse.Object.extend('PublicProfile');

        var pp = new PublicProfileSchema();

        pp.set('User', Parse.User.current());
        pp.set('FirstName', $scope.ppFirstName.value);
        pp.set('LastName', $scope.ppLastName.value);
        pp.set('Adjective', $scope.ppAdjective.value);


        pp.save();


        $scope.profileModal.hide();
    }
});
