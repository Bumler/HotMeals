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
	$scope.confirmPassword = "";

	function hasValidEntries(){
		if($scope.name && $scope.lastName && $scope.email && $scope.password && $scope.confirmPassword && hasValidPassword()) {
			// All the variables are not empty and have the same correct password
			return true;
		}
		return false;
	}

	// Password must equal the confirm password and be more than 6 characters
	function hasValidPassword() {
		// TODO: Notify user that their passwords didn't match. 
		if ($scope.password.length >=8 && $scope.password === $scope.confirmPassword) {
			return true
		}
		alert('The passwords must be at least 8 characters and match.')
		return false
	}

	function writeUserData(userId) {
		// Setting the date for the lastClaimedCode to be 1 day earlier than the current time because firebase won't allow null entries.
		// This allows new users to be able to get a Hot Meal right away without us having to set the date to null initially.
		var initialDate = new Date();
		initialDate.setDate(initialDate.getDate()-1);
		

		var database = firebase.database();
		console.log("DATABASE = " + database);

		var test = firebase.database().ref('users/' + userId);
		test.set({
		    firstName: $scope.name,
		    lastName: $scope.lastName,
		    email: $scope.email,
		    isBanned: false,
		    lastClaimedCode: initialDate
		    // TODO: Send in photo url obtained from the camera once we integrate it with the signup process.
		    // photoID: imageUrl
		});
	}

	$scope.submit = function(){
		console.log("check");
		if (hasValidEntries()) {
			// Create a new user in Firebase
			// var user = firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
			// 	// Handle Errors here.
			// 	var errorCode = error.code;
			//  	var errorMessage = error.message;
			//  	console.log("error creating user: " + errorMessage);
			  
			// 	if (errorCode == 'auth/weak-password') {
		 //        alert('The password is too weak.');
		 //        } else {
		 //          alert(errorMessage);
		 //        }
			// });

			// writeUserData(user);
			
			

			// TODO: Goto the homepage.
		}
	};
});

