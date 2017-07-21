<?php

/**
 * Calendar controller
 *
 * @author WebCodin <info@webcodin.com>
 * @package AdminPlatform\Controller
 */

namespace AdminPlatform\Controller;

use Zend\View\Model\ViewModel;
use Doctrine\ORM\EntityRepository;
use AdminPlatform\Entity\Shedules;
use AdminPlatform\Entity\Orders;
use AdminPlatform\Entity\OrderStatus;
use UserModule\Entity\User;
use AdminPlatform\Model\WeekSchedule;

class CalendarController extends BaseController
{

    /**
     * Index action - shows & proccesses owner's schedule
     *
     * @return \Zend\View\Model\ViewModel
     */
    public function indexAction()
    {
        if (!$this->performer()->isOwner(false)) {
            return $this->performer()->goAsOwner();
        }
        $user = $this->performer()->getAsUser();
        $objectManager = $this->getEntityManager();

        $request = $this->getRequest();
        if ($request->isPost()) {
            $data = \Zend\Json\Json::decode($request->getPost('schedules'));
            if (is_array($data)) {
                $removedEvents = array_pop($data);
                $removedShedules = $objectManager
                    ->getRepository('AdminPlatform\Entity\Shedules')
                    ->findBy(array('id' => $removedEvents));
                foreach ($removedShedules as $item) {
                    $objectManager->remove($item);
                }
                foreach ($data as $event) {

                    $shedul = $objectManager->find('AdminPlatform\Entity\Shedules', $event->id);
                    $shedul = ($shedul) ? $shedul : new Shedules();
                    $shedul->setUser($user);
                    $shedul->setTitle($event->title);
                    $shedul->setToDate(new \DateTime($event->to));
                    $shedul->setFromDate(new \DateTime($event->from));
                    $shedul->setFreeDay($event->freeDay);
                    $objectManager->persist($shedul);
                }
                try {
                    $objectManager->flush();
                    $this->flashMessenger()->addMessage('Your schedule was saved successfully!');
                } catch (Exception $ex) {
                    $this->flashMessenger()->addErrorMessage('Unexpected error!');
                }
            } else {
                $this->flashMessenger()->addWarningMessage('Your data are empty!');
            }
        }
        $events = $objectManager->getRepository('AdminPlatform\Entity\Shedules')->findBy(array('user' => $user));
        return array('events' => $events);
    }

    /**
     * Orders action - shows & proccesses orders
     *
     * @return \Zend\View\Model\ViewModel
     */
    public function ordersAction()
    {
        if (!$this->performer()->isOwner(false)) {
            return $this->performer()->goAsOwner();
        }
        $objectManager = $this->getEntityManager();
        $user = $this->performer()->getAsUser();
        $request = $this->getRequest();
        if ($request->isPost()) {
            $data = \Zend\Json\Json::decode($request->getPost('orders'));
            if (is_array($data)) {
                $status = $objectManager->find('AdminPlatform\Entity\OrderStatus', OrderStatus::STATUS_HOLD);
                if (!$status) {
                    $status = new OrderStatus();
                    $status->setId(OrderStatus::STATUS_HOLD);
                    $status->setName('hold');
                }
                foreach ($data as $event) {
                    $orders = $objectManager->find('AdminPlatform\Entity\Orders', $event->id);
                    $orders->setToDate(new \DateTime($event->to));
                    $orders->setFromDate(new \DateTime($event->from));
                    $orders->setStatus($status);
                    $objectManager->persist($orders);
                }
                try {
                    $objectManager->flush();
                    $this->flashMessenger()->addMessage('Your orders was saved successfully!');
                } catch (Exception $ex) {
                    $this->flashMessenger()->addErrorMessage('Unexpected error!');
                }
            } else {
                $this->flashMessenger()->addWarningMessage('Your data are empty!');
            }
        }
        $orders = $objectManager->getRepository('AdminPlatform\Entity\Orders')
            ->findBy(array('owner' => $user));
        return array('orders' => $orders);
    }

    /**
     * get parameters of schedules
     * 
     * @return json | 404
     */
    public function scheduleParamsAction()
    {
        $objectManager = $this->getEntityManager();
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {
            $user = $this->performer()->getAsUser();
            $currentDate = $request->getQuery('date', null);
            $currentDate = new \DateTime($currentDate);

            $eventsSchedule = $objectManager
                ->getRepository('AdminPlatform\Entity\Shedules')
                ->getWeekIntervalEvent($user, $this->getDateWeekInterval($currentDate));

            return $this
                    ->getResponse()
                    ->setContent(\Zend\Json\Json::encode(array(
                            'data' => $this->getWeekSheduleParams($eventsSchedule)
            )));
        } else {
            return $this->notFoundAction();
        }
    }

