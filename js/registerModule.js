(function () {

    "use strict";

    var registerModule = angular.module("registerModule", []);

    registerModule.controller("RegisterController", function ($scope, $http, $location, $timeout, $rootScope, $cookies) {

        // This function is used to register a new user
        $scope.register = function () {

            // Here we access the values that the user enters
            var name = $scope.registerName;
            var email = $scope.registerEmail;
            var password = $scope.registerPassword;
            if (!name || !email || !password) {
                return;
            }


            var newUser = {
                "name": name,
                "email": email,
                "password": password
            }

            // We use this method to send the user object to the server
            $http({
                method: 'POST',
                url: '/register',
                headers: { 'Content-Type': 'application/json' },
                data: newUser

            })

            .then(function (response) {
                var name = response.data.name;
                var id = response.data._id;
                $rootScope.usersName = name;

                if (response.status != 200) {
                    $scope.errorWarning = "Please check login details and try again";
                }

                else {
                    //If the user logs in we set a session token with the users name
                    localStorage.setItem('user', name);
                    localStorage.setItem('id', id);

                    $cookies.put('user', response.data.email);
                    var username = $cookies.get('loginEmail');

                    //You can set the expired time with the third params
                    var today = new Date();
                    var expired = new Date(today);
                    expired.setDate(today.getDate() + 1); //Set expired date to tomorrow
                    $cookies.put('user', response.data.email, { expires: expired });

                    $rootScope.loggedIn = true;

                    $timeout(function () {
                        $location.path("/profile");
                    }, 1000);
                }

            });
        }

    });

})();