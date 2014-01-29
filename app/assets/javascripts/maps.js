var map;
var directionsService;
var routeArray = [];
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
      var warnings = document.getElementById("warnings_panel") 
      warnings = " " + response.routes[0].warnings + " ";
    } else {
      console.log("error: "+status);
    }
    routeArray.push(directionResults);
  });
}

function midWay(){
  var midPoint = Math.floor(directionResults.routes[0].overview_path.length / 2);
  var midLat = directionResults.routes[0].overview_path[midPoint].d;
  var midLong = directionResults.routes[0].overview_path[midPoint].e;
  return [midLat, midLong];
}

function findDuration(directions){
  return directions.routes[0].legs[0].duration.value;
}

function findRoutes(addresses){
  var routes = [];
  for (var start = 0; start < addresses.length; start++){
    for (var end = start + 1; end < addresses.length; end++){
      var ourDirectionResults = calcRoute(addresses[start], addresses[end]);
      // routes.push(ourDirectionResults);
      console.log(start + " " + end);
    } 
  }
  return routes;
}


// function findLongestRoute(addresses){
//   var longest = 0;
//   for (var start = 0; start < addresses.length; start++){
//     for (var end = start + 1; end < addresses.length; end++){
//       var directionResults;
//       directionResults = calcRoute(addresses[start], addresses[end]);
//       return directionResults;
//       setTimeout(function(){console.log(start + " " + end);}, 75000);
//       if(longest == 0 || findDuration(directionResults) > findDuration(longest)){
//         longest = directionResults;
//       } 
//     }
//   }
//   return longest;
// }

function convertToLatLonObjects(addressArray){
  var newAddressObjects = [];
  for(var i = 0; i < addressArray.length; i++){
    var tempObject = new google.maps.LatLng(addressArray[i][0],addressArray[i][1]);
    newAddressObjects.push(tempObject);
  }
  return newAddressObjects;
}