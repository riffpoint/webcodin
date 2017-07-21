(function($) {  
    $(document).ready(function() {
        mail_edit.init(); 
        
    });
})(jQuery);

var mail_edit = {
    ajaxReinit: function () {
        App.init();
        ComponentsEditors.init();
        mail_edit.init();
    }, 
    init : function () {
        var ckeditor1=CKEDITOR.replace('content', {
                language: 'en'
                ,toolbarGroups : [
                                { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                                { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
                                { name: 'links' },
                                { name: 'insert'},
                                { name: 'tools' },
                                { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
                                { name: 'others' },
                                { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
                                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                                { name: 'styles' },
                                { name: 'colors' },
                                { name: 'about' }
                        ]
        });
        AjexFileManager.init({returnTo: 'ckeditor'
                                        ,editor: ckeditor1
                                        ,lang: 'en'
        });
        FormValidation.init();
        
        $('#all_cancel').click(function(){
            var params = {action: 'review'};
            ajax_action(params);
        });        
    }
}

var FormValidation = function () {

    var handleValidation = function() {

            var form = $('#mail_setting_edit');
            
            form.on('submit', function() {
                for(var instanceName in CKEDITOR.instances) {
                    CKEDITOR.instances[instanceName].updateElement();
                }
            })

            form.validate({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: false,
                ignore: "",
                rules: {
                    subject: {
                        minlength: 2,
                        required: true
                    },
                    description: {
                        minlength: 2,
                        required: true
                    },
                    content: {
                        minlength: 2,
                        required: true
                    },
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },

            });

    }
    return {
        //main function to initiate the module
        init: function () {
            handleValidation();
        }

    };
}();

function ajax_action(params){
        if (!!params['action']) {
            $('.ajax-main').load("", params, function (responseText, textStatus, XMLHttpRequest) {
                mail_edit.ajaxReinit();
            });
        }
}
