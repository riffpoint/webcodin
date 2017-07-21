<?php
/**
 * Class MailNotification
 * @package NotificationBundle\Service\Types
 * @author WebCodin <info@webcodin.com>
 */

namespace NotificationBundle\Service\Types;

use NotificationBundle\Entity\Attachment;
use NotificationBundle\Entity\Notification;
use NotificationBundle\Exception\NotificationException;
use NotificationBundle\Service\NotificationServiceAbstract;
use NotificationBundle\User\CanBeNotifiedInterface;
use Swift_Mailer;
use Swift_Message;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig_Loader_Array;

class MailNotification extends NotificationServiceAbstract
{
    /**
     * If you have more then one recipient you can choose type how message will be sent.
     * See http://swiftmailer.org/docs/messages.html#adding-recipients-to-your-message for types explanation.
     */
    const MODE_TO = 1;
    const MODE_CC = 2;
    const MODE_BCC = 3;

    /**
     * @var Swift_Mailer
     */
    private $mailer;

    /**
     * @var Swift_Message
     */
    private $message;

    /**
     * @var ContainerInterface
     */
    private $container;

    public function __construct(Swift_Mailer $mailer, Swift_Message $message, ContainerInterface $container)
    {
        $this->mailer = $mailer;
        $this->message = $message;
        $this->container = $container;
    }

    /**
     * @inheritdoc
     */
    public function send(Notification $notification, $mode = null)
    {
        try {
            $mode = $mode ?: $notification->getMode() ?: self::MODE_TO;
            $message = clone $this->message;
            $message->setContentType($this->getMessageContentType());
            $message->setSubject($notification->getSubject());
            $message->setBody($notification->getMessage());

            $baseRecipients = $recipients = $this->formatRecipient($notification->getRecipient());
            if (!is_array($recipients) || count($recipients) == 1 || $mode == self::MODE_TO) {
                $message->setTo($recipients);
            } else {
                $key = key($recipients);
                $message->setTo([$key => array_shift($recipients)]);
                switch ($mode) {
                    case self::MODE_CC:
                        $message->setCc($recipients);
                        break;
                    case self::MODE_BCC:
                        $message->setBcc($recipients);
                        break;
                    default:
                        $message->setTo($baseRecipients);
                }
            }

            $attachments = $notification->getAttachments();
            /** @var Attachment $attachment */
            foreach ($attachments as $attachment) {
                $file = \Swift_Attachment::fromPath($attachment->getAbsolutePath());
                $file->setFilename($attachment->getName());
                $message->attach($file);
            }

            return $this->mailer->send($message);
        } catch (\Swift_SwiftException $ex) {
            throw NotificationException::fromPrevious($ex);
        }
    }

    /**
     * @inheritdoc
     */
    public function formatRecipient($recipient)
    {
        $type = $this->checkRecipientType($recipient);
        switch ($type) {
            case self::RECIPIENT_TYPE_ARRAY:
                $recipients = array();
                foreach ($recipient as $key => $value) {
                    if ($value instanceof CanBeNotifiedInterface) {
                        $recipients[$value->getEmail()] = $value->getName();
                    } elseif (is_string($key)) {
                        $recipients[$key] = $value;
                    } else {
                        $recipients[] = $value;
                    }
                }
                return $recipients;
            case self::RECIPIENT_TYPE_ENTITY:
                /** @var CanBeNotifiedInterface $recipient */
                return [$recipient->getEmail() => $recipient->getName()];
            default:
                return $recipient;
        }
    }

    /**
     * @inheritdoc
     */
    public function getType()
    {
        return Notification::TYPE_EMAIL;
    }

    /**
     * @inheritdoc
     */
    protected function getContainer()
    {
        return $this->container;
    }

    /**
     * @inheritdoc
     */
    protected function getTwigEnvironment()
    {
        $twig = clone $this->container->get('twig');
        return $twig;
    }

    /**
     * @inheritdoc
     */
    protected function getTwigTemplateLoad()
    {
        return $this->container->get('templating');
    }

    /**
     * @inheritdoc
     */
    protected function renderTwigString($string, $vars = [])
    {
        $twig = $this->getTwigEnvironment();
        $twig->setCache(false);
        $template = uniqid('string_template_', true);
        $twig->setLoader(new Twig_Loader_Array([$template => $string]));

        return $twig->render($template, $vars);
    }
}
