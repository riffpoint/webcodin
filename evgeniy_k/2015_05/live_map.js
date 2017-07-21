(function($) {  
    $(document).ready(function() {
        live_map.init();
    });
})(jQuery);

var marker_title = 'Your location.';
var map;
var marker;
var markers = [];
var admin_lat = $('#location_lat').val();
var admin_lng = $('#location_long').val();;

function initialize() {
    var input = document.getElementById('gmap_geocoding_address');
    var types = document.getElementById('type-selector');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }; 
        marker_title = place.name + "\n" + address;  
        $('#gmap_geocoding_btn').click();
    })

    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      google.maps.event.addDomListener(radioButton, 'click', function() {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

};

var live_map = {
    ajaxReinit: function () {
        live_map.init();
    },

    init: function () {
        map = new GMaps({
            div: '#gmap_geocoding',
            lat: admin_lat,
            lng: admin_lng,
            zoom: 15
        }); 

        MapsGoogle.init(true);

        initialize();

        $('#distance a').click(function(e){
            e.preventDefault();
            if(typeof marker === 'undefined') {
                alert('Select Yuor location!');
                return;
            }
            var params = {};
            params['action'] = 'get_nearest_drivers';
            params['distance'] = $(this).data('distance');
            params['location_lat'] = admin_lat;
            params['location_long'] = admin_lng;
            SetDriversMarkers(params);
        });

        $('#your_location').click(function(e){
            e.preventDefault();
            MapsGoogle.init(false);
        });
    }
}

var SetDriversMarkers = function(params){
    var zoom = 15;
    if(params['distance'] > 1000)
        zoom = 13;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: params,

        beforeSend: function(){
            App.blockUI({
                target: '#map_wrapper',
                boxed: true
            });
        },

        success: function(data){
           for(var i=0; i < markers.length; i++){
                markers[i].setMap(null);
            }
            if(data.type == 'success') {
                map.setZoom(zoom);
                for(var i=0; i < data.driver.length; i++){
                    var id = data.driver[i].id;
                    markers[i] = map.addMarker({
                        lat: data.driver[i].lat,
                        lng: data.driver[i].lng,
                        infoWindow:{
                            content: data.driver[i].info
                        },
                        details:{
                            id: data.driver[i].id,
                        },
                    });
                }
            } else {
                alert(data.message);
            }
        },

        complete: function(){
            App.unblockUI('#map_wrapper');
        },

        error: function(){},
    });
}

var MapsGoogle = function (flag) {

    var mapGeocoding = function (flag) {
        var admin_marker_img = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
        var handleAction = function () {
            var text = $.trim($('#gmap_geocoding_address').val());
            GMaps.geocode({
                address: text,
                callback: function (results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        admin_lat = latlng.lat();
                        admin_lng = latlng.lng();
                        if(map.markers.length > 0)
                        map.removeMarker(marker);
                        for(var i=0; i < markers.length; i++){
                             markers[i].setMap(null);
                         }
                        map.setCenter(latlng.lat(), latlng.lng());
                        marker = map.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                            title: marker_title,
                            icon: admin_marker_img,
                        });
                        App.scrollTo($('#gmap_geocoding'));
                    }
                }
            });
        }

        GMaps.geolocate({
            success: function (position) { 
                admin_lat = position.coords.latitude;
                admin_lng = position.coords.longitude;
                map.removeMarker(marker);
                marker = map.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: 'Your location.',
                    icon: admin_marker_img
                });
                if(flag){
                    var params = {};
                    params['action'] = 'get_nearest_drivers';
                    params['location_lat'] = admin_lat;
                    params['location_long'] = admin_lng;
                    SetDriversMarkers(params);  
                }
                map.setCenter(position.coords.latitude, position.coords.longitude);
            },

            error: function (error) {
                alert('Geolocation failed: ' + error.message);
            },

            not_supported: function () {
                alert("Your browser does not support geolocation");
            },

            always: function () {
            }
        });

        $('#gmap_geocoding_btn').click(function (e) {
            e.preventDefault();
            handleAction();
        });

        $("#gmap_geocoding_address").keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                e.preventDefault();
                handleAction();
            }
        });

    }

    return {
        //main function to initiate map samples
        init: function (flag) {
            mapGeocoding(flag);
        }
    };
}();
