/**
 * @file
 * Close window opener after get access.
 */

(function($) {
  Drupal.behaviors.closeMailer = {
    attach: function (context, settings) {
      try {
        if (window.opener && window.opener.location.hostname === window.location.hostname) {
          window.opener.location.reload();
          window.self.close();
        }
      }
      catch (e) {

      }
    }
  };
})(jQuery);
