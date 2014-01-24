var map;
var directionsService;
var markerArray = [];
var directionResults;
var calculate = document.getElementById("btn");

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
  for (i = 0; i < markerArray.length; i++){
    markerArray[i].setMap(null);
  }

  var request = {
    origin: startLoc,
    destination: endLoc,
    travelMode: google.maps.TravelMode.TRANSIT,
    transitOptions:{
      departureTime: new Date(2014,0,27)
    }   
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionResults = response;
      // var warnings = document.getElementById("warnings_panel") 
      // warnings.innerHTML = " " + response.routes[0].warnings + " ";
      // directionsDisplay.setDirections(response); showSteps(response);
    }
    return directionResults;
  });
  return directionResults;
}

