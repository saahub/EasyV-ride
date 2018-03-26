      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

            function buscar(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);//getCurrentPosition permite al usuario obtener su ubicación actual, funcionExito se ejecuta solo cuando el usuario comparte su ubicación, mientras que funcionError se ejecuta cuando se produce un error en la geolocalización
    }
  }

  document.getElementById("encuentrame").addEventListener("click", buscar);
  var latitud, longitud;

  var funcionExito = function(position){//var funcionExito, con el que obtendremos nuestra latitud o longitud y además crearemos un marcador de nuestra ubicación.
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;

    var miUbicacion = new mapIcons.Marker({
      position: {lat:latitud, lng:longitud},
      animation: google.maps.Animation.DROP,
      map: map,
      icon:{
        path:mapIcons.shapes.MAP_PIN,
        fillColor:'yellow',
        fillOpacity:1,
        strokeColor:'',
        strokeWeight:0
      },
      map_icon_label:'<span class="map-icon map-icon-bicycle-store"></span>'
    });

    map.setZoom(17);
    map.setCenter({lat:latitud, lng:longitud});
  }

  var funcionError = function(error){//funcionError con un mensaje para el usuario, en caso de que nuestra geolocalización falle.
    alert("tenemos un problema con encontrar tu ubicación");
  }

        new AutocompleteDirectionsHandler(map);
      }

       /**
        * @constructor
       */
      function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'WALKING';
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});


        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function() {
          me.travelMode = mode;
          me.route();
        });
      };

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;

        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
            var inicio = response.routes[0].legs[0].inicio_location;
            var final = response.routes[0].legs[0].final_location;
            function marcador(ev){
             new mapIcons.Marker({
              position: {lat:latitud, lng:longitud},
              animation: google.maps.Animation.DROP,
              map: map,
              icon:{
                path:mapIcons.shapes.MAP_PIN,
                fillColor:'yellow',
                fillOpacity:1,
                strokeColor:'',
                strokeWeight:0
              },
              map_icon_label:'<span class="map-icon map-icon-bicycle-store"></span>'
            }
            marcador(inicio);
            marcador(final);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
        directionsDisplay.setOptions({ suppressMarkers: true});
      };
