var warmMeal = angular.module('warmMeal', ['ngRoute', 'ngMap']);


warmMeal.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'views/splash.html'
	})
	.when('/map',{
		templateUrl: 'views/map.html',
		controller: 'mapController'
	})
	.when('/signup',{
		templateUrl: 'views/signup.html',
		controller: 'signUpController'
	})
	.when('/noavailablemeal',{
		templateUrl: 'views/nextMealAvailability.html',
		controller: 'availableController'
	})
	.when('/login',{
		templateUrl: 'views/login.html',
		controller: 'loginController'
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

warmMeal.controller('availableController', function($scope){
	$scope.time = "11:59 PM";
	$scope.date = "Tomorrow";
});

warmMeal.controller('signUpController', function($scope, $location){
	$scope.name = "";
	$scope.lastName = "";
	$scope.email = "";
	$scope.password = "";
	$scope.confirmPassword = "";
	$scope.photoId = null;

	function hasValidEntries(){
		if(!$scope.name) {
			alert('First Name cannot be blank.');
			return false;
		} else if (!$scope.lastName) {
			// All the variables are not empty and have the same correct password
			alert('Last Name cannot be blank.');
			return false;
		} else if (!$scope.email) {
			alert('Email cannot be blank.');
			return false;
		} else if(!$scope.password) {
			alert('Password cannot be blank.');
			return false;
		} else if(!$scope.confirmPassword) {
			alert('Password cannot be blank.');
			return false;
		} else if (!$scope.photoId){
			//TODO return false once we make photoID not null 
		} else if (!hasValidPassword()) {
			return false;
		}
		return true;
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
		// var userId = firebase.auth().uid

		var database = firebase.database();
		console.log("DATABASE = " + database);
		console.log("userid = " + userId);
		firebase.database().ref('users/' + userId).set({
			firstName: $scope.name,
			lastName: $scope.lastName,
			email: $scope.email,
			isBanned: false,
			lastClaimedCode: initialDate
		    // TODO: Send in photo url obtained from the camera once we integrate it with the signup process.
		    // photoId: $scope.photoId
		});
	}
	function createAccount() {
		var initialDate = new Date();
		initialDate.setDate(initialDate.getDate()-1);
		var user = firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
				// Handle Errors here.
		 		var errorCode = error.code;
				var errorMessage = error.message;
				console.log("error creating user: " + errorMessage);

				if (errorCode == 'auth/weak-password') {
					alert('The password is too weak.');
				} else {
					alert(errorMessage);
				}			
			});
		// return user;
	}

	$scope.submit = function(){
		if (hasValidEntries()) {
			//Create a new user in Firebase
			console.log("about to create account");
			createAccount();
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					console.log("THERE'S A USER");
				    // See if user exists in database
				    var userInfo = firebase.database().ref('users').child(user.uid);
				    console.log("userInfo = " + userInfo);
				    writeUserData(user.uid);				    
				}
			});
			$location.path('/map');
		}
	};
});

warmMeal.controller('loginController', function($scope){
	$scope.email = "";
	$scope.password = "";

	$scope.login = function(){
		//TODO: Verify through facial recognition and then go to new page
		console.log("login pressed");
		var user = firebaseSignIn();
	};

	function firebaseSignIn() {
		var user = firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
		  // Handle Errors here.
		  var errorMessage = error.message;
		  console.log("error logging in user: " + errorMessage);
		  alert(errorMessage);
		});
		console.log("user = " + user);
		return user;
	}	
});

warmMeal.controller('mapController', function($scope, NgMap){
	
$scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCXCvRVF0uDHz353OEUE8_NhTSKh2p4DBI";

  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });

  $scope.logout = function(){
  	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	  console.log("logout successful");
	  //TODO: go to login page
	}).catch(function(error) {
	  // An error happened.
	  console.log("logout failed");
	});
  }
});
