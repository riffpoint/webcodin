/**
 * This is an example of js code from Twig template. This code produces the management of tree elements. Main features: display information about the item and the shift of element.
 */

$(document).ready(function () {

    function showCategoryInfo(id) {
        var url = "{{ path('admin_app_category_info', {id: '__ID__'}) }}".replace('__ID__', id);
        $.ajax({
            url: url,
            type: "POST",
            success: function(response){
                if (!response.error) {
                    $('#category-info').html(response.html);
                } else {
                    console.log(response);
                }
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

    $('#categories').on('activate_node.jstree', function (e, data) {
        showCategoryInfo(data.node.data.id);
    }).jstree({
        "core" : {
            "check_callback": true,
            "multiple" : false,
            "animation" : 0,
            "themes" : {
                "variant" : "large"
            }
        },
        "plugins" : ["wholerow", "types"],
        "types" : {
            "default": {
                "icon": "glyphicon glyphicon-tags"
            }
        }
    });

    $('body').on('click', 'a.move[data-move]', function(e){
        e.preventDefault();
        var $a = $(e.currentTarget);
        var url = $a.attr('href');
        $.ajax({
            url: url,
            type: "POST",
            success: function(response){
                if (!response.error) {
                    moveNode(response.move);
                    $('#category-info').html(response.html);
                } else {
                    console.log(response);
                }
            },
            error: function (error) {
                console.error(error);
            }
        });
    });

    $('body').on('click', 'a.restore-category', function(e){
        e.preventDefault();
        var $a = $(e.currentTarget);
        var url = $a.attr('href');
        $.ajax({
            url: url,
            type: "POST",
            success: function(response){
                if (!response.error) {
                    $('#category-info').html(response.html);
                    var $list = $("#categories");
                    var node = $list.jstree(true).get_node('category-' + response.id);
                    $list.jstree('rename_node', node , response.name );
                } else {
                    alert('Oops. Something wrong. See console for more details.');
                    console.log(response);
                }
            },
            error: function (error) {
                console.error(error);
            }
        });
    });

    function moveNode(move, node) {
        var jstree = $.jstree.reference('#categories');
        if (!node) {
            node = jstree.get_selected();
        }
        var index = $('#' + node).index();
        switch (move) {
            case 'top':
                index = 'first';
                break;
            case 'up':
                if (index > 0)  index--;
                break;
            case 'bottom':
                index = 'last';
                break;
            case 'down':
                var length = jstree.get_node(jstree.get_parent(node)).children.length;
                index = (index + 1 > length ? index : index + 1) + 1;
                break;
        }
        jstree.move_node(node, jstree.get_parent(node), index);
    }
});