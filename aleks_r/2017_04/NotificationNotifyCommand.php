<?php

namespace NotificationBundle\Command;

use NotificationBundle\Entity\Notification;
use NotificationBundle\Exception\NotificationException;
use NotificationBundle\Service\NotificationServiceInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class NotificationNotifyCommand extends ContainerAwareCommand
{
    use ExecutionTimeTrait;

    const MODIFY_DATE_TO_NEXT_TRY = '+ 1 hour';

    private $managers = [];

    /**
     * @inheritdoc
     */
    protected function configure()
    {
        $this
            ->setName('notification:notify')
            ->setDescription('Send notifications from queue')
            ->addOption(
                'types',
                't',
                InputOption::VALUE_OPTIONAL | InputOption::VALUE_IS_ARRAY,
                'Notifications only for the specified types',
                [Notification::TYPE_EMAIL, Notification::TYPE_PHONE, Notification::TYPE_SYSTEM]
            )
            ->addOption(
                'remove',
                'r',
                InputOption::VALUE_NONE,
                'Remove notification from DB if they successfully sent'
            )
            ->addOption(
                'force',
                'f',
                InputOption::VALUE_NONE,
                'Send all not sent notifications'
            );
    }

    /**
     * @inheritdoc
     */
    protected function initialize(InputInterface $input, OutputInterface $output)
    {
        $this->managers = [
            Notification::TYPE_EMAIL => $this->getContainer()->get('notification.mailer')
        ];
    }

    /**
     * @inheritdoc
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->startTimer('main');
        $notifRepo = $this->getContainer()->get('notification.repository.notification');

        if ($input->getOption('force')) {
            $notifications = $notifRepo->getAllWhichNotSent($input->getOption('types'));
        } else {
            $notifications = $notifRepo->getReadyToNotify($input->getOption('types'));
        }

        if (!$notifications) {
            $output->writeln('<info>There is nothing to send</info>');
            return;
        }

        $success = 0;
        $successStyle = new OutputFormatterStyle('green');
        $output->getFormatter()->setStyle('success', $successStyle);
        $fail = 0;
        $failStyle = new OutputFormatterStyle('red');
        $output->getFormatter()->setStyle('fail', $failStyle);

        /** @var Notification $notif */
        foreach ($notifications as $notif) {
            $manager = $this->getManager($notif->getType());

            if (!$manager) {
                $notif->incrementFailCount();
                $notif->setFailReason(
                    'For this notification type not set manager. ' . __CLASS__ . ' : see getManager method.'
                );
                $notif->setStatus(Notification::STATUS_FAIL);
                $notif->setNextTryAt($this->getNextTryDate());

                $notifRepo->save($notif);
                $fail++;
                continue;
            }

            try {
                $manager->send($notif);
                if ($input->getOption('remove')) {
                    $notifRepo->delete($notif);
                } else {
                    $notif->setStatus(Notification::STATUS_SENT);
                    $notif->setSentAt(new \DateTime());
                    $notifRepo->save($notif);
                }
                $success++;
            } catch (NotificationException $ex) {
                $notif->setStatus(Notification::STATUS_FAIL);
                $notif->setNextTryAt($this->getNextTryDate());
                $notif->incrementFailCount();
                $notif->setFailReason($ex->getMessage());
                $notif->setFailTrace($ex->getTraceAsString());
                $notifRepo->save($notif);
                $fail++;
            }
        }

        if ($success) {
            $output->writeln("<success>$success notification(s) sent</success>");
        }
        if ($fail) {
            $output->writeln("<fail>$fail notification(s) failed to send</fail>");
        }

        $output->writeln('Script execution time: ' . $this->stopTimer('main', true));
    }

    /**
     * @param string $type
     * @return NotificationServiceInterface|null
     */
    private function getManager($type)
    {
        return isset($this->managers[$type]) ? $this->managers[$type] : null;
    }

    /**
     * @return \DateTime
     */
    private function getNextTryDate()
    {
        $nextDate = new \DateTime();
        $nextDate->modify(self::MODIFY_DATE_TO_NEXT_TRY);

        return $nextDate;
    }
}
