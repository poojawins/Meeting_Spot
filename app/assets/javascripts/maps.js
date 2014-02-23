var map;
var directionsService;
// var routeArray = [];
var calculate = document.getElementById("btn");
var image = "/assets/green_dot.png";
var placesResponse;

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

function addAllMarkers(){ 
  markers.forEach(function(marker){
    var lat = marker.latitude;
    var lon = marker.longitude;
    var loc = new google.maps.LatLng(lat,lon);
    var newMark = new google.maps.Marker({
      position: loc, 
      map:map
    }); 
    bounds.extend(loc);
  });

  if (bounds.isEmpty() == false){
    map.fitBounds(bounds);
    map.panToBounds(bounds);
  }
}

function addMarker(latlong){
  var newMark = new google.maps.Marker({
  	position:latlong, 
  	map:map,
    icon:image
  });	
} 

function calcRoute(startLoc, endLoc, callback){
  // for (i = 0; i < markerArray.length; i++){
  //   markerArray[i].setMap(null);
  // }

  var request = {
    origin: startLoc,
    destination: endLoc,
    travelMode: google.maps.TravelMode.TRANSIT,
    transitOptions:{
      departureTime: new Date(2014, 1, 4, 13)
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
    callback(directionResults);
    // routeArray.push(directionResults);
  });
}

function midWay(routeArray){
  var longestRoute = findLongestRoute(routeArray);
  var middleOfOverviewPath = Math.floor(longestRoute.routes[0].overview_path.length / 2);
  var midLat = longestRoute.routes[0].overview_path[middleOfOverviewPath].d;
  var midLong = longestRoute.routes[0].overview_path[middleOfOverviewPath].e;
  return [midLat, midLong];
}

function findDuration(directions){
  return directions.routes[0].legs[0].duration.value;
}

function findRoutes(addresses){
  var routeArray = [];
  var routeCount = 0; 
  var responseCount = 0;

  var callback = function (results){
    routeArray.push(results);
    responseCount ++;
    if (responseCount >= routeCount) {
      // we're done! routeArray is full!
      // call something
      var midpoint = midWay(routeArray);
      
      findPlaces(midpoint);
      }
    
  };

  for (var start = 0; start < addresses.length; start++){
    //setTimeout, loop with delay = 1 sec * add.length
    duration = 3000;
    setTimeout(
      (function(s){
        return function(){
          console.log(s);
        }
      })(start), duration);
    duration += 3000;


    // for (var end = start + 1; end < addresses.length; end++){
    //   //setTimeout, loop with delay = 1sec + 1sec
    //   routeCount ++;
    //   calcRoute(addresses[start], addresses[end], callback);
    // } 
  }
}

function findLongestRoute(routeArray){
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

function findPlaces(midpoint){
  //var placesResponse;
   var placesResponseObjs = [];

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
    $ourPlacesList.find("li").remove();



    for(var i=0; i < placesResponse.length; i++){
      if(i < 5){
        addMarker(placesResponse[i].geometry.location);
        $("<li class='place'> Name: " + placesResponse[i].name + " Price: " + placesResponse[i].price_level + " Rating: " + placesResponse[i].rating + "</li>").appendTo($ourPlacesList);
      }
      
      placesResponseObjs.push({
        name: placesResponse[i].name, 
        latitude: placesResponse[i].geometry.location.d, 
        longitude:placesResponse[i].geometry.location.e, 
        price_level:placesResponse[i].price_level, 
        rating: placesResponse[i].rating, 
        reference:placesResponse[i].reference, 
        types: placesResponse[i].types.join(",")
      });      
    }

    $.ajax('/maps/' + map_id + '/places', {
      type: 'POST',
      dataType: 'json',
      data: {places:placesResponseObjs},
      beforeSend: function(){ 
        $('#place-btn').prop('disabled', true); //Trying to disable the button while the data is being posted to DB
      }, 
      complete: function(){ 
        $('#place-btn').prop('disabled', false);
      }
    });
  }, 2000); //Might need to adjust sleep duration according to number of returned results
    
}

$(document).ready(function(){    
  $("#place-btn").on("click", function(){
    //If DB already don't find the routes again

    //AJAX request for selectionPlaces...working much better but won't work if button is clicked too fast after initial request 
    $.ajax('/maps/' + map_id + '/places', {
      type: 'GET',
      success: function(data) {
        selectionPlaces = $.parseJSON(data);
      },
      error: function() {
        console.log("Error with the fetch");
        },
      beforeSend: function(){
        $('#place-btn').prop('disabled', true);
      },
      complete: function(){
        $('#place-btn').prop('disabled', false);
      }
     
    // function(data){
    //   selectionPlaces = $.parseJSON(data);   
    });

    
    if(selectionPlaces.length){
      var placesResponse = selectionPlaces; 
      console.log("Pulling from the DB");
      //This is just the same code from the findPlaces function. Definitely needs to be refactored
      var $ourPlacesList = $("#googlePlaces ul");
      $ourPlacesList.find("li").remove();
      for(var i=0; i < placesResponse.length; i++){
        addMarker(new google.maps.LatLng(placesResponse[i].latitude,placesResponse[i].longitude));
        $("<li class='place' id=" + placesResponse[i].id + "> Name: " + placesResponse[i].name + " Price: " + placesResponse[i].price_level + " Rating: " + placesResponse[i].rating + "</li>").appendTo($ourPlacesList);
      }
    }else{
      console.log("Pulling from Google");
      findRoutes(addressArray);
      //Completely disable the button to prevent over query limit from Google. 
      setTimeout(function(){
        $('#place-btn').prop('disabled', true); 
      },7000);
      $('#place-btn').prop('disabled', false);
    }
  });

});

//Not the ideal solution but here we're checking if the <li>s exist every 100 micro-seconds
setInterval(function(){
  if ($(".place").length) {
    $(".place").on("click", function(){
      $(this).addClass("highlight");
      $(".place").not($(this)).removeClass("highlight");
    });
  }
}, 100);


   //1. check if full place info is in database
    //2. if not in database, request info from google
    //3. return full info (prettily)
    //4. somehow change the marker on the map to make it noticable
    //5. remove other notable markers
    //6. highlight it in some way
    //7. un-highlight the other items