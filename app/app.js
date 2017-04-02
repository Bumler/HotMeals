var warmMeal = angular.module('warmMeal', ['ngRoute']);


warmMeal.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'views/splash.html'
		})
		.when('/map',{
			templateUrl: 'views/map.html'
		})
		.when('/signup',{
			templateUrl: 'views/signup.html',
			controller: 'signUpController'
		})
		.when('/map',{
			templateUrl: 'views/map.html'
		})
		.otherwise({
			redirectTo: '/'
		});

}]);

// WarmMeal.run(function(){
// 	//fires at run-time
// });

warmMeal.controller('warmMealController', function($scope){
	$scope.message = 'test';
});

warmMeal.controller('signUpController', function($scope){
	$scope.name = "";
	$scope.lastName = "";
	$scope.email = "";
	$scope.password = "";

	$scope.submit = function(){
		
	};
});