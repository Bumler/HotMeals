var warmMeal = angular.module('warmMeal', ['ngRoute', 'ngMap', 'webcam']);


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
	.when('/verify',{
		templateUrl: 'views/verifySelection.html'
	})
	.otherwise({
		redirectTo: '/'
	});

}]);


// WarmMeal.run(function(){
// 	//fires at run-time
// });

warmMeal.service('WebcamService', function(){
 var webcam = {};
        webcam.isTurnOn = false;
        webcam.patData = null;
        var _video = null;
        var _stream = null;
        webcam.patOpts = {x: 0, y: 0, w: 25, h: 25};
        webcam.channel = {};
        webcam.webcamError = false;

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };

        var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
            webcam.snapshotData = imgBase64;
        };

        webcam.makeSnapshot = function() {
            if (_video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData(webcam.patOpts.x, webcam.patOpts.y, webcam.patOpts.w, webcam.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);

                sendSnapshotToServer(patCanvas.toDataURL());

                webcam.patData = idata;

                webcam.success(webcam.snapshotData.substr(webcam.snapshotData.indexOf('base64,') + 'base64,'.length), 'image/png');
                webcam.turnOff();
            }
        };

        webcam.onSuccess = function () {
            _video = webcam.channel.video;
            webcam.patOpts.w = _video.width;
            webcam.patOpts.h = _video.height;
            webcam.isTurnOn = true;
        };

        webcam.onStream = function (stream) {
            activeStream = stream;
            return activeStream;
        };

        webcam.downloadSnapshot = function downloadSnapshot(dataURL) {
            window.location.href = dataURL;
        };

        webcam.onError = function (err) {
            webcam.webcamError = err;
        };

        webcam.turnOff = function () {
            webcam.isTurnOn = false;
            if (activeStream && activeStream.getVideoTracks) {
                const checker = typeof activeStream.getVideoTracks === 'function';
                if (checker) {
                    return activeStream.getVideoTracks()[0].stop();
                }
                return false;
            }
            return false;
        };

        var service = {
            webcam: webcam
        };
        return service;
});

warmMeal.controller('warmMealController', function($scope){
	$scope.message = 'test';
});

warmMeal.controller('availableController', function($scope){
	$scope.time = "11:59 PM";
	$scope.date = "Tomorrow";
});

warmMeal.controller('signUpController', function($scope, $location, WebcamService){

	$scope.name = "";
	$scope.lastName = "";
	$scope.email = "";
	$scope.password = "";
	$scope.confirmPassword = "";
	$scope.photoId = null;

	$scope.takingPhoto = true;


        $scope.vm = this;
        
        $scope.showweb = true;
        $scope.webcam = WebcamService.webcam;
       
        //override function for be call when capture is finalized
        $scope.webcam.success = function(image, type) {
            console.log("IMAGE = " + photo);
            $scope.photo = image;
            $scope.fotoContentType = type;
            $scope.showweb = false;
        };

        function turnOffWebCam() {
            if($scope.webcam && $scope.webcam.isTurnOn===true)
                $scope.webcam.turnOff();
        };
  

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
			alert('No photo was taken.');
			return false;
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

		var storageRef = firebase.storage().ref();
		var database = firebase.database();
		console.log("DATABASE = " + database);
		console.log("userid = " + userId);
		firebase.database().ref('users/' + userId).set({
			firstName: $scope.name,
			lastName: $scope.lastName,
			email: $scope.email,
			isBanned: false,
			lastClaimedCode: initialDate
		});

		// Upload the file and metadata
		var uploadTask = storageRef.child(photoId).put(file);
		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		uploadTask.on('state_changed', function(snapshot){
		  // Observe state change events such as progress, pause, and resume
		  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		  console.log('Upload is ' + progress + '% done');
		  switch (snapshot.state) {
		    case firebase.storage.TaskState.PAUSED: // or 'paused'
		      console.log('Upload is paused');
		      break;
		    case firebase.storage.TaskState.RUNNING: // or 'running'
		      console.log('Upload is running');
		      break;
		  }
		}, function(error) {
		  // Handle unsuccessful uploads
		  console.log('There was an error uploading your account');
		}, function() {
		  // Handle successful uploads on complete
		  var downloadURL = uploadTask.snapshot.downloadURL;

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

warmMeal.controller('loginController', function($scope, $location){
	$scope.email = "";
	$scope.password = "";

	$scope.takingPhoto = true;


        $scope.vm = this;
        
        $scope.showweb = true;
        $scope.webcam = WebcamService.webcam;
       
        //override function for be call when capture is finalized
        $scope.webcam.success = function(image, type) {
            console.log("IMAGE = " + photo);
            $scope.photo = image;
            $scope.fotoContentType = type;
            $scope.showweb = false;
        };

        function turnOffWebCam() {
            if($scope.webcam && $scope.webcam.isTurnOn===true)
                $scope.webcam.turnOff();
        };

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
		$location.path('/map');
		return user;
	}	

	//Work for Microsoft's Face Recognition API
  	function facialRecognition() {
      var faceIdFirebase = null;
      var faceIdCurrentPicture = currentPhoto;
        var params = {
          // Request parameters

          //dataType: "json",
          //contentType: "application/json",
          // "Ocp-Apim-Subscription-Key": “a528031d6c2e43478f9ae9cda40674b2”,
        };
      
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/face/v1.0/verify?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                // xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",“a528031d6c2e43478f9ae9cda40674b2”);
            },
            type: "POST",
            // Request body
            data: faceIdFirebase, faceIdCurrentPicture,
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    }

    function getBody(photoUrl) {
      var params = {
            // Request parameters
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
        };
      
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                // xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",“a528031d6c2e43478f9ae9cda40674b2”);
            },
            type: "POST",
            // Request body
            data: "photoUrl",
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
    }
});

warmMeal.controller('mapController', function($scope, NgMap){

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
