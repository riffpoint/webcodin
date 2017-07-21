<?php

namespace Drupal\sonus_search\Plugin\search_api\processor;

use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Processor\ProcessorPluginBase;
use Drupal\search_api\Processor\ProcessorProperty;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Adds a custom "content type" to the indexed data.
 *
 * @SearchApiProcessor(
 *   id = "sonus_combined_image",
 *   label = @Translation("Combined Image"),
 *   description = @Translation("Combined image based on node and taxonomy term fields."),
 *   stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = false,
 * )
 */
class SonusCombinedImage extends ProcessorPluginBase {

  protected $imageFields;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, array $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->imageFields = [
      'field_image',
      'field_blog_small_image',
      'field_featured_image',
    ];
  }

  /**
  * {@inheritdoc}
  */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {
    $properties = [];

    if (!$datasource) {
      $definition = [
        'label' => $this->t('Combined Image'),
        'description' => $this->t('Combined image based on node and taxonomy term fields.'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
      ];
      $properties['sonus_combined_image'] = new ProcessorProperty($definition);
    }

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function addFieldValues(ItemInterface $item) {
    $entity = $item->getOriginalObject()->getValue();

    foreach ($this->getFieldsHelper()->filterForPropertyPath($item->getFields(), NULL, 'sonus_combined_image') as $field) {
      if (!$field->getDatasourceId()) {
        $value = '';
        foreach ($this->imageFields as $combined_field) {
          if ($entity->{$combined_field}) {
            $value = $entity->{$combined_field}->getValue();
            if (!empty($value[0])) {
              $value = $value[0]['target_id'];
              break;
            }
            else {
              $value = '';
            }
          }
        }
        $field->addValue($value);
      }
    }
  }
}
