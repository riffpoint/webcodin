<?php
/**
 * @file
 * Class OAuth2\Google.
 */

namespace OAuth2;

/**
 * @file
 * Base class for Google provider.
 */
class Google {

  /**
   * Provider name.
   */
  public $name;

  /**
   * Construct an OAuth2\Google object..
   */
  public function __construct() {
    $this->name = 'Google';
  }

  /**
   * Scope list.
   */
  public function getScope() {
    $permissions = array(
      'https://mail.google.com',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.email',
    );

    return implode(' ', $permissions);
  }

  /**
   * Get provider params.
   */
  public function getParams() {
    global $base_url;
    $server_url = 'https://accounts.google.com/o';
    $provider_id = $this->name;

    $params = array(
      'auth_flow' => 'server-side',
      'client_id' => variable_get('oauth2_mailer_provider_' . $provider_id . '_client_id', ''),
      'client_secret' => variable_get('oauth2_mailer_provider_' . $provider_id . '_key_secret', ''),
      'token_endpoint' => $server_url . '/oauth2/token',
      'token_validate' => 'https://www.googleapis.com/oauth2/v1/tokeninfo',
      'authorization_endpoint' => $server_url . '/oauth2/auth',
      'redirect_uri' => $base_url . '/oauth2/authorized',
      'scope' => $this->getScope(),
      'access_type' => 'offline',
    );

    return $params;
  }

  /**
   * Send Mail to user.
   */
  public function sendMail($to = '', $subject = '', $body = '', $params = array(), $from = NULL) {

    try {
      $config = $this->getMailConfig($params);

      if (oauth2_mailer_xoauth_send_mail($to, $subject, $body, $config, $from)) {
        drupal_set_message(t('Your email was sent successfully'));
      }
      else {
        drupal_set_message(t("Sending mail is failed"), 'error');
      }
    }
    catch (\Exception $e) {
      drupal_set_message(t("Can't sent email"), 'error');
    }
  }

  /**
   * Get SMTP config for send mails.
   */
  public function getMailConfig($params) {
    $provider_id = $this->name;
    $config = array(
      'ssl' => variable_get('oauth2_mailer_provider_' . $provider_id . '_encryption', 'ssl'),
      'port' => variable_get('oauth2_mailer_provider_' . $provider_id . '_port', '465'),
      'host' => variable_get('oauth2_mailer_provider_' . $provider_id . '_host', 'smtp.gmail.com'),
      'xoauth2_request' => $params['xoauth2_request'],
    );

    return $config;
  }

}
