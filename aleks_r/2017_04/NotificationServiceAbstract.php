<?php
/**
 * Class NotificationServiceAbstract
 * @package NotificationBundle\Service
 * @author WebCodin <info@webcodin.com>
 */

namespace NotificationBundle\Service;

use NotificationBundle\Entity\Attachment;
use NotificationBundle\Entity\Notification;
use NotificationBundle\Entity\Template;
use NotificationBundle\Event\NewTemplateForDBEvent;
use NotificationBundle\User\CanBeNotifiedInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use \Twig_Environment;
use Symfony\Bundle\TwigBundle\TwigEngine;

abstract class NotificationServiceAbstract implements NotificationServiceInterface
{
    const CONTENT_HTML = 'text/html';
    const CONTENT_PLAIN = 'text/plain';

    const RECIPIENT_TYPE_NULL = 0;
    const RECIPIENT_TYPE_ENTITY = 1;
    const RECIPIENT_TYPE_ADDRESS = 2;
    const RECIPIENT_TYPE_ADDRESS_NAME = 3;
    const RECIPIENT_TYPE_ARRAY = 4;

    const DEFAULT_SUBJECT = '';

    /**
     * @param string $string
     * @param array $vars
     * @return string
     */
    abstract protected function renderTwigString($string, $vars = array());

    /**
     * @return Twig_Environment
     */
    abstract protected function getTwigEnvironment();

    /**
     * @return TwigEngine
     */
    abstract protected function getTwigTemplateLoad();

    /**
     * @return ContainerInterface
     */
    abstract protected function getContainer();


    /**
     * @inheritdoc
     */
    public function create($recipient, $template, $vars = array(), $attachment = null)
    {
        $notification = new Notification();
        $notification->setRecipient($recipient);
        $notification->setSubject($this->getSubject($template, $vars));
        $notification->setMessage($this->getMessage($template, $vars));
        $notification->setType($this->getType());
        if (isset($vars['_MODE'])) {
            $notification->setMode($vars['_MODE']);
        }
        if ($attachment instanceof Attachment) {
            $notification->addAttachment($attachment);
        }
        if (is_array($attachment)) {
            foreach ($attachment as $a) {
                if ($a instanceof Attachment) {
                    $notification->addAttachment($a);
                }
            }
        }

        return $notification;
    }

    /**
     * @inheritdoc
     */
    public function add($recipient, $template, $vars = array(), $attachment = null)
    {
        $notification = $this->create($recipient, $template, $vars, $attachment);

        return $this->queue($notification);
    }

    /**
     * @inheritdoc
     */
    public function queue(Notification $notification)
    {
        $this->getContainer()->get('notification.repository.notification')->save($notification);

        return $notification;
    }

    /**
     * @inheritdoc
     */
    public function getMessageContentType()
    {
        return self::CONTENT_HTML;
    }

    /**
     * @param mixed $recipient
     * @return int
     */
    protected function checkRecipientType($recipient)
    {
        if ($recipient instanceof CanBeNotifiedInterface) {
            return self::RECIPIENT_TYPE_ENTITY;
        }

        if (is_string($recipient)) {
            return self::RECIPIENT_TYPE_ADDRESS;
        }

        if (is_array($recipient)) {
            return count($recipient) > 1 ? self::RECIPIENT_TYPE_ARRAY : self::RECIPIENT_TYPE_ADDRESS_NAME;
        }

        return self::RECIPIENT_TYPE_NULL;
    }

    /**
     * @param mixed $template
     * @param array $vars
     * @return string
     */
    private function getMessage($template, $vars = array())
    {
        if (!$template instanceof Template) {
            $template = $this->getContainer()
                ->get('notification.repository.template')->getByName($template) ?: $template;
        }

        if ($template instanceof Template) {
            $method = 'getHtml';
            if ($this->getMessageContentType() == self::CONTENT_PLAIN) {
                $method = 'getPlaintext';
            }
            return $this->renderTwigString($template->$method(), $vars);
        }

        if ($this->getTwigTemplateLoad()->exists($template)) {
            $event = new NewTemplateForDBEvent($template, $vars);
            $this->getContainer()->get('event_dispatcher')->dispatch(NewTemplateForDBEvent::NAME, $event);
            return $this->getTwigTemplateLoad()->render($template, $vars);
        }

        return $this->renderTwigString($template, $vars);
    }

    /**
     * @param mixed $template
     * @param array $vars
     * @return string
     */
    private function getSubject($template, $vars = array())
    {
        if (!$template instanceof Template) {
            $template = $this->getContainer()
                ->get('notification.repository.template')->getByName($template) ?: $template;
        }

        if ($template instanceof Template) {
            return $this->renderTwigString($template->getSubject(), $vars);
        }

        if (isset($vars['_SUBJECT']) && is_string($vars['_SUBJECT'])) {
            return $this->renderTwigString($vars['_SUBJECT'], $vars);
        }

        if (isset($vars['subject']) && is_string($vars['subject'])) {
            return $this->renderTwigString($vars['subject'], $vars);
        }

        return self::DEFAULT_SUBJECT;
    }
}
