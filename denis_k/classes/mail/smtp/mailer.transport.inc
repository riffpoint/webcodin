<?php

/**
 * @file
 * SMTP mail transport class for the oauth2_mailer module.
 */

 /**
  * Added support XOAUTHAuthenticate access mechanism.
  */
class Oauth2MailerSMTP extends SMTP {

  /**
   * AUTH XOAUTH2 authentication.
   *
   * Must be run after running the Hello() method.
   * Returns TRUE if successfully authenticated.
   */
  public function xoauthAuthenticate($auth_token) {
    if (!$this->sendCommand('AUTH', 'AUTH XOAUTH2 ' . $auth_token, 235)) {
      return FALSE;
    }

    return TRUE;
  }

}
