<?php

/**
 * Class OrderController
 * @author WebCodin <info@webcodin.com>
 * @package OrderPlatform\Controller
 */

namespace OrderPlatform\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use AdminPlatform\Entity\Orders;
use UserModule\Entity\User;
use OrderPlatform\Form\OrdersForm;
use AdminPlatform\Entity\OrderStatus;
use AdminPlatform\Entity\Shedules;
use AdminPlatform\Model\FreeHoursCollection;
use Zend\Log\Logger;
use Zend\Log\Writer\Stream;

class OrderController extends AbstractActionController
{

    const NEW_STATUS = 1;
    const HOLD_STATUS = 2;

    /**
     * 
     * @return \Zend\View\Model\ViewModel
     */
    public function indexAction()
    {
        $form = $this->getForm();
        return array('form' => $form);
    }

    /**
     * realized frontend events
     * 
     * @return JSON | 404 error
     */
    public function manageEventsAjaxAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $data = array('type' => '', 'message' => '');
            $action = $request->getPost('action', '');
            switch ($action) {
                case 'delete':
                    $data = $this->deleteOrderById($request->getPost('id', 0));
                    break;
                case 'save' :
                    $data = $this->saveOrder($request->getPost('event'));
                    break;
                default:
                    break;
            }
            return $this
                    ->getResponse()
                    ->setContent(\Zend\Json\Json::encode($data));
        } else {
            return $this->notFoundAction();
        }
    }

    /**
     * 
     * @return JSON | 404 error
     */
    public function getSettingsAjaxAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
            $owner = $objectManager->find('UserModule\Entity\User', 5);
            $events = $objectManager->getRepository('AdminPlatform\Entity\Shedules')->findBy(array('user' => $owner));
            $orders = $objectManager->getRepository('AdminPlatform\Entity\Orders')->findBy(array('owner' => $owner, 'status' => self::HOLD_STATUS));
            $settings = $this->getSettings($events, new FreeHoursCollection($orders));
            return $this
                    ->getResponse()
                    ->setContent(\Zend\Json\Json::encode($settings));
        } else {
            return $this->notFoundAction();
        }
    }

    /**
     * 
     * @return OrderPlatform\Form\OrdersForm
     */
    protected function getForm()
    {
        $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        return new OrdersForm($objectManager);
    }

    /**
     * 
     * @param array $orders
     * @return array
     */
    public function getEventsParams($orders = array())
    {
        if (!$orders) {
            return null;
        }
        $events = array();
        foreach ($orders as $item) {
            $event = new \stdClass();
            $event->id = $item->getId();
            $event->title = $item->getTitle();
            $event->start = $item->getFromDate() ? $item->getFromDate()->format(\DateTime::ATOM) : '';
            $event->end = $item->getToDate() ? $item->getToDate()->format(\DateTime::ATOM) : '';
            $event->editable = $item->isEditable();
            $event->backgroundColor = $item->getColor();
            $event->usName = $item->getClient()->getName(true);
            $event->usDescription = $item->getDescription();
            $event->usStatus = $item->getStatus()->getName();
            array_push($events, $event);
        }
        return $events;
    }

    /**
     * 
     * @param integer | string $orderId
     * @return array
     */
    private function deleteOrderById($orderId = 0)
    {

        $data = array(
            'type'    => 'error',
            'message' => 'Unexpected error!'
        );

        if (!is_numeric($orderId)) {
            return $data;
        }

        $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $order = $objectManager->find('AdminPlatform\Entity\Orders', $orderId);
        if ($order->getId()) {
            $objectManager->remove($order);
            try {
                $objectManager->flush();
                $data['type'] = 'success';
            } catch (\Exception $ex) {
                $data['message'] = $ex->getMessage();
            }
        }
        return $data;
    }

    /**
     * 
     * @param array $order
     * @return array
     */
    private function saveOrder($order)
    {
        $data = array(
            'type'    => 'error',
            'message' => 'Unexpected error!'
        );
        if ($order) {
            $order['fromDate'] = new \DateTime($order['fromDate']);
            if (isset($order['toDate'])) {
                $order['toDate'] = new \DateTime($order['toDate']);
            }
            $form = $this->getForm();
            $form->setData($order);
            if ($form->isValid()) {
                $objectManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
                $order = $form->getData();
                $orderStatus = $objectManager->find('AdminPlatform\Entity\OrderStatus', self::NEW_STATUS);
                $order->setStatus($orderStatus);
                $owner = $this->performer()->getAsUser();
                $order->setOwner($owner);

                if ($order->getId()) {
                    $objectManager->merge($order);
                } else {
                    $objectManager->persist($order);
                }

                try {
                    $objectManager->flush();
                    $data['type'] = 'success';
                    $data['message'] = '';
                    $data['eventId'] = $order->getId();
                } catch (\Exception $ex) {
                    $this->getLogger()->warn($ex->getMessage());
                }
            } else {
                $this->getLogger()->alert($form->getMessages());
            }
        }
        return $data;
    }

    /**
     * 
     * @param object $schedules
     * @param AdminPlatform\Model\FreeHoursCollection $orders
     * @return array
     */
    protected function getSettings($schedules, $orders)
    {
        if (!$schedules) {
            return null;
        }

        $data = array(
            'bindDates'    => array(),
            'workSchedule' => array(),
            'freeTime'     => $orders->getFreeTimeList()
        );

        foreach ($schedules as $item) {
            if ($item->getFreeDay()) {
                array_push($data['bindDates'], $item->getFromDate()->format('Y-m-d'));
            } else {

                $worksDate = $item->getFromDate()->format('Y-m-d');
                array_push($data['workSchedule'], array(
                    'date'     => $worksDate,
                    'listTime' => $orders->getFreeTimeList(
                        $worksDate, $item->getFromDate()->format('H:i'), $item->getToDate()->format('H:i')
                    ),
                ));
            }
        }

        return $data;
    }

    /**
     * 
     * @return Zend\Log\Logger
     */
    protected function getLogger()
    {

        $logger = new Logger();
        $logger->addWriter(new Stream(ROOT_DIR . '/log/order.log'));

        return $logger;
    }

}
