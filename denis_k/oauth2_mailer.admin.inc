<?php

/**
 * @file
 * Provides administrative OAuth2 mailer functionality.
 */

/**
 * Administrative settings.
 */
function oauth2_mailer_settings() {

  $form['vtabs'] = array(
    '#type' => 'vertical_tabs',
  );

  $form['vtabs']['mail_providers'] = array(
    '#type' => 'fieldset',
    '#title' => t('Oauth2 mailer providers'),
    '#theme' => 'oauth2_mailer_admin_settings_providers_table',
  );
  foreach (oauth2_mailer_providers_list() as $provider_id => $provider_name) {
    $available = array_key_exists($provider_id, oauth2_mailer_providers('model'));
    $form['vtabs']['mail_providers'][$provider_id]['icon'] = array(
      '#theme' => 'oauth2_mailer_provider_icon',
      '#provider_id' => $provider_id,
    );
    $form['vtabs']['mail_providers'][$provider_id]['oauth2_mailer_provider_enabled'] = array(
      '#type' => 'radio',
      '#title' => drupal_placeholder($provider_name),
      '#return_value' => $provider_id,
      '#attributes' => array('name' => array('oauth2_mailer_provider_enabled')),
    );
    if ($provider_id == variable_get('oauth2_mailer_provider_enabled', 'Google')) {
      $form['vtabs']['mail_providers'][$provider_id]['oauth2_mailer_provider_enabled']['#attributes']['checked'] = 'checked';
    }
    $form['vtabs']['mail_providers'][$provider_id]['file'] = array(
      '#markup' => $available ? t('Yes') : t('No'),
    );
    $form['vtabs']['mail_providers'][$provider_id]['oauth2_mailer_provider_' . $provider_id . '_weight'] = array(
      '#type' => 'weight',
      '#delta' => 50,
      '#default_value' => variable_get('oauth2_mailer_provider_' . $provider_id . '_weight', 50),
      '#attributes' => array('class' => array('oauth2-mailer-provider-weight')),
    );
    $form['vtabs']['mail_providers'][$provider_id]['settings'] = array(
      '#type' => 'link',
      '#title' => t('Settings'),
      '#href' => 'admin/config/services/oauth2_mailer/provider/' . $provider_id,
      '#options' => array(
        'query' => drupal_get_destination(),
      ),
    );
  }

  return system_settings_form($form);
}

/**
 * Theme function for oauth2_mailer_admin_settings() to render providers table.
 */
function theme_oauth2_mailer_admin_settings_providers_table($vars) {
  $form = $vars['form'];

  $header = array(
    array('data' => t('Name'), 'colspan' => 2),
    t('Available'),
    t('Weight'),
    t('Operations'),
  );
  $rows = array();
  foreach (element_children($form) as $provider_id) {
    if (isset($form[$provider_id]['icon'])) {
      $row = array(
        drupal_render($form[$provider_id]['oauth2_mailer_provider_enabled']),
        drupal_render($form[$provider_id]['icon']),
        drupal_render($form[$provider_id]['file']),
        drupal_render($form[$provider_id]['oauth2_mailer_provider_' . $provider_id . '_weight']),
        drupal_render($form[$provider_id]['settings']),
      );

      $rows[] = array(
        'data' => $row,
        'class' => array('draggable'),
      );
    }
  }
  $table_id = drupal_html_id('oauth2-mailer-providers');
  $output = theme('table', array(
      'header' => $header,
      'rows' => $rows,
      'attributes' => array('id' => $table_id),
    )
  );
  $output .= drupal_render_children($form);

  drupal_add_tabledrag('oauth2-mailer-providers', 'order', 'sibling', 'oauth2-mailer-provider-weight');

  return $output;
}

/**
 * Form constructor for the oauth2_mailer provider admin settings form.
 *
 * @see oauth2_mailer_admin_provider_settings_validate()
 *
 * @ingroup forms
 */
function oauth2_mailer_admin_provider_settings($form, &$form_state, $provider_id = NULL) {

  $form['vtabs'] = array(
    '#type' => 'vertical_tabs',
  );
  $form['vtabs']['application'] = array(
    '#type' => 'fieldset',
    '#title' => t('Application settings'),
    '#description' => t('Enter the client ID and secret client key.'),
  );
  $form['vtabs']['application']['oauth2_mailer_provider_' . $provider_id . '_client_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Client Id'),
    '#required'      => TRUE,
    '#default_value' => variable_get('oauth2_mailer_provider_' . $provider_id . '_client_id', ''),
  );
  $form['vtabs']['application']['oauth2_mailer_provider_' . $provider_id . '_key_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('Client Secret'),
    '#required'      => TRUE,
    '#default_value' => variable_get('oauth2_mailer_provider_' . $provider_id . '_key_secret', ''),
  );

  if ($providers = oauth2_mailer_providers('settings')) {
    $function = 'oauth2_mailer_' . strtolower($provider_id) . '_configuration_form_callback';
    if (isset($providers["$provider_id"])) {
      $provider = $providers["$provider_id"];
      if (isset($provider->uri) && $provider->uri) {
        $file = DRUPAL_ROOT . '/' . $provider->uri;
        if (is_file($file)) {
          include_once $file;
        }
      }
    }
    if (function_exists($function)) {
      // PROVIDERNAME_provider_configuration_form_callback
      $function($form, $provider_id);
    }
  }

  return system_settings_form($form);
}

/**
 * Form validation handler for the oauth2_mailer provider admin settings form.
 */
function oauth2_mailer_admin_provider_settings_validate($form, &$form_state) {
  foreach ($form_state['values'] as $variable_name => $value) {
    if (empty($value) && strpos($variable_name, 'oauth2_mailer_provider_') === 0) {
      unset($form_state['values'][$variable_name]);
      variable_del($variable_name);
    }
  }
}
