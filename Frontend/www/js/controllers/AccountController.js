(function() {
    'use strict';

    angular
        .module('starter')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['LoginService', '$state'];

    function AccountController(LoginService, $state) {



    }
})
