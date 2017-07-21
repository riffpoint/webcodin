var isFileChanged = false;
var isFileCleared = false;

/**
 * Ajax query constructor 
 */
var ajaxQuery = function (url, data, options, isFile) {
    var defaultOptions = {
        type: 'POST',
        url: url,
        width: 400,
        data: data,
        dataType: 'json',
        timeout: 20000
    };

    if(isFile) {
        defaultOptions.processData = false;
        defaultOptions.contentType = false;
    }

    options = $.extend({}, defaultOptions, options);
    var successUser = function (data) {
    };
    if (typeof options.success != 'undefined') {
        successUser = options.success;
    }
    var errorUser = function (xhr, status, error) {
    };
    if (typeof options.error != 'undefined') {
        errorUser = options.error;
    }
    options.success = function (data) {
        successUser(data);
    };
    options.error = function (xhr, status, error) {
        errorUser(xhr, status, error);
        if (error != 'abort') {

        }
    };

    var xhr = $.ajax(options);

    return xhr;
};

/**
 * Clear from error messages
 */
var clearFormData = function(form) {

if(form)
    form.find('.field-valid').each(function () {
        row = $(this);
        row.removeClass('error');
        row.find('.error-text').html('');
    });

    if(form[0].id == 'registrationForm') {
        $('.icheckbox').eq(1).removeClass('error-checkbox');
        if(!$('#termOfUse').prop('checked')) {
            $('.icheckbox').eq(1).addClass('error-checkbox').closest('.form-group-outer').addClass('error');
        }
    }
};

/**
 * Bind errors to form
 */
var bindFormErrors = function (form, errors) {

    form.find('.field-valid').removeClass('error');

    for (field in errors) {

        var row = $(form.find('#' + field).parents('.field-valid')[0]);
        row.addClass('error');
        row.find('.error-text').html($('<span class="red">' + errors[field][0] + '</span>'));

        if(row.parent().find('.necessary-string-icon').length) {
            row.parent().find('.necessary-string-icon').remove();
        }

        row.find('.success-password').addClass('hidden');
        row.find('.wrong-password').removeClass('hidden');
    }

    $.each(form.find('.field-valid'), function() {
        if(!$(this).hasClass('error')) {
            $(this).find('.wrong-password').addClass('hidden');
            $(this).find('.success-password').removeClass('hidden');
        }

    });
};

/**
 * Ajax form constructor 
 */
var ajaxForm = function (form, options, isFile) {
    var xhr;
    if (typeof options != 'object')
        var options = {};
    if (typeof options.before == 'function')
        options.before();

    form.submit(function (e) {
        e.preventDefault();
        if (xhr && xhr.readyState != 4) {
            return false;
        }
        var form = $(this);
        var url = $(this).attr('action');

        if(isFile) {
            var data = new FormData();

            if(isFileChanged) {
                data.append('file', $('input[type=file]')[0].files[0]);
            }
            if(isFileCleared) {
                data.append('isFileCleared', isFileCleared);
            }
                data.append(form.attr('id'), form.serialize());

        } else {
            var data = $(this).serialize();
        }

        xhr = ajaxQuery(url, data, {
            beforeSend: function (xhr) {
                clearFormData(form);
            },
            success: function (data) {
                if (data.error) {
                    bindFormErrors(form, data.data);
                    if (typeof options.error == 'function') {
                        options.error();
                    }
                } else if (typeof options.success == 'function') {
                    options.success(data);
                }
            },
            complete: function () {
                $.fancybox.hideLoading();
            }
        }, isFile);
        return false;
    });
};

/**
 * Clear form errors nofitication icons
 */
var clearNotificationIcons = function(form, toClear) {

    if(toClear) {
        $('input[type="text"], input[type="password"], input[type="email"]').val('');
    }

    $.each(form.find('.field-valid'), function() {
        if(!$(this).hasClass('error')) {
            $(this).find('.wrong-password').addClass('hidden');
            $(this).find('.success-password').addClass('hidden');
        }
    });
};

/**
 * Process change password form
 */
var visitorProfileChangePasswordForm = $('#fos_user_change_password_form');

ajaxForm(visitorProfileChangePasswordForm, {
    success: function (data) {
        clearNotificationIcons(visitorProfileChangePasswordForm, true);
        alert('Обновлен');
    },
    error: function () {
    }
});

/**
 * Process exhibitor registration form
 */
var exhibitorRegistrationForm = $('#exhibitor_registration_form');
ajaxForm(exhibitorRegistrationForm, {
    success: function (data) {
        clearNotificationIcons(exhibitorRegistrationForm, false);
        if(!data.error) {
            $('#sendRequestToBecomeExhibitor').attr('disabled', 'disabled');
            $('.fileupload').attr('disabled', 'disabled');
            $('.remove').addClass('inactiveLink');
            $('.user-login-panel-list .remark').text('Заявка в обработке');
            $('#reg-exh-status-notif').removeClass('hidden');
            var photoElement = $('#preview').parent('a');
            if(photoElement.attr('href') != undefined) {
                photoElement.removeAttr('href').removeAttr('id').addClass('inactiveLink');
            }
            alert('Обновлен');
        }
    },
    error: function () {
    }
}, true);
