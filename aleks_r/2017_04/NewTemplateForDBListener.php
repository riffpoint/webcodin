<?php
/**
 * Class NewTemplateForDBListener
 * @package NotificationBundle\EventListener
 * @author WebCodin <info@webcodin.com>
 */

namespace NotificationBundle\EventListener;

use Html2Text\Html2Text;
use NotificationBundle\Event\NewTemplateForDBEvent;
use NotificationBundle\Repository\TemplateRepository;
use NotificationBundle\Service\NotificationServiceAbstract;
use Symfony\Bundle\TwigBundle\Loader\FilesystemLoader;
use Symfony\Bundle\TwigBundle\TwigEngine;

class NewTemplateForDBListener
{
    /** @var TemplateRepository */
    private $repo;

    /** @var  FilesystemLoader */
    private $loader;

    /** @var  TwigEngine */
    private $templating;

    public function __construct(TemplateRepository $repo, FilesystemLoader $loader, TwigEngine $templating)
    {
        $this->repo = $repo;
        $this->loader = $loader;
        $this->templating = $templating;
    }

    /**
     * @param NewTemplateForDBEvent $event
     */
    public function onNewTemplate(NewTemplateForDBEvent $event)
    {
        $template = $this->repo->create();

        $html = $this->loader->getSourceContext($event->getTemplateName())->getCode();
        $plain = Html2Text::convert($html);

        $template
            ->setName($event->getTemplateName())
            ->setDescription($this->generateDescription($event->getVars()))
            ->setHtml($html)
            ->setPlaintext($plain)
            ->setSubject($this->getSubject($event->getVars()))
            ->setIsSystemTemplate(true)
        ;

        $this->repo->save($template, false);
    }

    /**
     * @param array $vars
     * @return string
     */
    private function getSubject($vars)
    {
        if (isset($vars['_SUBJECT']) && is_string($vars['_SUBJECT'])) {
            return $vars['_SUBJECT'];
        } elseif (isset($vars['subject']) && is_string($vars['subject'])) {
            return $vars['subject'];
        } else {
            return NotificationServiceAbstract::DEFAULT_SUBJECT;
        }
    }

    /**
     * @param array $vars
     * @return string
     */
    private function generateDescription($vars)
    {
        $data = array();
        foreach ($vars as $key => $value) {
            if (is_object($value)) {
                $type = get_class($value);
            } elseif (is_array($value)) {
                ob_start();
                var_dump($value);
                $type = ob_get_clean();
            } elseif (is_null($value)) {
                $type = 'unknown type';
            } else {
                $type = gettype($value);
            }

            $data[$key] = $type;
        }

        return $this->templating->render('@Notification/Admin/_template_description.html.twig', ['vars' => $data]);
    }
}
