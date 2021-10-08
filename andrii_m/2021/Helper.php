<?php

/**
 * @file
 * @author <info@webcodin.com>
 * Contains ValidateConstrainEmail
 */

namespace Drupal\yyy_user\Services;

use GuzzleHttp\Exception\RequestException;

/**
 * Service helper.
 */
class Helper {

  /**
   * Check if email exist
   */
  public function isEmailExist($email, $moduleName) {
    $excludeMail = ['yandex.ru','yandex.com', 'mail.ru', 'list.ru', 'ya.ru', 'inbox.ru', 'bk.ru', 'rambler.ru'];
    $domainFull = explode('@', $email);

    if (in_array($domainFull[1], $excludeMail)) {
      return FALSE;
    }
    $domainLast = explode('.', $domainFull[1]);
    if ($domainLast[1] == 'ru') {
      return FALSE;
    }

    $client = \Drupal::httpClient();

    try {
      $api_key = 'XXX-XXX-XXX-XXX';
      $url = 'https://emailcheckservice.com/emails.json?address='. $email .'&apikey='. $api_key;
      $response = $client->get($url);
      $responseData = $response->getBody()->getContents();
      if (!empty($responseData)) {

        $responseResult = json_decode($responseData);
        if ($responseResult->status == 'invalid') {
          \Drupal::logger($moduleName)
            ->error('The contact "%contact" is not valid: %results', [
              '%contact' => $email,
              '%results' => $responseData
            ]);

          return FALSE;
        }
        else {
          return TRUE;
        }
      }
      else {
        \Drupal::logger($moduleName)
          ->error('There was an error validating the contact "%contact", code: %code', [
            '%contact' => $email,
            '%code' => $response->getStatusCode()
          ]);

        return FALSE;
      }
    }
    catch (RequestException $e) {
      \Drupal::logger($moduleName)
        ->error('There was an error validating the contact "%contact"', [
          '%contact' => $email
        ]);

      return FALSE;
    }
  }
}
