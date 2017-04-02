// Taking care of search bar 


		$("#foodpref-text-form")
		.focus(function() {
			if (this.value === this.defaultValue) {
				this.value = '';
			}
		})
		.blur(function() {
			if (this.value === '') {
				this.value = this.defaultValue;
			}
		});

	// Taking care of google map

	//default values
	var currentQuery = "restaurants";
	var currentSearchRadius = "1000";	


	var map;
	var myLocation =  {lat: 34.069845, lng: -118.246329};

	var addedMarkers = [];

	var fpbutton = document.getElementById("foodpref-button");
	fpbutton.addEventListener("click", function(){
		currentQuery = document.getElementById("foodpref-text-form").value + " restaurants";
		myLocation = map.getCenter();	
		findRestaurants();
	})


	function initMap() {

		// Options for the google map that will be displayed
		// Center should correspond to the users' current location
		var mapOptions = {
			center: myLocation,
			zoom: 15,
			mapTypeControl: false,
			streetViewControl: false,
			rotateControl: false	
		};		

		// Create the base map that will be displayeds
		map = new google.maps.Map(document.getElementById('restoMap'), mapOptions);

		findRestaurants();

	}

	function findRestaurants(){


		for(var i=0;i<addedMarkers.length;i++){
			addedMarkers[i].setMap(null);
		}	
		addedMarkers = [];

	   	// Request JSON for for using the Google Places API
	   	// the api will be used to retrieve restaurants within 1000m of the user's location
	   	var request = {
	   		location: map.getCenter(),
	   		radius: currentSearchRadius,
	   		query: currentQuery
	   	};

		// Send the request and call the addRestaurantMarkers
		// to include the restaurants on the map being shows
		var googPlaceService = new google.maps.places.PlacesService(map);
		googPlaceService.textSearch(request, addRestaurantMarkers);
	}


	function addRestaurantMarkers(results, status) {
		// If request was successful
		if (status == google.maps.places.PlacesServiceStatus.OK) {

			// Iterate through ALL restaurants, add their markers, and add the popup info for each marker
			for (var i = 0; i < results.length; i++) {
				var place = results[i];

				// adds the marker to the map at a specified location
				var newMarker = new google.maps.Marker({
					position: results[i].geometry.location,
					map: map
				});		

				// place holder variable for information about how many means a restaurant can provide
				var mealCountInfo = Math.floor(Math.random()*10);

				// place holder variable for type of food that a restaurant will provid
				// var foodType = "Vegan, Vegetarian, Gluten-Free, Organic";
				// <div class=&quot;riw-row&quot;><span class=&quot;riw-title&quot;> Food: </span>  	<span class=&quot;riw-data&quot;>" + foodType + "</span> </div> 

				// Creates the info window aka popup
				var newInfoWindow = new google.maps.InfoWindow({
					content: 
					"<div class=&quot;resto-info-window&quot;><div class=&quot;riw-row&quot;><span class=&quot;riw-title&quot;> " +  results[i].name + "  </span>	<span class=&quot;riw-data&quot;></span></div><div class=&quot;riw-row&quot;> <span class=&quot;riw-title&quot;> Meal Count: </span><span class=&quot;riw-data&quot;> " + mealCountInfo + " </span>  </div> </div>"
				});


				// Adds the popup event listener
				newMarker.addListener('mouseover', addPopupEvListOpen(map, newMarker, newInfoWindow));
				newMarker.addListener('mouseout', addPopupEvListClose(map, newMarker, newInfoWindow));
				addedMarkers.push(newMarker);
			}
		}
	}

	function addPopupEvListOpen(map, marker, newInfoWindow){
		return function(){
			newInfoWindow.open(map, marker);
		};
	}

	function addPopupEvListClose(map, marker, newInfoWindow){
		return function(){
			newInfoWindow.close(map, marker);
		};
	}
