<?php
/**
 * @file
 * Theme functions for the Oauth2_mail module.
 */

/**
 * Template preprocess function for oauth2_mailer_provider_icon.
 */
function template_preprocess_oauth2_mailer_provider_icon(&$vars, $hook) {

  if (!isset($vars['provider_name'])) {
    $vars['provider_name'] = oauth2_mailer_get_provider_name($vars['provider_id']);
  }
  $icon_pack_classes = array(
    'oauth2-mailer-icon',
    drupal_html_class($vars['provider_id']),
    drupal_html_class('oauth2-mailer-' . $vars['provider_id']),
  );

  $available_styles = oauth2_mailer_providers('style');

  $style_key = strtolower($vars['provider_id']);
  if (array_key_exists($style_key, $available_styles)) {
    drupal_add_css($available_styles["$style_key"]->uri);
  }

  $vars['icon_pack_classes'] = implode(' ', $icon_pack_classes);
}
