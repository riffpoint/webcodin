$('form[name="comment"]').submit(function (e) {
    e.preventDefault();
    var $form = $(this);
    $form.find('.loader').show();
    $form.find('input[type=submit], button[type=submit]').prop('disabled', true).addClass('disabled');
    $form.find('.error').html(null);
    var formData = new FormData($form[0]);
    $.ajax({
        url: $form.attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(response) {
            if (!jQuery.isEmptyObject(response.errors)) {
                $.each(response.errors, function(key, message) {
                    $form.find('#error-' + key).html(message);
                });
            } else {
                $form.find('input[type=text], input[type=email], textarea, input[name="comment[parent]"]').val(null);
                var data = response.data;
                var $target = $(data.view.target);
                if (data.view.replace) {
                    $target.html(data.view.html);
                } else {
                    $target.append(data.view.html);
                }
                removeReplyTarget();
                $('html, body').animate({
                    scrollTop: $('#comment-' + data.id).offset().top
                }, 1000);
            }
        },
        error: function (error) {
            console.log(error);
        },
        complete: function (jqXHR, textStatus) {
            $form.find('.loader').hide();
            $form.find('input[type=submit], button[type=submit]').removeClass('disabled').prop('disabled', false);
        }
    });
});

(function() {
    var $body = $('body');
    $body.on('click', '.comment-reply', function (e) {
        e.preventDefault();
        var $a = $(e.currentTarget);
        $('input[name="comment[parent]"]').val($a.data('id'));
        var replyTo = $('#reply-to');
        replyTo.find('.target').text($a.data('name')).attr('href', '#comment-' + $a.data('id'));
        replyTo.show();
        $('html, body').animate({
            scrollTop: $('.add-comment').offset().top
        }, 1000);
    });

    $body.on('click', '#reply-to .remove', function (e) {
        e.preventDefault();
        removeReplyTarget();
    });

    $body.on('click', '#reply-to .target', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(href).offset().top
        }, 1000);
    });
})();

function removeReplyTarget() {
    $('input[name="comment[parent]"]').val(null);
    var replyTo = $('#reply-to');
    replyTo.find('.target').text(null).attr('href', '#');
    replyTo.hide();
}
