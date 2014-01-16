function initialize(){
  var mapProp = {
    center:new google.maps.LatLng(lat, lon), zoom:12,
    mapTypeID:google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}
