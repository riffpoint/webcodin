<?php

/**
 * @file
 * Theme implementation to display mailer dialog popup.
 */
?>
<div class="mailer-tool-bar">
  <h2 class="mailer-title"><?php print t('Write your message'); ?></h2>
  <div class="mailer-actions">
      <?php print l(t('close'), '', array('attributes' => array('class' => array('mailer-close-window')), 'external' => TRUE)); ?>
      <?php print l(t('minimize'), '', array('attributes' => array('class' => array('mailer-minimize-window')), 'external' => TRUE)); ?>
  </div>
</div>
<div class="mailer-content">
  <?php print drupal_render($content); ?>
</div>
