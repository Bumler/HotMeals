var warmMeal = angular.module('warmMeal', ['ngRoute']);


warmMeal.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'views/splash.html'
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