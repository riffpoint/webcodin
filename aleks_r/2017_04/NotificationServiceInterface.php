<?php
/**
 * Interface NotificationServiceInterface
 * @package NotificationBundle\Service
 * @author WebCodin <info@webcodin.com>
 */

namespace NotificationBundle\Service;

use NotificationBundle\Entity\Attachment;
use NotificationBundle\Entity\Notification;
use NotificationBundle\Exception\NotificationException;
use NotificationBundle\User\CanBeNotifiedInterface;

interface NotificationServiceInterface
{
    /**
     * Create notification instance
     *
     * Recipient can be a string, CanBeNotifiedInterface object or array.
     * Element value of recipient array MUST be CanBeNotifiedInterface object or string.
     * Also you can use key for string element. Then key will be as email (phone or something else recipient target)
     * and value will be as recipient name
     *
     * @param mixed $recipient
     * @param string $template Can be message
     * @param array $vars
     * @param array Attachment | Attachment $attachments
     * @return Notification
     */
    public function create($recipient, $template, $vars = array(), $attachments = null);

    /**
     * Create notification instance and add to queue
     *
     * @param mixed $recipient
     * @param string $template Can be message
     * @param array $vars
     * @param array Attachment | Attachment $attachments
     * @return Notification
     */
    public function add($recipient, $template, $vars = array(), $attachments = null);

    /**
     * Prepare recipient data to correct format
     *
     * @param mixed $recipient
     * @return mixed
     */
    public function formatRecipient($recipient);

    /**
     * Add notification to queue
     * @param Notification $notification
     * @return Notification
     */
    public function queue(Notification $notification);

    /**
     * Send notification
     * @param Notification $notification
     * @param mixed $mode
     * @return mixed
     * @throws NotificationException
     */
    public function send(Notification $notification, $mode = null);

    /**
     * Get notification type
     *
     * @return string
     */
    public function getType();

    /**
     * Get message content type (E.g. text/html)
     *
     * @return string
     */
    public function getMessageContentType();
}
