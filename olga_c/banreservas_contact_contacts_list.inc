<?php

/**
 * @file
 * Ctools plugin for contact information block.
 */

$plugin = array(
  'single' => TRUE,
  'title' => t('BanReservas: Contact information'),
  'description' => t('You can choose contact information for displaying in the block.'),
  'category' => t('BanReservas'),
  'edit form' => 'banreservas_contact_contacts_list_edit_form',
  'render callback' => 'banreservas_contact_contacts_list_render',
  'admin info' => 'banreservas_contact_contacts_list_admin_info',
  'defaults' => array(
    'banreservas_contact_block' => 'footer',
    'banreservas_contact_list_show' => FALSE,
    'banreservas_social_list_show' => FALSE,
  ),
);

/**
 * Render block with contact information.
 */
function banreservas_contact_contacts_list_render($subtype, $conf, $args, $contexts) {
  $items = $social_items = $content = array();
  $block_name = $conf['banreservas_contact_block'];
  $contacts = variable_get('banreservas_contact_block_' . $block_name, array());

  // Contextual links.
  $contextual_links = array(
    '#prefix' => '<div class="contextual-links-wrapper">',
    '#suffix' => '</div>',
    '#theme' => 'links__contextual',
    '#links' => array(
      'banreservas-edit-contacts' => array(
        'title' => t('Edit contacts list'),
        'href' => 'admin/banreservas/contact-settings/blocks/' . $block_name,
        'query' => array('destination' => current_path()),
      ),
    ),
    '#attributes' => array('class' => array('contextual-links')),
    '#attached' => array(
      'library' => array(array('contextual', 'contextual-links')),
    ),
    '#access' => user_access('access contextual links'),
  );

  // Generate list of the contact information.
  if (isset($conf['banreservas_contact_list_show']) && $conf['banreservas_contact_list_show']) {
    $block_contacts = array();
    $contact_list = variable_get('banreservas_contacts', array());
    if (isset($contacts['contact_list']) && !empty($contacts['contact_list'])) {
      foreach ($contacts['contact_list'] as $key => $value) {
        // Display only elements which are checked as "show".
        if ($value['show'] && isset($contact_list[$value['key']])) {
          $contact_weight[$value['key']] = $value['weight'];
          $block_contacts[$value['key']] = $contact_list[$value['key']];
        }
      }
    }

    if ($block_contacts) {
      // Sort by weight.
      array_multisort($contact_weight, SORT_ASC, $block_contacts);
      foreach ($block_contacts as $item) {
        // Use different themes for different types of the contact information.
        $theme = 'banreservas_contact_simple';
        if ($item['type'] == 'tel' || $item['type'] == 'email') {
          $theme = 'banreservas_contact_' . $item['type'];
        }
        $items[] = theme($theme, array('content' => $item));
      }

      $content['contacts'] = theme('item_list', array(
        'items' => $items,
        'attributes' => array(
          'class' => array('site-contacts-list'),
        ),
      ));
      $content['contacts_contextual_links'] = drupal_render($contextual_links);
    }
  }

  // Generate list of the social links.
  if (isset($conf['banreservas_social_list_show']) && $conf['banreservas_social_list_show']) {
    $block_slinks = array();
    $social_links = variable_get('banreservas_social_links', array());
    if (isset($contacts['social_link_list']) && !empty($contacts['social_link_list'])) {
      foreach ($contacts['social_link_list'] as $key => $value) {
        // Display onle elements which are checked as "show".
        if ($value['show'] && isset($social_links[$value['key']])) {
          $social_links_weight[$value['key']] = $value['weight'];
          $block_slinks[$value['key']] = $social_links[$value['key']];
        }
      }
    }

    if ($block_slinks) {
      // Sort by weight.
      array_multisort($social_links_weight, SORT_ASC, $block_slinks);
      foreach ($block_slinks as $item) {
        $social_items[] = theme('banreservas_contact_social_link', array('content' => $item));
      }

      $content['social_links'] = theme('item_list', array(
        'items' => $social_items,
        'attributes' => array(
          'class' => array('site-social-list'),
        ),
      ));
      $contextual_links['#links']['banreservas-edit-contacts']['fragment'] = 'edit-banreservas-contact-block-' . $block_name . '-social-link-list';
      $content['social_contextual_links'] = drupal_render($contextual_links);
    }
  }

  // Render as a block.
  $block = new stdClass();
  $block->title = '';
  $block->content = theme('banreservas_contact_list', array('content' => $content));
  return $block;
}

/**
 * Render admin info form.
 */
function banreservas_contact_contacts_list_admin_info($subtype, $conf, $contexts) {
  if (!empty($conf)) {
    $content = '';
    $block = new stdClass();
    $block->title = $conf['override_title'] ? $conf['override_title_text'] : '';
    $block->content = $content;
    return $block;
  }
}

/**
 * Render config form.
 */
function banreservas_contact_contacts_list_edit_form($form, &$form_state) {
  $conf = $form_state['conf'];

  $block_types = array(
    'footer' => t('Footer'),
    'aside' => t('Aside'),
  );
  $form['banreservas_contact_block'] = array(
    '#type' => 'radios',
    '#title' => t('Type of the block'),
    '#default_value' => isset($conf['banreservas_contact_block']) ? $conf['banreservas_contact_block'] : 'footer',
    '#options' => $block_types,
  );

  $form['banreservas_contact_list_show'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show contact list in block'),
    '#default_value' => isset($conf['banreservas_contact_list_show']) ? $conf['banreservas_contact_list_show'] : FALSE,
  );

  $form['banreservas_social_list_show'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show social links in block'),
    '#default_value' => isset($conf['banreservas_social_list_show']) ? $conf['banreservas_social_list_show'] : FALSE,
  );

  return $form;
}

/**
 * Pane config form submit function.
 */
function banreservas_contact_contacts_list_edit_form_submit($form, &$form_state) {
  foreach (array_keys($form_state['plugin']['defaults']) as $key) {
    if (isset($form_state['values'][$key])) {
      $form_state['conf'][$key] = $form_state['values'][$key];
    }
  }
}
