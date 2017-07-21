$(function() {
    /**
     * Bookmark module - add|remove
     */
    var bookMark = {

        addUrl: '/add-bookmark',
        removeUrl: '/remove-bookmark',

        add: function(element) {
            $.post(this.addUrl, { element: element.attr('id'), type: element.data('type') })
                .done(function(data) {
                    if(!data.error) {
                        element.addClass('active');
                    }
                });
        },

        remove: function(element){
            $.post(this.removeUrl, { element: element.attr('id'), type: element.data('type') })
                .done(function(data) {
                    if(!data.error) {
                        element.removeClass('active');
                    }
                });
        }
    };

    /**
     * Init Fancybox popup window
     */
    var initFancyBox = function(type, height, width) {
        return {
            closeBtn: true,
            ajax: {
                type: 'POST',
                cache: false
            },
            overlayShow: false,
            padding: '0px',
            beforeShow: function () {
                $('.saveNote').attr('data-type', type);
                this.width = width;
                this.height = height;
                $('.fancybox-wrap').addClass('bookmark-notes-popup-outer');
            }
        };
    };

    $(document).ready(function() {

        /**
         * Remove|add bookmart depends on existence of class
         */
        $('body').on('click', '.bookmark', function(e) {
            e.preventDefault();

            if($(this).hasClass('active')) {
                bookMark.remove($(this));
            } else {
                bookMark.add($(this));
            }
        });

        /**
         * Init fancybox with established width and height
         */
        $('.note_catalog').fancybox(initFB('catalog', '638', '490'));
        $('.note_stand').fancybox(initFB('stand', '638', '490'));

        /**
         * Save Note
         */
        $('body').on('click', '.saveNote', function(e) {
            e.preventDefault();

            var that = $(this);
            var comment  = $('.comment_' + that.data('item-id'));
            var type = that.data('type');
            var catalogItemId = that.data('catalog-item-id');

            $.ajax({
                url: that.attr('href'),
                method: 'POST',
                data: {
                    Id: that.data('item-id'),
                    comment: comment.val(),
                    type: type
                },
                success: function(data) {
                    if(!data.error) {
                        if(data.itemId != undefined) {
                            var noteTitleSelector = $('#' + data.itemId).find('span.link');
                            if(data.isCommentFieldEmpty) {
                                noteTitleSelector.removeClass('content-bookmark');
                                noteTitleSelector.prev().removeClass('selected');
                            } else {
                                noteTitleSelector.addClass('content-bookmark');
                                noteTitleSelector.prev().addClass('selected');
                            }
                        }
                        $.fancybox.close();
                    }
                }
            });
        });

        /**
         * Remove note
         */
        $('body').on('click', '.remove', function() {

            if(xhr) {
                xhr.abort();
            }

            var that = $(this);
            var data = {
                element: $(this).data('id'),
                type: $(this).data('type')
            };

            xhr = $.ajax({
                url: $(this).data('url'),
                method: 'POST',
                data: data,
                success: function(data) {
                    that.closest('li').addClass('removed-item');
                    setTimeout(function() {
                        that.closest('li').remove();
                    }, 500);

                    xhr = false;
                },
                fail: function() {}
            });
        });
    });
});
