var jcrop_api, jcrop_api_c, jcrop_prev_coords, jcrop_prev_coords_c;
var start_select = [
    $('#x').val(),
    $('#y').val(),
    $('#x2').val(),
    $('#y2').val()
];
var start_select_c = [
    $('#x_c').val(),
    $('#y_c').val(),
    $('#x2_c').val(),
    $('#y2_c').val()
];

/**
 * Init jcrop plugin
 */
$('input[type="file"]').on('change.bs.fileinput', function () {
    var checkExist = setInterval(function () {
        if ($('#base-img img').length) {
            $('#base-img img').Jcrop(
                {
                    onChange: showPreview,
                    onSelect: showPreview,
                    onRelease: onReleaseFire,
                    bgColor: 'white',
                    bgOpacity: 0.4,
                    setSelect: start_select,
                    minSize: [50, 50],
                    aspectRatio: 1
                },
                function(){
                    jcrop_api = this;
                }
            );
            clearInterval(checkExist);
        }
    }, 100);
});

/**
 * Init jcrop plugin for update avatar
 */
$( document ).ready(function() {
    var img = $('#base-img_c img');
    img.Jcrop(
        {
            onChange: showPreviewC,
            onSelect: showPreviewC,
            onRelease: onReleaseFireC,
            bgColor: 'white',
            bgOpacity: 0.4,
            setSelect: start_select_c,
            minSize: [50, 50],
            aspectRatio: 1
        },
        function(){
            jcrop_api_c = this;
        }
    );

});

/**
 * Show 3 avatar sizes
 */
function showPreview(coords)
{
    $('#x').val(coords.x);
    $('#y').val(coords.y);
    $('#x2').val(coords.x2);
    $('#y2').val(coords.y2);
    $('#w').val(coords.w);
    $('#h').val(coords.h);
    if (coords.w > 0 && coords.h > 0) {
        jcrop_prev_coords = coords;
    }
    var img_size = {
        w: $('#base-img img').width(),
        h: $('#base-img img').height()
    }
    showPreviewSize(coords, img_size, 200);
    showPreviewSize(coords, img_size, 100);
    showPreviewSize(coords, img_size, 50);
}

/**
 * Show avatar preview
 */
function showPreviewSize(coords, img_size, size)
{
    var rx = size / coords.w;
    var ry = size / coords.h;
    $('#preview_' + size + ' img').css({
        width: Math.round(rx * img_size.w) + 'px',
        height: Math.round(ry * img_size.h) + 'px',
        marginLeft: '-' + Math.round(rx * coords.x) + 'px',
        marginTop: '-' + Math.round(ry * coords.y) + 'px'
    });
}

/**
 * Jcrop onRelease event listener
 */
function onReleaseFire()
{
    var c = jcrop_prev_coords;
    jcrop_api.setSelect([c.x, c.y, c.x2, c.y2]);
}

/**
 * Show 3 avatar sizes for update mode
 */
function showPreviewC(coords)
{
    $('#x_c').val(coords.x);
    $('#y_c').val(coords.y);
    $('#x2_c').val(coords.x2);
    $('#y2_c').val(coords.y2);
    $('#w_c').val(coords.w);
    $('#h_c').val(coords.h);
    if (coords.w > 0 && coords.h > 0) {
        jcrop_prev_coords_c = coords;
    }
    var img_size = {
        w: $('#base-img_c img').width(),
        h: $('#base-img_c img').height()
    }
    showPreviewSizeC(coords, img_size, 200);
    showPreviewSizeC(coords, img_size, 100);
    showPreviewSizeC(coords, img_size, 50);

}

/**
 * Show avatar preview for update mod
 */
function showPreviewSizeC(coords, img_size, size)
{
    var rx = size / coords.w;
    var ry = size / coords.h;
    $('#preview_' + size + '_c img').css({
        width: Math.round(rx * img_size.w) + 'px',
        height: Math.round(ry * img_size.h) + 'px',
        marginLeft: '-' + Math.round(rx * coords.x) + 'px',
        marginTop: '-' + Math.round(ry * coords.y) + 'px'
    });
}

/**
 * Jcrop onRelease event listener for update avatar mode
 */
function onReleaseFireC()
{
    var c = jcrop_prev_coords_c;
    jcrop_api_c.setSelect([c.x, c.y, c.x2, c.y2]);
}


