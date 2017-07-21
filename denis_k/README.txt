
OAuth2 mailer module for Drupal 7.x.
This module add ability for sending e-mails through
SMTP server via OAuth2 authentication.

REQUIREMENTS
------------
* Access to an SMTP server
* Install Libraries API module (https://www.drupal.org/project/libraries)
* Install OAuth2 Client module (https://www.drupal.org/project/oauth2_client)
* Install PHPMailer library (https://github.com/PHPMailer/PHPMailer/tags)

INSTALLATION INSTRUCTIONS
-------------------------
1. Download module.
2. Copy this module directory to your sites/all/modules.
3. Enable the module and manage providers at
   admin/config/services/oauth2_mailer.

INSTALLATION LIBRARY
-------------------------
1. Download library from https://github.com/PHPMailer/PHPMailer/tags.
2. Extract the following files into a 'sites/all/libraries/phpmailer'
   library directory.

GMAIL CONFIGURATION
-------------
1. Configure the api providers at
   admin/config/services/oauth2_mailer/provider/Google.

2. Add the client id, client secret from you google project page
   i.e. https://code.google.com/apis/console/.
   Select services for which this account will be used Gmail API.
   How create own project, you can read there
   https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount

HOW SHOW MAILER FORM?
-------------
1. You have two way for show mailer block on website:
  1.1 Manage Oauth2 mailer block.
    1.1.1 Drupal block with form which you can manage on the Blocks administration page ('admin/structure/block')
  1.2 Add custom link anywhere on your website.
    1.2.1 Dialog window on bottom of page
      Examples:
        1.2.2 <?php print l(t('Compose'), '/mailer/compose', array('attributes' => array('class' => array('use-ajax')))); ?>
        1.2.3 <a class="use-ajax" href="/mailer/compose">Compose</a>.
