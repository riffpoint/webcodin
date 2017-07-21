<?php
/**
 * @file
 * Contains \Drupal\sonus_global\Plugin\EntityReferenceSelection\TermVocabularySelection.
 */

namespace Drupal\sonus_global\Plugin\EntityReferenceSelection;

use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\taxonomy\Plugin\EntityReferenceSelection\TermSelection;
use Drupal\Core\Form\FormStateInterface;


/**
 * Provides specific access control for the taxonomy_term entity type.
 *
 * @EntityReferenceSelection(
 *   id = "sonus_global_taxonomy_vocabulary_select",
 *   label = @Translation("Taxonomy term selection by vocabulary"),
 *   entity_types = {"taxonomy_term"},
 *   group = "sonus_global_taxonomy_vocabulary_select",
 *   weight = 2
 * )
 */
class TermVocabularySelection extends TermSelection {

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);

    $selection_handler_settings = $this->configuration['handler_settings'];
    // Merge-in default values.
    $selection_handler_settings += [
      'max_depth' => NULL,
    ];

    $form['max_depth'] = [
      '#type' => 'number',
      '#title' => $this->t('Max depth'),
      '#default_value' => $selection_handler_settings['max_depth'],
      '#min' => 0,
      '#max' => 10,
      '#step' => 1,
    ];

    return $form;

  }

  /**
   * {@inheritdoc}
   */
  public function getReferenceableEntities($match = NULL, $match_operator = 'CONTAINS', $limit = 0) {

    if ($match || $limit) {
      return parent::getReferenceableEntities($match, $match_operator, $limit);
    }

    $options = [];

    $bundles = $this->entityManager->getBundleInfo('taxonomy_term');
    $handler_settings = $this->configuration['handler_settings'];
    $bundle_names = !empty($handler_settings['target_bundles']) ? $handler_settings['target_bundles'] : array_keys($bundles);

    $max_depth = NULL;
    if (isset($handler_settings['max_depth']) && $handler_settings['max_depth']) {
      $max_depth = $handler_settings['max_depth'];
    }

    foreach ($bundle_names as $bundle) {
      if ($vocabulary = Vocabulary::load($bundle)) {
        $terms = $this->entityManager
          ->getStorage('taxonomy_term')
          ->loadTree($vocabulary->id(), 0, $max_depth, TRUE);
        if ($terms) {
          foreach ($terms as $term) {
            $options[$vocabulary->id()][$term->id()] = str_repeat('--', $term->depth) . $term->label();
          }
        }
      }
    }

    return $options;
  }

}
