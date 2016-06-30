angular.module('starter')

.factory('$cordovaLaunchNavigator', function($http, $q, $log, $state, $ionicLoading) {
            var $cordovaLaunchNavigator = {}
            $cordovaLaunchNavigator.navigate = function(destination, options) {
                var q = $q.defer(),
                    isRealDevice = ionic.Platform.isWebView();

                if (!isRealDevice) {
                    q.reject("Navigator will only work on a real mobile device");
                } else {
                    try {

                        var successFn = options.successCallBack || function() {},
                            errorFn = options.errorCallBack || function() {},
                            _successFn = function() {
                                successFn();
                                q.resolve();
                            },
                            _errorFn = function(err) {
                                errorFn(err);
                                q.reject(err);
                            };

                        options.successCallBack = _successFn;
                        options.errorCallBack = _errorFn;

                        launchnavigator.navigate(destination, options);
                    } catch (e) {
                        q.reject("Exception: " + e.message);
                    }
                }
                return q.promise;
            };

            return $cordovaLaunchNavigator;
        })
