(function () {

    "use strict";

    var appModule = angular.module("appModule", ["ngRoute",
												 "ngCookies",
												 "youtube-embed",
												 "homepageModule",
												 "loginModule",
												 "registerModule",
												 "profileModule",
												 "editModule",
												 "playModule"
    ]);

    appModule.config(function ($routeProvider) {

        $routeProvider

		.when("/", {
		    controller: "HomepageController",
		    templateUrl: "html/homepageView.html"
		})

		.when("/login", {
		    controller: "LoginController",
		    templateUrl: "html/loginView.html"
		})

		.when("/register", {
		    controller: "RegisterController",
		    templateUrl: "html/registerPageView.html"
		})

		.when("/profile", {
		    controller: "ProfileController",
		    templateUrl: "html/profilePageView.html"
		})

		.when("/edit", {
		    controller: "EditController",
		    templateUrl: "html/editView.html"
		})

		.when("/play", {
		    controller: "PlayController",
		    templateUrl: "html/playView.html"
		})

		.otherwise({
		    redirectTo: "/"
		});

    });

    appModule.directive("ngPageRights", function () {
        var d = new Date();
        var year = d.getFullYear();
        return {
            template: '<p>&copy; CreativoMusano ' + year + '</p>'
        };
    });

})();