var map, heatmap;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: 37.775, lng: -122.434},
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    var btn = $('#btn-search');

    btn.on('click', function(){
        var tag = $('#search').val();
        if (typeof heatmap != 'undefined'){
            heatmap.setMap(null);
        }

        btn.hide();
        $('#wait-text').show();

        $.ajax({
            method: 'GET',
            url: '/search?tag=' + tag,
            success: function(data){
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data: getPoints($.parseJSON(data)),
                    radius: 40
                });
                heatmap.setMap(map);

                btn.show();
                $('#wait-text').hide();
            }
        })
    })
}

function getPoints(photos) {
    var points = [];
    for (i = 0; i < photos.length; i++) {
        points.push(new google.maps.LatLng(photos[i].lat, photos[i].lng))
    }
    return points
}
