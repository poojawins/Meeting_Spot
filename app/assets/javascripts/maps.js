var map;
var directionsService;
// var routeArray = [];
var calculate = document.getElementById("btn");
var image = "/assets/green_dot.png";
var placesResponse;
var placeTypes = [];
var meetingDate;
var pricePoint;

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


function symbol(number, symbol){
  if (number){
    var output = "";
    for (var i = 0; i < number; i++){
      output += symbol;
    }
    return output;
  } else {
    return "N/A";
  }
}


function addMarker(place){
  var newMark = new google.maps.Marker({
  	position:place.geometry.location,
  	map:map,
    icon:image,
  });
  newMark.info = new google.maps.InfoWindow({
    content:"<p>" + "<strong>" + place.name + "</strong>" + "<br />" + "Rating: " + symbol(place.rating, "&#9733;") + "<br />" + "Price: " + symbol(place.price_level, "$") + "<br />" + place.vicinity + "</p>"
  });
  google.maps.event.addListener(newMark, 'click', function() {
    newMark.info.open(map, newMark);
  });
  return newMark;
}

function calcRoute(startLoc, endLoc, callback){

  var request = {
    origin: startLoc,
    destination: endLoc,
    travelMode: google.maps.TravelMode.TRANSIT,
    transitOptions:{
      departureTime: meetingDate
    }
  }
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var directionResults = response;
      callback(directionResults);
    } else if(status == "OVER_QUERY_LIMIT") {
      callback(status);
    } else {
      throw new Error(status);
    }

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
    if (results == "OVER_QUERY_LIMIT"){
      setTimeout(function(){
        console.log("retrying: "+results);
        calcRoute(locations[0], locations[1], callback);
      }, 2000);
    } else if (combinations.length > 0){
      console.log("ok");
      routeArray.push(results);
      responseCount ++;
      combinations.shift();
      if (combinations.length != 0){
        calculateFirstSet();
      } else if (responseCount >= routeCount) {
        // we're done! routeArray is full!
        // call something
        var midpoint = midWay(routeArray);

        findPlaces(midpoint);
      }
    }

  };

  var combinations = [];
  for (var start = 0; start < addresses.length; start++){
    //setTimeout, loop with delay = 1 sec * add.length
    for (var end = start + 1; end < addresses.length; end++){
      combinations.push([addresses[start], addresses[end]]);
      routeCount++;
    }
  }

  function calculateFirstSet(){
    locations = combinations[0];
    calcRoute(locations[0], locations[1], callback);
  }

  calculateFirstSet();

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
    types: placeTypes, //https://developers.google.com/places/documentation/supported_types
    maxPriceLevel: pricePoint
  };

  var service = new google.maps.places.PlacesService(map);
  // service.getDetails(request, callback);
  service.nearbySearch(request, function(results, status){
    placesResponse = results; //placesResponse holds an array of places objects
  });

  setTimeout(function(){
    var $ourPlacesList = $("#googlePlaces ul");
    $ourPlacesList.find("li").remove();
    $("#googleMap").removeClass("centered");
    $("#googlePlaces").fadeIn();
    var prev_selected = false;
    if (placesResponse.length == 0){
      $("<li>Sorry, we couldn't find any results for your search. Please broaden your selections and try again.</li>").appendTo($ourPlacesList);
    } else {
      for(var i=0; i < placesResponse.length; i++){
        if(i < 5){
          (function(marker) {
          $("<li class='place'>" + "<span class='name'>" + placesResponse[i].name + "</span><br><span class='price'>Price: " + symbol(placesResponse[i].price_level, "$") + "</span><span class='rating'>Rating: " + symbol(placesResponse[i].rating, "&#9733;") + "</span></li>"
          ).click(function(){
            if( prev_selected ) {
              prev_selected.info.close();
              prev_selected.setIcon(image);
            }
            prev_selected = marker;
            marker.setIcon("/assets/red_dot.png");
            marker.info.open(map, marker);
            // map.setCenter(midpoint[0],midpoint[1]);
            // map.setZoom(15);
            }).appendTo($ourPlacesList);
          })(addMarker(placesResponse[i]));
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
    }
    $.unblockUI();
    window.scrollTo(0, 0);

    // $.ajax('/maps/' + map_id + '/places', {
    //   type: 'POST',
    //   dataType: 'json',
    //   data: {places:placesResponseObjs},
    //   beforeSend: function(){
    //     $('#place-btn').prop('disabled', true); //Trying to disable the button while the data is being posted to DB
    //   },
    //   complete: function(){
    //     $('#place-btn').prop('disabled', false);
    //   }
    // });
  }, 2000); //Might need to adjust sleep duration according to number of returned results

}

$(document).ready(function(){
  $("#place-btn").on("click", function(){
    //If DB already don't find the routes again

    pricePoint = $('input[name=placePrice]:radio:checked').val()

    $('input[name=placeType]:checked').each(function(){
        placeTypes.push($(this).val());
    }); //Value of all checked for place types

    //Grab value from the datetime field
    var dateTime = $("#placeDate-id").val().replace('T', ' ');
    meetingDate = new Date(dateTime);

    //AJAX request for selectionPlaces...working much better but won't work if button is clicked too fast after initial request
    // $.ajax('/maps/' + map_id + '/places', {
    //   type: 'GET',
    //   success: function(data) {
    //     selectionPlaces = $.parseJSON(data);
    //   },
    //   error: function() {
    //     console.log("Error with the fetch");
    //     },
    //   beforeSend: function(){
    //     $('#place-btn').prop('disabled', true);
    //   },
    //   complete: function(){
    //     $('#place-btn').prop('disabled', false);
    //   }
    // // function(data){
    // //   selectionPlaces = $.parseJSON(data);
    // });

    if(false && selectionPlaces.length){
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
      // setTimeout(function(){
      //   $('#place-btn').prop('disabled', true);
      // },7000);
      // $('#place-btn').prop('disabled', false);
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
