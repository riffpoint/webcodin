
/**
 * @file
 * @author <info@webcodin.com>
 * Contains ValidateConstrainEmail
 */

(function ($, Drupal, drupalSettings) {
    "use strict";
    /**
     * Attaches the JS countdown behavior
     */
    Drupal.behaviors.jsCountdownTimer = {
        attach: function (context) {
            var note = $('#yyy-countdown-timer-note'),
                ts = new Date(drupalSettings.countdown.unixtimestamp * 1000);

            $(context).find('#yyy-countdown-timer').once('yyy-countdown-timer').countdown({
                timestamp: ts,
                font_size: drupalSettings.countdown.fontsize,
                callback: function (weeks, days, hours, minutes, seconds) {
                    var dateStrings = new Array();
                    dateStrings['@weeks'] = Drupal.formatPlural(weeks, '1 week', '@count weeks');
                    dateStrings['@days'] = Drupal.formatPlural(days, '1 day', '@count days');
                    dateStrings['@hours'] = Drupal.formatPlural(hours, '1 hour', '@count hours');
                    dateStrings['@minutes'] = Drupal.formatPlural(minutes, '1 minute', '@count minutes');
                    dateStrings['@seconds'] = Drupal.formatPlural(seconds, '1 second', '@count seconds');
                    var message = Drupal.t('@weeks, @days, @hours, @minutes, @seconds left', dateStrings);
                    note.html(message);
                }
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
