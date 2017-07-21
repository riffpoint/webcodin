<?php
/**
 * Class NotificationServiceFactory
 * @package NotificationBundle\Service
 * @author WebCodin <info@webcodin.com>
 */

namespace NotificationBundle\Service;

use NotificationBundle\Admin\NotificationSettingsAdmin;
use NotificationBundle\Exception\NotificationException;
use NotificationBundle\Service\Types\MailNotification;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Swift_Mailer;
use Swift_SmtpTransport;
use Swift_SendmailTransport;
use Swift_Message;

class NotificationServiceFactory
{
    /**
     * @var ContainerInterface
     */
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @return MailNotification
     * @throws NotificationException
     */
    public function getMailService()
    {
        $settings = $this->container->get('notification.settings.mail')->load();
        $message = Swift_Message::newInstance();
        if ($settings->getTransport() === null || $settings->getFromEmail() === null) {
            $mailer = $this->container->get('mailer');
        } else {
            $message->setFrom($settings->getFromEmail(), $settings->getFromName());
            switch ($settings->getTransport()) {
                case NotificationSettingsAdmin::MAIL_TYPE_SMTP:
                    $transport = new Swift_SmtpTransport();
                    $smtp = $settings->getSmtp();
                    $transport->setUsername($smtp->getUsername());
                    $transport->setPassword($smtp->getPassword());
                    $transport->setEncryption($smtp->getEncryption());
                    $transport->setPort($smtp->getPort() ?: 25);
                    $transport->setHost($smtp->getHost() ?: 'localhost');
                    break;
                case NotificationSettingsAdmin::MAIL_TYPE_SENDMAIL:
                    $transport = new Swift_SendmailTransport();
                    if ($settings->getSendmail()->getCommand() !== null) {
                        $transport->setCommand($settings->getSendmail()->getCommand());
                    }
                    break;
                default:
                    throw new NotificationException('Unknown transport');
            }
            $mailer = Swift_Mailer::newInstance($transport);
        }
        return new MailNotification($mailer, $message, $this->container);
    }
}