    /**
     * get parameters of orders
     * 
     * @return json | 404
     */
    public function getOrdersAjaxAction()
    {
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest()) {

            $validator = new \Zend\Validator\Date();
            $start = $request->getQuery('start', null);
            $end = $request->getQuery('end', null);
            if (!$validator->isValid($start) || !$validator->isValid($end)) {
                return $this->notFoundAction();
            }
            $objectManager = $this->getEntityManager();
            $user = $this->performer()->getAsUser();
            $orders = $objectManager
                ->getRepository('AdminPlatform\Entity\Orders')
                ->getWeekIntervalEventOwner($user, array(
                'from' => new \DateTime($start),
                'to'   => new \DateTime($end),
            ));
            $events = $this->getEventsParams($orders);
            return $this
                    ->getResponse()
                    ->setContent(\Zend\Json\Json::encode($events));
        } else {
            return $this->notFoundAction();
        }
    }

    /**
     * add message to queue
     * 
     * @return json | 404
     */
    public function sendMessageAjaxAction()
    {
        $request = $this->getRequest();
        if (!$request->isXmlHttpRequest()) {
            return $this->notFoundAction();
        }
        $data = array(
            'type'    => 'error',
            'message' => '',
        );
        $message = $request->getPost('message', '');
        $action = $request->getPost('action', '');
        $objectManager = $this->getEntityManager();
        $order = $objectManager->find('AdminPlatform\Entity\Orders', $request->getPost('id', 0));
        if (!$order) {
            $data['message'] = 'This order is undefined!';
            return $this
                    ->getResponse()
                    ->setContent(\Zend\Json\Json::encode($data));
        }
        $notification = $this->getServiceLocator()
            ->get('NotificationService');

        switch ($action) {
            case 'save':
                $notification->addMailToQueue(
                    $order->getClientEmail(), 'Adopted order', $message
                );
                $order->setStatus($objectManager->find('AdminPlatform\Entity\OrderStatus', OrderStatus::STATUS_HOLD));
                $order->setFromDate(new \DateTime($request->getPost('start')));
                $order->setToDate(new \DateTime($request->getPost('end')));
                $objectManager->persist($order);
                try {
                    $objectManager->flush();
                    $data['type'] = 'success';
                } catch (Exception $ex) {
                    $data['message'] = 'Unexpected error!';
                }
                break;
            case 'delete':
                $notification->addMailToQueue(
                    $order->getClientEmail(), 'Rejected order', $message
                );
                $objectManager->remove($order);
                try {
                    $objectManager->flush();
                    $data['type'] = 'success';
                } catch (Exception $ex) {
                    $data['message'] = 'Unexpected error!';
                }
                break;
            default:
                break;
        }
        return $this
                ->getResponse()
                ->setContent(\Zend\Json\Json::encode($data));
    }

    /**
     * 
     * @param \DateTime $datetime
     * @return array
     */
    protected function getDateWeekInterval($datetime)
    {
        $weekInterval = array();
        $nowWeekDay = $datetime->format('w');
        $fromDate = new \DateTime();
        $fromDate->setTime(0, 0, 0);

        $weekInterval['from'] = $fromDate->modify('-' . $nowWeekDay . ' day');
        $toDate = new \DateTime();
        $toDate->setTime(23, 59, 59);
        $weekInterval['to'] = $toDate->modify('+' . 6 - (int) $nowWeekDay . ' day');
        return $weekInterval;
    }

    /**
     * 
     * @param object $eventSchedules
     * @return array
     */
    private function getWeekSheduleParams($eventSchedules)
    {
        $weekScheduleParams = new WeekSchedule();
        $dates = array('start' => null, 'end' => null);
        foreach ($eventSchedules as $item) {
            if ($item->getFreeDay()) {
                $weekScheduleParams->addFreeDay($item->getFromDate()->format('w'));
            } else {
                if (empty($dates)) {
                    $dates['start'] = $item->getFromDate();
                    $dates['end'] = $item->getToDate();
                } else {
                    $dates['start'] = ($item->getFromDate() < $dates['start']) ? $item->getFromDate() : $dates['start'];

                    $dates['end'] = ($item->getToDate() > $dates['end']) ? $item->getToDate() : $dates['end'];
                }
            }
        }
        $dates['start'] = ($dates['start']) ? $dates['start']->format('H:i') : null;
        $dates['end'] = ($dates['end']) ? $dates['end']->format('H:i') : null;
        $weekScheduleParams->setTimeStart($dates['start']);
        $weekScheduleParams->setTimeEnd($dates['end']);
        return $weekScheduleParams->toArray();
    }

    /**
     * 
     * @param array $orders
     * @return array
     */
    private function getEventsParams($orders)
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
            $event->usName = $item->getClientName();
            $event->usEmail = $item->getClientEmail();
            $event->usDescription = $item->getDescription();
            $event->usStatus = $item->getStatus()->getName();
            array_push($events, $event);
        }
        return $events;
    }

}
