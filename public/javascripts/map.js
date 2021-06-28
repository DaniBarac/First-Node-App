
var pos = [0, 0];
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

function showPosition(position) {
    pos[0] = position.coords.longitude;
    pos[1] = position.coords.latitude;
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWJhcmFjNTIiLCJhIjoiY2txMnc2cW51MDhhajJub25oZnlsbGl3MCJ9.Xo1OC8K7xyEDFZgf0YVAAQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: pos,
        zoom: 9
    });
    new mapboxgl.Marker().setLngLat(pos).addTo(map);
}

document.getElementById("Back").onclick = function() {
    window.location.href = '/';
}