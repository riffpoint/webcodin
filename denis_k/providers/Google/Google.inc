<?php
/**
 * @file
 * HybridAuth Google specific settings.
 */

/**
 * Call PROVIDERNAME_provider_configuration_form_callback function.
 */
function oauth2_mailer_google_configuration_form_callback(&$form, $provider_id) {
  $form['vtabs']['advanced'] = array(
    '#type' => 'fieldset',
    '#title' => 'Advanced settings',
  );
  $form['vtabs']['advanced']['oauth2_mailer_provider_' . $provider_id . '_host'] = array(
    '#type' => 'textfield',
    '#title' => t('SMTP server'),
    '#default_value' => variable_get('oauth2_mailer_provider_' . $provider_id . '_host', 'smtp.gmail.com'),
  );
  $form['vtabs']['advanced']['oauth2_mailer_provider_' . $provider_id . '_port'] = array(
    '#type' => 'textfield',
    '#title' => t('SMTP port'),
    '#default_value' => variable_get('oauth2_mailer_provider_' . $provider_id . '_port', '465'),
    '#maxlength' => 8,
  );
  $form['vtabs']['advanced']['oauth2_mailer_provider_' . $provider_id . '_encryption'] = array(
    '#type' => 'textfield',
    '#title' => t('Encrypted protocol'),
    '#default_value' => variable_get('oauth2_mailer_provider_' . $provider_id . '_encryption', 'ssl'),
    '#maxlength' => 8,
    '#disabled' => TRUE,
  );
}
