<?php

/**
 * @file
 * @author <info@webcodin.com>
 * Contains ValidateConstrainEmail
 */

namespace Drupal\yyy_countdown\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\datetime\Plugin\Field\FieldType\DateTimeItem;

/**
 * Plugin implementation of the 'datetime' field type.
 *
 * @FieldType(
 *   id = "countdown",
 *   label = @Translation("CountDown Timer"),
 *   description = @Translation("Create and store countdown date values."),
 *   default_widget = "countdown_default",
 *   default_formatter = "countdown_default",
 *   list_class = "\Drupal\datetime\Plugin\Field\FieldType\DateTimeFieldItemList",
 *   constraints = {"DateTimeFormat" = {}}
 * )
 */
class CountDownItem extends DateTimeItem {

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    return parent::propertyDefinitions($field_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return parent::schema($field_definition);
  }

  /**
   * {@inheritdoc}
   */
  public function storageSettingsForm(array &$form, FormStateInterface $form_state, $has_data) {
    $element = parent::storageSettingsForm($form, $form_state, $has_data);
    unset($element["datetime_type"]["#options"]["date"]);
    return $element;
  }
}
