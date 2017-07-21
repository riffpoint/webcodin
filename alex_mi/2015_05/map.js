                                var xhr = false;
                                var map;
                                var markers = [];
                                var zoomLevel;
                                var r;
                                var rC = [];
                                var cC = [];
                                var windowInfo;
                                var swBound;
                                var neBound;
                                var swLat;
                                var swLng;
                                var neLat;
                                var neLng;
                                var bounds;
                                
                                function initialize(lat, lng) {
                                    var mapOptions = {
                                        zoom: 6,
                                        maxZoom: 15,
                                        center: new google.maps.LatLng(lat, lng),
                                        mapTypeId: google.maps.MapTypeId.ROADMAP
                                    };
                                    map = new google.maps.Map(document.getElementById("map"), mapOptions);
                                    google.maps.event.addListener(map, 'zoom_changed',
                                            function() {
                                                zoomChanged();
                                            });
                                }
                                $(document).ready(function() {
                                    initialize(50.47622460000002, 30.50167700000005);
                                    drawRegions();
                                    calculateZoom();
                                });

                                function calculateZoom() {
                                    google.maps.event.addListener(map, 'dragend',
                                            function() {
                                                zoomChanged();
                                            });
                                }
                                
                                function zoomChanged() {
                                    if (windowInfo) {
                                        windowInfo.close();
                                    }
                                    
                                    zoomLevel = map.getZoom();
                                    if (zoomLevel <= 7) {
                                        clearMapcCCircles();
                                        drawRegions();
                                        return;
                                    } else if ((zoomLevel >= 8) && (zoomLevel <= 11)) {
                                        clearMapMarkers();
                                        clearMaprCCircles();
                                        clearMapcCCircles();
                                        drawCities();
                                    } else if ((zoomLevel >= 12) && (zoomLevel <= 15)) {
                                        clearMapcCCircles();
                                        drawPoses();
                                    }
                                }
                                
                                function drawRegions() {
                                    if (xhr) {
                                        xhr.abort();
                                    }
                                    clearMaprCCircles();
                                    r = JSON.parse(regions);
                                    for (var i = 0; i < r.length; i++) {
                                        if ((r[i].lat) && (r[i].lng) && (r[i].lat !== "") && (r[i].lng !== "")) {
                                            var regionsOptions = {
                                                strokeColor: "#0000FF",
                                                strokeOpacity: 0.8,
                                                clickable: true,
                                                strokeWeight: 2,
                                                fillColor: "#0000FF",
                                                fillOpacity: 0.4,
                                                map: map,
                                                center: new google.maps.LatLng(r[i].lat, r[i].lng),
                                                title: r[i].name,
                                                radius: (r[i].amountOfPoses) * 20
                                            };
                                            var regionsCircle = new google.maps.Circle(regionsOptions);
                                            rC.push(regionsCircle);
                                            
                                            for (var x = 0; x < rC.length; x++) {
                                                google.maps.event.addListener(rC[x], 'click',
                                                        function() {
                                                            if (windowInfo) {
                                                                windowInfo.close();
                                                            }
                                                            var amount = (this.radius / 20).toString();
                                                            windowInfo = new google.maps.InfoWindow({
                                                                position: this.center,
                                                                content: amount
                                                            });
                                                            windowInfo.open(map, rC[x]);
                                                        });
                                            }
                                        }
                                    }
                                }
                                
                                function drawCities() {
                                    clearMaprCCircles();
                                    clearMapMarkers();
                                    bounds = map.getBounds();
                                    swBound = bounds.getSouthWest();
                                    swLat = swBound.lat();
                                    swLng = swBound.lng();
                                    neBound = bounds.getNorthEast();
                                    neLat = neBound.lat();
                                    neLng = neBound.lng();
                                    if (xhr) {
                                        xhr.abort();
                                    }
                                    xhr = $.ajax({
                                        url: "/refresh-cities",
                                        type: "post",
                                        data: {
                                            swLat: swLat,
                                            swLng: swLng,
                                            neLat: neLat,
                                            neLng: neLng
                                        },
                                        success: function(data) {
                                            for (var i = 0; i < data.cities.length; i++) {
                                                var citiesOptions = {
                                                    strokeColor: "#0000FF",
                                                    strokeOpacity: 0.8,
                                                    clickable: true,
                                                    strokeWeight: 2,
                                                    fillColor: "yellow",
                                                    fillOpacity: 0.4,
                                                    center: new google.maps.LatLng(data.cities[i].lat, data.cities[i].lng),
                                                    title: data.cities[i].name,
                                                    radius: data.cities[i].amountOfPoses * 20,
                                                    map: map
                                                };
                                                var citiesCircle = new google.maps.Circle(citiesOptions);
                                                cC.push(citiesCircle);
                                                
                                                for (var x = 0; x < cC.length; x++) {
                                                    google.maps.event.addListener(cC[x], 'click',
                                                            function() {

                                                                if (windowInfo) {
                                                                    windowInfo.close();
                                                                }
                                                                var amount = (this.radius / 20).toString();
                                                                windowInfo = new google.maps.InfoWindow({
                                                                    position: this.center,
                                                                    content: amount
                                                                });
                                                                windowInfo.open(map, cC[x]);
                                                            });
                                                }
                                            }
                                            xhr = false;
                                        }
                                    });
                                }
                                
                                function drawPoses() {
                                    clearMapMarkers();
                                    clearMapcCCircles();
                                    bounds = map.getBounds();
                                    swBound = bounds.getSouthWest();
                                    swLat = swBound.lat();
                                    swLng = swBound.lng();
                                    neBound = bounds.getNorthEast();
                                    neLat = neBound.lat();
                                    neLng = neBound.lng();
                                    if (xhr) {
                                        xhr.abort();
                                    }
                                    xhr = $.ajax({
                                        url: "/refresh-poses",
                                        type: "post",
                                        data: {
                                            swLat: swLat,
                                            swLng: swLng,
                                            neLat: neLat,
                                            neLng: neLng
                                        },
                                        success: function(data) {
                                            var icon = "";
                                            for (var x = 0; x < data.poses.length; x++) {
                                                switch (data.poses[x].color) {
                                                    case 'red':
                                                        icon = 'red';
                                                        break;
                                                    case 'yellow':
                                                        icon = 'yellow';
                                                        break;
                                                }
                                                var marker = new google.maps.Marker({
                                                    id: data.poses[x].id,
                                                    position: new google.maps.LatLng(data.poses[x].lat, data.poses[x].lng),
                                                    title: data.poses[x].name,
                                                    map: map,
                                                    icon: '/images/map/' + icon + '.png'
                                                });
                                                var i = markers.push(marker) - 1;
                                                
                                                google.maps.event.addListener(markers[i], 'click',
                                                        function() {
                                                            var mrk = this;
                                                            $.ajax({
                                                                url: "/show-info",
                                                                type: "post",
                                                                data: {
                                                                    pos_id: mrk.id
                                                                },
                                                                success: function(data) {
                                                                    if (windowInfo) {
                                                                        windowInfo.close();
                                                                    }
                                                                    windowInfo = new google.maps.InfoWindow();
                                                                    windowInfo.setContent(data);
                                                                    windowInfo.open(map, mrk);
                                                                }
                                                            });
                                                        });
                                            }
                                            xhr = false;
                                        }
                                    });
                                }
                                
                                function filter() {
                                    $.ajax({
                                        url: "/filter",
                                        type: "post",
                                        data: {
                                            region: $('#form_region').val(),
                                            city: $('#form_city').val()
                                        },
                                        success: function(data) {
                                            if (data.rLat && data.rLng) {
                                                clearMaprCCircles();
                                                initialize(data.rLat, data.rLng);
                                                map.setZoom(9);
                                                drawCities();
                                            } else if (data.cLat && data.cLng) {
                                                clearMapcCCircles();
                                                initialize(data.cLat, data.cLng);
                                                map.setZoom(13);
                                                drawPoses();
                                            }
                                        }
                                    });
                                }
                                
                                function clearMaprCCircles() {
                                    for (var i = 0; i < rC.length; i++) {
                                        rC[i].setMap(null);
                                    }
                                    rC = [];
                                }
                                
                                function clearMapcCCircles() {
                                    for (var i = 0; i < cC.length; i++) {
                                        cC[i].setMap(null);
                                    }
                                    cC = [];
                                }
                                
                                function clearMapMarkers() {
                                    for (var i = 0; i < markers.length; i++) {
                                        markers[i].setMap(null);
                                    }
                                    markers = [];
                                }

                                $('#form_region').on('change', function() {
                                    reloadCity();
                                });
                                
                                function reloadCity()
                                {
                                    $.ajax({
                                        url: "/reload-city",
                                        type: 'post',
                                        data: {
                                            region: $('#form_region').val()
                                        },
                                        success: function(data) {
                                            $('.field_city').html(data);
                                            $('#form_city').select2({
                                                allowClear: true,
                                                width: 'element'
                                            });
                                        }
                                    });
                                }
