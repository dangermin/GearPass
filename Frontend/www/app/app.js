// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ion-google-place', 'ngCordova', 'uiGmapgoogle-maps', 'ngCordovaOauth'])

.run(function($ionicPlatform, APP_CONFIG) {

    Parse.initialize(APP_CONFIG.PARSE_APP_ID);
    Parse.serverURL = APP_CONFIG.PARSE_SERVER_URL;

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


        .state('splash', {
        url: '/splash',
        templateUrl: 'app/Splash/splash.html',
        controller: 'SplashController'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'app/Login/login.html',
        controller: 'LoginController'
    })

    .state('payment', {
        url: '/payment',
        templateUrl: 'app/Payment/payment.html',
        controller: 'PaymentController'
    })

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'app/Tab/tab.html',
        controller: 'TabController'
    })

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'app/Tab-Dash/tab-dash.html',
                controller: 'DashController'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'app/Tab-Chats/tab-chats.html'
            }
        }
    })

    .state('tab.profile', {
        url: '/profile',
        views: {
            'tab-profile': {
                templateUrl: 'app/Tab-Profile/tab-profile.html',
                controller: 'ProfileController'
            }
        }
    })

    .state('tab.partner', {
        url: '/partner',
        views: {
            'tab-partner': {
                templateUrl: 'app/Tab-Partner/tab-partner.html',
                controller: 'PartnerController'
            }
        }
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('splash');

});
