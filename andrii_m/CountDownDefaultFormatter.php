<?php

/**
 * @file
 * @author <info@webcodin.com>
 * Contains ValidateConstrainEmail
 */

namespace Drupal\yyy_countdown\Plugin\Field\FieldFormatter;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\datetime\Plugin\Field\FieldFormatter\DateTimeDefaultFormatter;

/**
 * Plugin implementation of the 'Default' formatter for 'countdown' field.
 *
 * @FieldFormatter(
 *   id = "countdown_default",
 *   label = @Translation("Default"),
 *   field_types = {
 *     "countdown"
 *   }
 * )
 */
class CountDownDefaultFormatter extends DateTimeDefaultFormatter{

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $form = parent::settingsForm($form, $form_state);
    unset($form["format_type"]);
    return $form;
  }
  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $date = new DrupalDateTime();
    $summary[] = t('Format: @display', ['@display' => $this->formatDate($date)]);
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  protected function formatDate($date) {
    $format_type = 'long';
    $timezone = $this->getSetting('timezone_override') ?: $date->getTimezone()->getName();
    return $this->dateFormatter->format($date->getTimestamp(), $format_type, '', $timezone != '' ? $timezone : NULL);
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = parent::viewElements($items, $langcode);
    foreach($elements as $key => $elem) {
      $elements[$key]['#theme'] = 'countdown';
    }
    return $elements;
  }
}
