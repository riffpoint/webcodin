<?php
/**
 * @file
 * The mail handler class in oauth2_mailer module, extend phpmailer library.
 */

/**
 * Added support XOAUTHAuthenticate access mechanism.
 */
class Oauth2MailerPHPMailer extends PHPMailer {

  /**
   * Whether to use XOAUTH authentication.
   *
   * @type bool
   */
  public $XOAUTHAuth = FALSE;

  /**
   * Client authorisation token.
   *
   * @type string
   */
  public $AuthToken = '';

  /**
   * Get an instance to use for SMTP operations.
   */
  public function getSMTPInstance() {
    if (!is_object($this->smtp)) {
      $this->smtp = new Oauth2MailerSMTP();
    }
    return $this->smtp;
  }

  /**
   * Send mail via SMTP.
   */
  public function smtpConnect($options = array()) {
    if (is_null($this->smtp)) {
      $this->smtp = $this->getSMTPInstance();
    }

    // Already connected?
    if ($this->smtp->connected()) {
      return TRUE;
    }

    $this->smtp->setTimeout($this->Timeout);
    $this->smtp->setDebugLevel($this->SMTPDebug);
    $this->smtp->setDebugOutput($this->Debugoutput);
    $this->smtp->setVerp($this->do_verp);
    $hosts = explode(';', $this->Host);
    $lastexception = NULL;

    foreach ($hosts as $hostentry) {
      $hostinfo = array();
      if (!preg_match('/^((ssl|tls):\/\/)*([a-zA-Z0-9\.-]*):?([0-9]*)$/', trim($hostentry), $hostinfo)) {
        // Not a valid host entry.
        continue;
      }

      $prefix = '';
      $tls = ($this->SMTPSecure == 'tls');
      if ($hostinfo[2] == 'ssl' or ($hostinfo[2] == '' and $this->SMTPSecure == 'ssl')) {
        $prefix = 'ssl://';
        $tls = FALSE;
      }
      elseif ($hostinfo[2] == 'tls') {
        $tls = TRUE;
      }
      $host = $hostinfo[3];
      $port = $this->Port;
      $tport = (integer) $hostinfo[4];
      if ($tport > 0 and $tport < 65536) {
        $port = $tport;
      }
      if ($this->smtp->connect($prefix . $host, $port, $this->Timeout, $options)) {
        try {
          if ($this->Helo) {
            $hello = $this->Helo;
          }
          else {
            $hello = $this->serverHostname();
          }
          $this->smtp->hello($hello);

          if ($tls) {
            if (!$this->smtp->startTLS()) {
              throw new phpmailerException($this->lang('connect_host'));
            }
            $this->smtp->hello($hello);
          }
          if ($this->SMTPAuth) {
            if (!$this->smtp->authenticate(
              $this->Username,
              $this->Password,
              $this->AuthType,
              $this->Realm,
              $this->Workstation
            )
            ) {
              throw new phpmailerException($this->lang('authenticate'));
            }
          }
          elseif ($this->XOAUTHAuth) {
            if (!$this->smtp->xoauthAuthenticate($this->AuthToken)) {
              throw new phpmailerException(t('SMTP Error: Could not authenticate.'));
            }
          }
          return TRUE;
        }
        catch (phpmailerException $exc) {
          $lastexception = $exc;
          $this->smtp->quit();
        }
      }
    }
    $this->smtp->close();
    if ($this->exceptions and !is_null($lastexception)) {
      throw $lastexception;
    }
    return FALSE;
  }

}
