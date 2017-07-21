/**
 * @file
 * Provide functionality for modal dialog.
 */

(function($) {

  Drupal.Mailer = Drupal.Mailer || {};

  Drupal.Mailer.window = function (form) {
    var url = form.find(':input[name=url]').val();
    var title = form.find(':input[type=submit]').val();
    if (url && title) {
      var width = 800;
      var height = 600;
      var left = (screen.width / 2) - (width / 2);
      var top = (screen.height / 2) - (height / 2);

      var popup = window.open(
        url,
        title,
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
      );
      popup.focus();
    }
  };

  Drupal.behaviors.butonhandler = {
    attach: function(context, settings) {

      $('#mailer').once(function() {

        var mailer = $(this);

        $("form[id*='oauth2-mailer-authentication-form']").submit(function(e) {
          e.preventDefault();
          Drupal.Mailer.window($(this));
        });

        var toggleMailerWindow = function(event){
          if (event == 'click') {
            mailer.toggleClass('minimize');
          }
          mailer.find('.mailer-content').toggle();
          mailer.find('a.mailer-minimize-window').toggleClass('window-minimized');
        }

        var isShowedMailerWindow = function(){
          return parseInt($.cookie('isShowedMailerWindow'));
        }

        var deleteMailWindowCookie = function(){
          $.cookie('isShowedMailerWindow', null, { path: '/'});
        }

        var setMailWindowCookie = function(value){
          $.cookie('isShowedMailerWindow' , value, { path: '/'})
        }

        mailer.delegate('a.mailer-minimize-window', 'click', function(e) {
          toggleMailerWindow('click');
          isShowedMailerWindow() ? setMailWindowCookie(0) : setMailWindowCookie(1);
          e.preventDefault();
        });

        mailer.delegate('a.mailer-close-window', 'click', function(e) {
          mailer.empty();
          deleteMailWindowCookie();
          e.preventDefault();
        });

        if (!isShowedMailerWindow()) {
          toggleMailerWindow();
        }

      });

      $('.mailer-messages').delay(4000).slideUp('slow', function(){
          $(this).empty();
      });
    }
  };

})(jQuery);
