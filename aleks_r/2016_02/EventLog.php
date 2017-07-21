<?php
/**
 * Class EventLog
 * @author WebCodin <info@webcodin.com>
 */

namespace Logger\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Log\Logger as ZendLogger;
use Zend\Log\Writer\Stream;
use Zend\Log\Formatter\Simple as FormatterSimple;
use Logger\Log\Writer\Doctrine as DoctrineWriter;
use Logger\Entity\EventLog as Entity;

class EventLog implements FactoryInterface
{
    protected $serviceLocator;
    protected $logger;

    /**
     * Create service
     *
     * @inheritdoc
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
        $logger = new ZendLogger();
        $writer = $this->getWriter();
        $logger->addWriter($writer);
        $this->logger = $logger;
        return $this;
    }

    /**
     * Switch storage for logs
     *
     * @return DoctrineWriter|Stream
     */
    protected function getWriter()
    {
        $config = $this->serviceLocator->get('Config');
        switch ($config['logger']['writer']) {
            case 'db':
                $om = $this->serviceLocator->get('Doctrine\ORM\EntityManager');
                $entity = new Entity();
                $writer = new DoctrineWriter($om, $entity);
                break;
            default:
                $path = $config['logger']['logs_dir'] . 'events-error.log';
                $writer = new Stream($path);
                $format = '%timestamp%---' . PHP_EOL
                    . '%priorityName% (%priority%)---' . PHP_EOL
                    . '%message% ---' . PHP_EOL
                    . '%extra%' . PHP_EOL . '===';
                $formatter = new FormatterSimple($format);
                $writer->setFormatter($formatter);
                break;
        }
        return $writer;
    }

    /**
     * Prepare error message and log it
     *
     * @param Exception|string $message
     * @param string $details
     * @param int $priority
     */
    public function log($message, $details = null, $priority = 3)
    {
        $extra = array();
        if ($message instanceof \Exception) {
            $msg = $message->getMessage();
            $extra['details'] = (string) $message;
        } else {
            $msg = $message;
        }

        if ($details) {
            $extra['details'] = $details;
        }
        $this->logger->log($priority, $msg, $extra);
    }
}
