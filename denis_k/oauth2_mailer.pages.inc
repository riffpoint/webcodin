<?php
/**
 * @file
 * Page callbacks for auth in window popup.
 */

/**
 * Callback for authorization user in window popup.
 */
function oauth2_mailer_window($provider = NULL) {
  if ($provider) {
    if (_oauth2_mailer_window_auth($provider)) {
      _oauth2_mailer_page_close();
    }
  }
  else {
    if (!isset($_POST['js']) || $_POST['js'] != 'true') {
      drupal_not_found();
    }
    _oauth2_mailer_window_open();
  }
}

/**
 * Get access token in new window popup.
 */
function _oauth2_mailer_window_auth($provider_id) {

  if (oauth2_mailer_get_provider_name($provider_id)) {
    $client = new OAuth2\MailerClient();
    $client->getClient();

    if ($token = $client->getAccessToken()) {
      return $token;
    }
  }
  else {
    drupal_set_message(t('Wrong provider type.'), 'error');
  }

  return FALSE;
}

/**
 * Open new window popup.
 */
function _oauth2_mailer_window_open() {
  $commands = array();

  $client = new OAuth2\MailerClient();
  $provider = $client->getClient();

  $commands[] = oauth2_mailer_ajax_command_window(
    current_path() . '/' . $provider->name,
    $provider->name
  );

  $page = array('#type' => 'ajax', '#commands' => $commands);

  ajax_deliver($page);
  drupal_exit();
}

/**
 * Close window popup.
 */
function _oauth2_mailer_page_close() {
  drupal_add_js(drupal_get_path('module', 'oauth2_mailer') . '/theme/mailer.close.js');
  $page = element_info('page');
  $page['#show_messages'] = FALSE;
  $page['#children'] = t('Closing...');
  print theme('html', array('page' => $page));
  drupal_exit();
}
