var map;
var directionsService;
var routeArray = [];
var calculate = document.getElementById("btn");
var midpoint;

function initialize(){
  directionsService = new google.maps.DirectionsService();
  var mapProp = {
    center:new google.maps.LatLng(lat, lon), 
    zoom:12,
    mapTypeID:google.maps.MapTypeId.ROADMAP,
    maxZoom: 16
  };
  
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

function addMarker(){
  var newMark = new google.maps.Marker({
  	position: new google.maps.LatLng(lat,lon), 
  	map:map
  });	
} 

function calcRoute(startLoc, endLoc){
  // for (i = 0; i < markerArray.length; i++){
  //   markerArray[i].setMap(null);
  // }

  var request = {
    origin: startLoc,
    destination: endLoc,
    travelMode: google.maps.TravelMode.TRANSIT,
    transitOptions:{
      departureTime: new Date()
    }   
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var directionResults = response;
      // var warnings = document.getElementById("warnings_panel") 
      // warnings = " " + response.routes[0].warnings + " ";
    } else {
      console.log("error: "+status);
    }
    routeArray.push(directionResults);
  });
}

function midWay(){
  var longestRoute = findLongestRoute();
  var middleOfOverviewPath = Math.floor(longestRoute.routes[0].overview_path.length / 2);
  var midLat = longestRoute.routes[0].overview_path[middleOfOverviewPath].d;
  var midLong = longestRoute.routes[0].overview_path[middleOfOverviewPath].e;
  var newMark = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(midLat, midLong),
    map:map
  });
  midpoint = [newMark.position.d, newMark.position.e];
}

function findDuration(directions){
  return directions.routes[0].legs[0].duration.value;
}

function findRoutes(addresses){
  routeArray = [];
  for (var start = 0; start < addresses.length; start++){
    for (var end = start + 1; end < addresses.length; end++){
      calcRoute(addresses[start], addresses[end]);
      // routes.push(ourDirectionResults);
    } 
  }
}

function findLongestRoute(){
  var longest = routeArray[0];
  for (var i = 1; i < routeArray.length; i++){
    if (findDuration(routeArray[i]) > findDuration(longest)){
      longest = routeArray[i];
    } 
  }
  return longest;
}

function convertToLatLonObjects(addressArray){
  var newAddressObjects = [];
  for(var i = 0; i < addressArray.length; i++){
    var tempObject = new google.maps.LatLng(addressArray[i][0],addressArray[i][1]);
    newAddressObjects.push(tempObject);
  }
  return newAddressObjects;
}

function findPlaces(){
  var placesResponse;

  var request = {
    location: new google.maps.LatLng(midpoint[0],midpoint[1]),
    radius: '500', //meters
    types: ['bar', 'cafe', 'restaurant'] //https://developers.google.com/places/documentation/supported_types
  };

  var service = new google.maps.places.PlacesService(map);
  // service.getDetails(request, callback); 
  service.nearbySearch(request, function(results, status){ 
    placesResponse = results; //placesResponse holds an array of places objects 
  });

  setTimeout(function(){
    var $ourPlacesList = $("#googlePlaces ul");
    for(var i=0; i < 5; i++){
      $("<li> Name: " + placesResponse[i].name + " Price: " + placesResponse[i].price_level + " Rating: " + placesResponse[i].rating + "</li>").appendTo($ourPlacesList);
      console.log("type: " + placesResponse[i].types[0] + " name: " + placesResponse[i].name + " price: " + placesResponse[i].price_level + " rating: " + placesResponse[i].rating);
    }}, 2000); //Might need to adjust sleep duration according to number of returned results
  
}