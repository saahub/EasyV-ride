var latitude, longitude;

function initMap() {
  var location = {
    lat: -33.45,
    lng: -70.6667
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: location
  });

  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  var inputPartida = document.getElementById('startingPoint');
  var inputDestino = document.getElementById('destination');

  new google.maps.places.Autocomplete(inputPartida);
  new google.maps.places.Autocomplete(inputDestino);
}

document.getElementById('findMe').addEventListener('click', search);

function search() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

var success = function getLocationSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  var imgMarker = 'https://raw.githubusercontent.com/tamybl/easy-vreco/master/assets/images/icon-bicycle.png';
  var location = {
    lat: latitude,
    lng: longitude
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: location
  });

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: imgMarker
  });


  var inputPartida = document.getElementById('startingPoint');
  var inputDestino = document.getElementById('destination');

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  var calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
    directionsService.route({
      origin: inputPartida.value,
      destination: inputDestino.value,
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('No encontramos una ruta');
      }
    });
  };

  // mapa mostrará la ruta
  directionsDisplay.setMap(map);
  var trazarRuta = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('goTo').addEventListener('click', trazarRuta);
};

var error = function(error) {
  alert('Tenemos problemas para encontrar tu ubicación.');
};