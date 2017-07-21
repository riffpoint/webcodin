<?php

/**
 * @file
 * Class MailerClient.
 */

namespace OAuth2;

/**
 * Used to get authorization from an oauth2 server.
 */
class MailerClient extends Client {

  protected $client;
  protected $params;

  /**
   * Add scope parameters.
   */
  public function __construct($params = NULL, $id = NULL) {
    $this->client = $this->getClient();
    $this->params = $this->client->getParams();
    parent::__construct($this->params, $this->client->name);
  }

  /**
   * Get refresh token.
   */
  public function getRefreshToken() {
    return $this->token['refresh_token'];
  }

  /**
   * Get token info. We must check token before use.
   */
  public function getTokenInfo() {
    if ($this->token['access_token']) {
      return $this->validateToken($this->token['access_token']);
    }
    return FALSE;
  }

  /**
   * Verifying a token.
   */
  protected function validateToken($token) {
    $token_validate = $this->params['token_validate'] . '?access_token=' . $token;
    $result = $this->request($token_validate);

    if ($result->code != 200) {
      if (isset($_SESSION['oauth2_client']['token'][$this->id])) {
        unset($_SESSION['oauth2_client']['token'][$this->id]);
      }
      return FALSE;
    }

    return drupal_json_decode($result->data);
  }

  /**
   * Get and return an access token.
   */
  protected function getToken($data) {
    $client_id = $this->params['client_id'];
    $client_secret = $this->params['client_secret'];
    $token_endpoint = $this->params['token_endpoint'];

    $data += array(
      'client_id' => $client_id,
      'client_secret' => $client_secret,
    );

    $result = $this->request($token_endpoint, 'POST', $data, array('Content-Type' => 'application/x-www-form-urlencoded'));

    if ($result->code != 200) {
      throw new \Exception(
        t("Failed to get an access token of grant_type @grant_type.\nError: @result_error",
          array(
            '@grant_type' => $data['grant_type'],
            '@result_error' => $result->error,
          ))
      );
    }

    return drupal_json_decode($result->data);
  }

  /**
   * Sends data to specified URL.
   */
  public function request($url, $method = 'GET', $data = array(), array $headers = array()) {
    $options = array(
      'headers' => $headers,
      'method' => $method,
    );

    if (!empty($data)) {
      $options['data'] = drupal_http_build_query($data);
    }

    return drupal_http_request($url, $options);
  }

  /**
   * Get get current client object.
   */
  public function getClient() {
    $client_name = variable_get('oauth2_mailer_provider_enabled', 'Google');
    $providers = oauth2_mailer_providers('model');
    oauth2_mailer_provider_include($providers, $client_name);
    $client_class_name = 'OAuth2\\' . $client_name;
    if (class_exists($client_class_name)) {
      return new $client_class_name();
    }
    else {
      drupal_set_message(t("Settings not found"), 'error');
    }
    return FALSE;
  }

  /**
   * Send mail.
   */
  public function sendMail($to = '', $subject = '', $body = '') {
    $params = array();
    $token_info = $this->getTokenInfo();
    if ($token_info && isset($token_info['email'])) {
      $access_token = $this->getAccessToken();
      $from = $token_info['email'];
      $params['xoauth2_request'] = oauth2_mailer_construct_auth_string($from, $access_token);
      $this->client->sendMail($to, $subject, $body, $params, $from);
    }
    else {
      drupal_set_message(t("Wrong access token"), 'error');
    }
  }

}
