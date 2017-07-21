if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  }
}

function form_current_file () {
    
};

form_current_file.prototype = {
    file : ''
};


function FormDataUnsafe() {
    this.dict = {};
};

FormDataUnsafe.prototype.append = function(key, value) {
    this.dict[key] = value;
};

FormDataUnsafe.prototype.contains = function(key) {
    return this.dict.hasOwnProperty(key);
};

FormDataUnsafe.prototype.getValue = function(key) {
    return this.dict[key];
};

FormDataUnsafe.prototype.valueOf = function() {
    var fd = new FormData();
    for(var key in this.dict) {
        if (this.dict.hasOwnProperty(key))
            fd.append(key, this.dict[key]);
    }

    return fd;
};

FormDataUnsafe.prototype.safe = function() {
    return this.valueOf();
};

(function($) {  

    $( window ).load(function() {

    });
    
    $(document).ready(function() { 
        
       if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
            $('body').addClass("chrome");            
       }  
       
       if(/safari/.test(navigator.userAgent.toLowerCase())){
            $('body').addClass("safari");
       }
       
       if(isIE() && isIE() < 10) {
            $('body').addClass("ie");
       }
        
        window.FCF = new form_current_file();
        
        $('.cl-preview .cl-item a').click(function (event) {
            var id = $(this).attr('id').slice(3);
            if (id) {
                if (window.FForm.prototype._locked()) {event.preventDefault(); return false;}                
                window.FForm.prototype._hideCtrl( $('.fs-submit').get(0) ); 
                window.FForm.prototype._hideCtrl( $('.fs-continue').get(0) );                    
                window.FForm.prototype._showCtrl( $('.fs-alt-continue').get(0) );                                    
                $('.fs-nav-dots button').eq(id).click(); 
            }
            return false;
        });
        
        $('#certificate-form #image').bind('change', function (event) {
            window.FForm.prototype._lock();
            event.stopPropagation(); // Stop stuff happening
            event.preventDefault(); // Totally stop stuff happening
            window.FCF.file = undefined;
            // Create a formdata object and add the files
            
            files = event.target.files;
            if (files) {
                var data = new FormData();                
                $.each(files, function(key, value) {
                    data.append(key, value);
                });         
                if (!!window.FCF.file) {
                    data.append('delete', window.FCF.file.file_name );                    
                }

                $.ajax({
                    url: 'upload-image',
                    type: 'POST',
                    data: data,
                    //data: data.safe(),
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    success: function(data, textStatus, jqXHR) {
                        if(typeof data.error === 'undefined')
                        {
                            window.FCF.file = data['upload_data'];
                            $('.cl-preview .cl-name span').html($('#name').val());
                            $('.cl-preview .cl-team span').html($('#team').val());

                            if (window.FCF.file) {
                                $('.cl-preview #preview').val(window.FCF.file.file_name);                    
                                $('.cl-preview .cl-image .cl-image-review img').attr('src', '/thanks/uploads/cache/'+window.FCF.file.file_name);
                            } else {
                                $('.cl-preview #preview').val('');                    
                                $('.cl-preview .cl-image .cl-image-review img').attr('src', '');
                            }
                            window.FForm.prototype._showError('IMGUPLOADED', 'image');
                        } else {
                            // Handle errors here
                            //console.log('ERRORS: ' + data.error.error);
                            window.FForm.prototype._showError(data.error.error, 'image');
                        }
                        window.FForm.prototype._unlock();                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // Handle errors here
                        console.log('ERRORS: ' + textStatus);
                        // STOP LOADING SPINNER
                        window.FForm.prototype._unlock();                        
                    }
                }); 
            } else {
                window.FForm.prototype._showError('IMGUPLOADED', 'image');                
                window.FForm.prototype._unlock();                
            }           
        });
        
        var formWrap = document.getElementById( 'fs-form-wrap' );

        [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {	
            new SelectFx( el, {
                stickyPlaceholder: false,
                onChange: function(val){
                    document.querySelector('span.cs-placeholder').style.backgroundColor = val;
                }
            });
        } );

        if ($('.certificate-form').length > 0) {
            $('body').scrollTo('#certificate-form-container');            
            $('.logo a').click(function (e) {
                e.preventDefault();
                $('body').scrollTo('#certificate-form-container');
                return false;
            })        
            
            new FForm( formWrap, {
                ctrlProgress : false,
                onReview : function() {
                    classie.add( document.body, 'overview' ); 
                },
                onCreatePreview : function(){
                    $('.cl-preview .cl-name span').html($('#name').val());
                    $('.cl-preview .cl-team span').html($('#team').val());

                    if (window.FCF.file) {
                        $('.cl-preview #preview').val(window.FCF.file.file_name);                    
                        $('.cl-preview .cl-image .cl-image-review img').attr('src', '/thanks/uploads/cache/'+window.FCF.file.file_name);
                    } else {
                        $('.cl-preview #preview').val('');                    
                        $('.cl-preview .cl-image .cl-image-review img').attr('src', 'application/views/img/site/no-preview.png');
                    }
                },
                onSubmit : function() {
                    window.FForm.prototype._lock();
                    $( "#certificate-form" ).submit();                    
                }
            } );  
        }
        
        
        $('#certificate-print').bind( 'click', function (event) {
            event.preventDefault();
            window.print();
            return false;
        });
        
        $('#certificate-form .upload-file').bind( 'click', function (event) {
            if (window.FForm.prototype._locked()) {event.preventDefault(); return false;}            
            return true;
        });        
        
    });
    
    function isIE () {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    }
    
})(jQuery);
