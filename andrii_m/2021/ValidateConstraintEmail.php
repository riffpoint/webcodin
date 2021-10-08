<?php

/**
 * @file
 * @author <info@webcodin.com>
 * Contains ValidateConstrainEmail
 */

namespace Drupal\yyy_user\Validate;

use Drupal\Core\Form\FormStateInterface;

/**
 * Form API callback. Validate element value.
 */
class ValidateConstraintEmail {

  /**
   * Validates given element.
   *
   * @param array              $element      The form element to process.
   * @param FormStateInterface $formState    The form state.
   * @param array              $form The complete form structure.
   */
  public static function validate(array &$element, FormStateInterface $formState, array &$form) {
    $webformKey = $element['#webform_key'];
    $value = $formState->getValue($webformKey);
    if ($value === '' || is_array($value)) {
      return;
    }
    $error = FALSE;
    $user_exist = user_load_by_mail($value);
    if(!empty($user_exist)) {
      $error = TRUE;
    }
    if ($error) {
      $tArgs = array(
        '%value' => $value,
        '@help' =>'/user/password'
      );
      $message = t('The user with an email %value already exists. You can <a href="@help" class="user-reset-link">reset password</a> here.', $tArgs);
      $formState->setError(
        $element,
        $message
      );
    }
    $helper = \Drupal::service('yyy_user.helper');
    $isEmailExists = $helper->isEmailExist($value, 'yyy_user');
    if (!$isEmailExists) {
      $tArgs = array(
        '%value' => $value,
        '@help' =>'/user/password'
      );
      $message = t('The email %value is not valid. Verify email you have entered.', $tArgs);
      $formState->setError(
        $element,
        $message
      );
    }
  }
}
