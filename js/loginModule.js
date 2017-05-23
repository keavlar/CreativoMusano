(function () {

    "use strict";

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function ($scope, $http, $location, $rootScope, $timeout, $cookies) {

        // POST Request for Login
        $scope.login = function () {

            var loginEmail = $scope.loginEmail;
            var loginPassword = $scope.loginPassword;

            //  object of the login and password
            var loginDetails = {
                "email": loginEmail,
                "password": loginPassword
            }

            // In the http request to the server we send over the user details object
            $http({
                method: "POST",
                url: "/login",
                headers: { 'Content-Type': 'application/json' },
                data: loginDetails
            })

			// In response from the server we get a confimation if the user is registered or not
			.then(function (response) {
			    var status = response.data[0].registered;
			    var name = response.data[0].name;
			    var id = response.data[0].id;

			    // Makes the users name accessable on the whole site
			    $rootScope.usersName = name;

			    if (status == false) {
			        $scope.errorWarning = "Please check login details and try again";
			    }

			    else {
			        localStorage.setItem('user', name);
			        localStorage.setItem('id', id);

			        $cookies.put('user', loginDetails.email);
			        var username = $cookies.get('loginEmail');

			        //You can set the expired time with the third params
			        var today = new Date();
			        var expired = new Date(today);
			        expired.setDate(today.getDate() + 1); //Set expired date to tomorrow
			        $cookies.put('user', loginDetails.email, { expires: expired });


			        $rootScope.loggedIn = true;
			        $scope.errorWarning = "";
			        $scope.loggingIn = "Logging In...";

			        $timeout(function () {
			            $location.path("/profile");
			        }, 1000);
			    }

			});


        }

    });

})();