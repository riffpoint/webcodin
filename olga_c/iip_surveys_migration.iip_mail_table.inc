<?php

/**
 * Migration for files.
 */
class IIPSurveysMigrationIIPMail extends Migration {

  /**
   * {@inheritdoc}
   */
  public function __construct($argument) {
    parent::__construct($argument);

    $query = Database::getConnection('iip_surveys_migrate', 'default')
      ->select('iip_email', 'ie')
      ->fields('ie', array(
        'eid',
        'aid',
        'email',
        'recipient',
        'egroup',
        'subject',
        'body',
        'imported',
        'sent',
        'reminder_1_sent',
        'reminder_2_sent',
        'reminder_3_sent',
        'completed',
        'code',
        'recipient_lastname',
      ));

    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationTable('iip_email');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'eid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'alias' => 'ie',
        ),
        'aid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'alias' => 'ie',
        ),
      ),
      MigrateDestinationTable::getKeySchema('iip_email')
    );

    $this->addFieldMapping('email', 'email');
    $this->addFieldMapping('recipient', 'recipient');
    $this->addFieldMapping('egroup', 'egroup');
    $this->addFieldMapping('subject', 'subject');
    $this->addFieldMapping('body', 'body');
    $this->addFieldMapping('imported', 'imported');
    $this->addFieldMapping('sent', 'sent');
    $this->addFieldMapping('reminder_1_sent', 'reminder_1_sent');
    $this->addFieldMapping('reminder_2_sent', 'reminder_2_sent');
    $this->addFieldMapping('reminder_3_sent', 'reminder_3_sent');
    $this->addFieldMapping('completed', 'completed');
    $this->addFieldMapping('code', 'code');
    $this->addFieldMapping('recipient_lastname', 'recipient_lastname');

    $this->addUnmigratedDestinations(array(
      'eid',
    ));
  }

  /**
   * Helper function - Prepare URI.
   *
   * @param $uri
   *
   * @return mixed
   */
  protected function fixUri($uri) {
    $result = str_replace('public://', '', $uri);
    return $result;
  }

  /**
   * Give handlers a shot at modifying the object before saving it.
   *
   * @param $email
   *  Object to build. Prefilled with any fields mapped in the Migration.
   * @param $row
   *  Raw source data object - passed through to prepare handlers.
   */
  public function prepare($email, stdClass $row) {
    $find_new_nid_survey = db_select('migrate_map_iipsurveysmigrationsurveys','ms')
      ->fields('ms', array('destid1'))
      ->condition('ms.sourceid1', $row->aid);
    $find_new_nid_survey_result = $find_new_nid_survey->execute()->fetchField();

    if ($find_new_nid_survey_result) {
      $email->aid = $find_new_nid_survey_result;
    }
  }

  /**
   * Review a data row after fetch, returning FALSE to skip it.
   *
   * @param $current_row
   * @return bool
   */
  public function prepareRow($current_row) {
    // Always start your prepareRow implementation with this clause. You need to
    // be sure your parent classes have their chance at the row, and that if
    // they return FALSE (indicating the row should be skipped) you pass that
    // on.
    $has_survey_node_migrate = db_select('migrate_map_iipsurveysmigrationsurveys','ms')
      ->fields('ms')
      ->condition('ms.sourceid1', $current_row->aid);
    $node_migrated = $has_survey_node_migrate->execute()->rowCount();

    if ($node_migrated) {
      $find_new_nid_survey = db_select('migrate_map_iipsurveysmigrationsurveys','ms')
        ->fields('ms', array('destid1'))
        ->condition('ms.sourceid1', $current_row->aid);
      $find_new_nid_survey_result = $find_new_nid_survey->execute()->fetchField();

      if($find_new_nid_survey_result  ){
        $does_node_exist = node_load($find_new_nid_survey_result);
        if ($does_node_exist === FALSE) {
          return FALSE;
        }
      }
    }
    else {
      return FALSE;
    }
  }

}