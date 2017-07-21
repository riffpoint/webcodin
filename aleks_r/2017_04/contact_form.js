$('form[name="contact_form"]').submit(function (e) {
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
        /**
         * @param {array} response.errors
         * @param {string} response.message
         */
        success: function(response) {
            if (!jQuery.isEmptyObject(response.errors)) {
                $.each(response.errors, function(key, message) {
                    $form.find('#error-' + key).html(message);
                });
            } else {
                $form[0].reset();
                swal({
                    title: 'Contact form',
                    html: response.message,
                    type: 'success',
                    timer: 5000,
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!'
                }).catch(swal.noop);
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