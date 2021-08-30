<?php

/**
 * @file
 * @author <info@webcodin.com>
 * Contains ValidateConstrainEmail
 */

namespace Drupal\yyy_countdown\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\datetime\Plugin\Field\FieldWidget\DateTimeDefaultWidget;

/**
 * Plugin implementation of the 'countdown_default' widget.
 *
 * @FieldWidget(
 *   id = "countdown_default",
 *   label = @Translation("CountDown timer date"),
 *   field_types = {
 *     "countdown"
 *   }
 * )
 */
class CountDownDefaultWidget extends DateTimeDefaultWidget {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $form_element =  parent::formElement($items, $delta, $element, $form, $form_state);
    return $form_element;
  }
}
