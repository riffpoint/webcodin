/**
 * @file
 * Sonus Map.
 */

(function ($, Drupal) {

  window.sonusActiveMarker = undefined;

  /**
   * Sonus Map and locations.
   */
  Drupal.behaviors.sonusMap = {
    attach: function (context, settings) {
      // Map settings.
      var mapSettings = settings.sonusMapSettings,
        locations = JSON.parse(mapSettings.mapLocations),
        map = null;

      // Initialize a map.
      var mapInit = function () {
        $(context).find('body').once('map_init').each(function () {
          map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(mapSettings.defaultLocation.lat, mapSettings.defaultLocation.lng),
            zoom: mapSettings.zoom,
            styles: getmapTheme(),
            mapTypeControl: false,
            streetViewControl: false
          });
        });
      };

      var setMarkers = function () {
        if (locations && map instanceof google.maps.Map) {
          locations.forEach(function (location) {
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(location.geolocation.lat, location.geolocation.lng),
              map: map,
              icon: mapSettings.markers.default,
              title: location.title
            });

            marker.infoWindow = new google.maps.InfoWindow({
              content: '<div class="location-details">' + location.address + location.phone + '</div>'
            });

            marker.addListener('click', function() {
              if (typeof sonusActiveMarker !== 'undefined') {
                sonusActiveMarker.setZIndex(1);
                sonusActiveMarker.setIcon(mapSettings.markers.default);
                sonusActiveMarker.infoWindow.close();
              }

              marker.setIcon(mapSettings.markers.active);
              marker.setZIndex(999);
              marker.infoWindow.open(map, marker);
              marker.setIcon(mapSettings.markers.active);
              sonusActiveMarker = marker;
            });

            google.maps.event.addListener(marker.infoWindow, 'closeclick',function(){
              sonusActiveMarker.setZIndex(1);
              sonusActiveMarker.setIcon(mapSettings.markers.default);
            });
          });
        }
      };

      mapInit();
      setMarkers();

      function getmapTheme() {
        return [
          {
            "stylers": [
              {
                "color": "#006a8c"
              }
            ]
          },
          {
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#00a9dd"
              }
            ]
          },
          {
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#d7f1f2"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              },
              {
                "weight": 0.5
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#e92222"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#0099dd"
              }
            ]
          }
        ];
      }
    }
  };

}(jQuery, Drupal));
