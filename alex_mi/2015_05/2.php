<?php

namespace FeatureBundle\EmailBundle\Service;

use FeatureBundle\EmailBundle\Entity\EmailTemplate;
use FeatureBundle\EmailBundle\Repository\EmailTemplateRepository;
use Symfony\Bridge\Twig\TwigEngine;
use FeatureBundle\EmailBundle\Entity\MailQueue;
use FeatureBundle\EmailBundle\Repository\MailQueueRepository;
use FeatureBundle\EmailBundle\Service\Mailer;

class MailQueueManager
{
    /**
     * @var MailQueueRepository
     */
    private $queueRepo;

    private $tryCount = 3;

    /**
     * @var Mailer
     */
    private $mailer;

    /**
     * @var TwigEngine
     */
    private $twig;

    /**
     * @var EmailTemplateRepository
     */
    private $emailTemplateRepo;

    private $sender;

    public function __construct(
        MailQueueRepository $queueRepo,
        Mailer $mailer,
        TwigEngine $twig,
        EmailTemplateRepository $emailTemplateRepository,
        $sender
    ) {
        $this->queueRepo = $queueRepo;
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->emailTemplateRepo = $emailTemplateRepository;
        $this->sender = $sender;
    }

    /**
     * @return MailQueue
     */
    public function createMail()
    {
        return $this->queueRepo->create();
    }

    public function saveMail(MailQueue $mail)
    {
        if (strpos($mail->getRecipient(), '@') < 1) {
            return;
        }

        $this->queueRepo->save($mail);
    }

    /**
     * Sending email messages from email queue 
     */
    public function sendQueue()
    {
        $errors_count = 0;
        $cnt = 0;

        $mail = $this->queueRepo->getOneForSend($this->tryCount);

        while ($mail) {
            echo $mail->getRecipient() . "\n";
            try {
                $this->mailer
                    ->setSubject($mail->getSubject())
                    ->setFrom($this->sender)
                    ->setTo($mail->getRecipient())
                    ->sendHTML($mail->getBody());

                $this->queueRepo->deleteEmail($mail);

                $cnt++;

            } catch (\Exception $e) {
                echo $e->getMessage() . "\n";
                $mail
                    ->setTrysCount($mail->getTrysCount() + 1)
                    ->setLastTry(new \DateTime('now'));

                $this->queueRepo->save($mail);
                $errors_count++;
            }

            if ($errors_count == 20) {
                break;
            }

            if ($cnt > 100) {
                break;
            }

            $mail = $this->queueRepo->getOneForSend($this->tryCount);
        }
    }

    /**
     * Rendering email message content by eventName
     */
    public function renderEventEmailTemplate($content, $eventName = null)
    {

        $ret = $content;

        if ($eventName) {

            /** @var EmailTemplate $template */
            $template = $this->emailTemplateRepo->findOneBy(['eventName' => $eventName]);

            $renderTemplate = 'FeatureBundleEmailBundle:Email:' . strtolower($eventName) . '.html.twig';

            if ($template && $this->twig->exists($renderTemplate)) {

                $twigEnv = new \Twig_Environment(new \Twig_Loader_String());

                $ret['subject'] = $template->getSubject();
                $ret['body'] = $this->twig->render($renderTemplate, [
                    'emailContent' => $twigEnv->render($template->getBody(), $content),
                    'subject' => $template->getSubject()
                ]);
            }
        }

        return $ret;
    }
}
