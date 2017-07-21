<?php

namespace FeatureBundle\MeetingRoomBundle\Controller;

use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\ORMException;
use FeatureBundle\ExhibitionBundle\Entity\ExhibitionMeetingJournal;
use FeatureBundle\ExhibitionBundle\Entity\StandManager;
use FeatureBundle\MeetingRoomBundle\Entity\MeetingJournalVisitorQueue;
use FeatureBundle\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;

class MeetingRoomVisitorQueueController extends Controller
{

    /**
     * @DI\Inject("request")
     */
    private $request;

    /**
     * @DI\Inject("translator")
     */
    private $translator;

    /**
     * @DI\Inject("visitor_mj_queue.repository")
     */
    private $mjVisitorQueueRepo;

    /**
     * @DI\Inject("user.repository")
     */
    private $userRepo;

    /**
     * @DI\Inject("stand.repository")
     */
    private $standRepo;

    /**
     * @DI\Inject("user.repository")
     */
    private $visitorRepo;

    /**
     * @DI\Inject("stand_manager.repository")
     */
    private $standManagerRepo;

    /**
     * @DI\Inject("meeting_journal.repository")
     */
    private $exhibitionMJRepo;

    /**
     * @DI\Inject("meeting_journal_action.repository")
     */
    private $meetingJournalActionRepo;

    /**
     * @DI\Inject("visitor_mj_queue.repository")
     */
    private $meetingVisitorQueueRepo;

    const MJ_ROOM_STATUS_OLN = 'online';
    const MJ_ROOM_STATUS_BUSY = 'busy';
    const MR_VISITOR_STATUS_FREE = 0;

    /**
     *
     * MR. Adding visitor to queue
     *
     * @Route("/meetingroom/add-visitor-to-queue", name="add_visitor_to_queue")
     *
     * @return JsonResponse
     */
    public function addUserToVisitorQueue()
    {

        $response = [];
        $response['error'] = true;

        if ($this->request->getMethod() == 'POST' &&
            $this->request->request->has('visitor') &&
            $this->request->request->has('stand')
        ) {
            /** @var MeetingJournalVisitorQueue $visitorQueue */
            $visitorQueue = $this->mjVisitorQueueRepo->create();
            $stand = $this->standRepo->findOneById($this->request->request->get('stand'));
            $visitor = $this->visitorRepo->findOneById($this->request->request->get('visitor'));
            $standManagers = $this->standManagerRepo->findByStand($this->request->request->get('stand'));

            if ($stand && $visitor && count($standManagers)) {
                $isUserInQueueForThisStand = $this->mjVisitorQueueRepo->findOneBy([
                    'stand' => $stand,
                    'visitor' => $visitor
                ]);

                try {
                    $response['error'] = false;
                    $response['isUserInQueue'] = true;

                    if (!$isUserInQueueForThisStand) {
                        $visitorQueue
                            ->setStand($stand)
                            ->setVisitor($visitor)
                            ->setStatus(0)
                            ->setQueueDate(new \DateTime());

                        if ($this->request->request->has('itemToShow')) {
                            $visitorQueue->setItemToShowID($this->request->request->get('itemToShow'));
                        }

                        $this->mjVisitorQueueRepo->save($visitorQueue);
                        $response['position'] = $this->getPositionInQueue($stand, $visitorQueue->getQueueDate());
                        $response['isUserInQueue'] = false;
                        $response['popupContent'] =
                            $this->renderView('FeatureBundleMeetingRoomBundle:Default:queue-popup.html.twig');
                    }
                } catch (Exception $e) {
                    $response['error'] = true;
                }
            }
        }

        return new JsonResponse($response);
    }

    /**
     *
     * Check visitor position in queue
     *
     * @param $stand
     * @param $enterenceToQueue
     * @return mixed
     */
    private function getPositionInQueue($stand, $enterenceToQueue)
    {
        return $this->mjVisitorQueueRepo->countPrevVisitorsInQueue($stand, $enterenceToQueue);
    }

    /**
     *
     * MR. Deleting visitor from queue
     *
     * @Route("/meeting-room/queue-delete-visitor", name="queue_delete_visitor")
     *
     * @return JsonResponse
     */
    public function deleteUserFromMeetingRoomQueueAction()
    {
        $response = [];
        $response['error'] = true;

        if ($this->request->getMethod() == 'POST' &&
            $this->request->request->has('visitor') &&
            $this->request->request->has('stand')
        ) {
            try {
                $this->mjVisitorQueueRepo->removeFormQueue(
                    $this->request->request->get('visitor'),
                    $this->request->request->get('stand')
                );

                $isVisitorInQueueToMeeting = $this->mjVisitorQueueRepo->countVisitorInQueueToMeeting(
                    $this->request->request->get('visitor')
                );

                $response['isHideQueueBtn'] = count($isVisitorInQueueToMeeting) ? false : true;
                $response['error'] = false;
            } catch (Exception $e) {
            }
        }

        return new JsonResponse($response);
    }

    /**
     *
     * Changing mr activity status
     *
     * @Route("/meetingroom/change-status", name="change_meeting_room_status")
     *
     * @return JsonResponse
     */
    public function changeMeetingRoomStatus()
    {
        $response = [];
        $response['error'] = true;

        if ($this->request->request->has('room') &&
            $this->request->request->has('status')
        ) {
            try {
                $this->standManagerRepo->updateRoomStatus(
                    $this->request->request->get('room'),
                    $this->request->request->get('status')
                );

                if ($this->request->request->has('stand')) {
                    $smOnSite = $this->standManagerRepo->countStandManagerOnlineOrBusy(
                        $this->request->request->get('stand')
                    );

                    $response['managersOnline'] = $smOnSite;

                }

                $response['error'] = false;
            } catch (Exception $e) {
                $response['error'] = true;
            }
        }

        return new JsonResponse($response);
    }

    /**
     *
     * Getting new visitor from queue
     *
     * @Route("/manager/meetingroom/next-visitor", name="next_visitor")
     *
     * @return JsonResponse
     * @throws EntityNotFoundException
     */
    public function standManagerGetsNewVisitorFromVisitorsQueueAction()
    {
        $response = [];
        $response['error'] = true;

        if ($this->request->getMethod() == 'POST' &&
            $this->request->request->has('manager')
        ) {
            /** @var StandManager $standManager */
            $standManager = $this->standManagerRepo->findOneByUser($this->request->request->get('manager'));

            if (!$standManager) {
                throw new EntityNotFoundException();
            }

            if ($standManager->getRoomStatus() === self::MJ_ROOM_STATUS_OLN ||
                $standManager->getRoomStatus() === self::MJ_ROOM_STATUS_BUSY
            ) {
                try {
                    $findNextVisitorsFromQueue = $this->mjVisitorQueueRepo->findBy([
                        'stand' => $standManager->getStand(),
                        'status' => self::MR_VISITOR_STATUS_FREE
                    ]);

                    if (count($findNextVisitorsFromQueue)) {
                        /** @var MeetingJournalVisitorQueue $nextVisitor */
                        foreach ($findNextVisitorsFromQueue as $nextVisitor) {
                            $isActive = $this->checkoutNextVisitorActivity($nextVisitor->getVisitor());

                            if ($isActive) {
                                $response = $this->constructResponse($response, $standManager);
                                $response['userId'] = $nextVisitor->getVisitor()->getId();
                                $response['standId'] = $nextVisitor->getStand()->getId();

                                if (!is_null($nextVisitor->getItemToShowID())) {
                                    $response['itemToShow'] =  $nextVisitor->getItemToShowID();
                                }

                                $response['error'] = false;
                                $invokeMessageData = [
                                    'img' => $standManager->getUser()->getFileName(),
                                    'managerName' => $standManager->getUser()->getUsername(),
                                    'exhibition' => $standManager->getStand()->getExhibition()->getName(),
                                    'industry' => $standManager->getStand()->getIndustry()->getName(),
                                    'stand' => $standManager->getStand()->getCompanyName()
                                ];
                                $response['popupContent'] =
                                    $this->render(
                                        'FeatureBundleMeetingRoomBundle:Default:queue-popup.html.twig',
                                        $invokeMessageData
                                    )->getContent();
                                break;
                            }
                        }
                    } else {
                        $response['error'] = false;
                        $response['message'] = $this->translator->trans(
                            'front:stand:queue:empty',
                            [],
                            'SiteBundleFrontendBundle'
                        );
                    }
                } catch (Exception $e) {
                    $response['error'] = true;
                }
            }
        }

        return new JsonResponse($response);
    }

    /**
     *
     * Check visitor activity
     *
     * @param User $visitor
     * @return bool
     */
    private function checkoutNextVisitorActivity(User $visitor)
    {

        $isVisitorActive = false;

        if ($visitor->isActiveNow()) {
            $isVisitorActive = true;
        }

        return $isVisitorActive;
    }

    /**
     * @param array $response
     * @param StandManager $standManager
     * @return array
     */
    private function constructResponse(array $response, StandManager $standManager)
    {
        $response['next'] = true;
        $response['room'] = $standManager->getRoom();
        $response['route'] = $this->get('router')->generate(
            'meeting_room_load_catalog'
        );

        $response['data'] = [
            'exhibitionName' => $standManager->getStand()->getExhibition()->getName(),
            'standName' => $standManager->getStand()->getCompanyName(),
            'managerName' => $standManager->getUser()->getUsername()
        ];

        return $response;
    }

    /**
     *
     * Updating mr data
     *
     * @Route("/manager/meetingroom/update-meeting-journal", name="update_meeting_journal")
     *
     * @return JsonResponse
     * @throws EntityNotFoundException
     */
    public function updateMeetingJournalAction()
    {
        $response = [];
        $response['error'] = true;

        if ($this->request->getMethod() == 'POST' &&
            $this->request->request->has('journal')
        ) {
            /** @var ExhibitionMeetingJournal $meetingJournal */
            $meetingJournal = $this->exhibitionMJRepo->findOneById(
                $this->request->request->get('journal')
            );

            $meetingJournalActions = $this->meetingJournalActionRepo->findAll();

            if (!$meetingJournal) {
                throw new EntityNotFoundException();
            }

            if (count($meetingJournalActions)) {
                $datetimeDiff = $meetingJournal->getDate()->diff(new \DateTime());
                $hh = $datetimeDiff->m == '0' ? $datetimeDiff->m . '0' : $datetimeDiff->m;
                $mm = $datetimeDiff->i <= '9' ? '0' . $datetimeDiff->i  : $datetimeDiff->i;
                $ss =  iconv_strlen($datetimeDiff->s) == '1' ? '0' . $datetimeDiff->s : $datetimeDiff->s;

                $meetingJournal->setDuration($hh. ':' . $mm . ':'. $ss);

                try {
                    $this->exhibitionMJRepo->save($meetingJournal);

                    $this->mjVisitorQueueRepo->updateVisitorStatus($meetingJournal->getVisitor()->getId(), 0);
                    $this->get('meeting_journal_chat_log.repository')->updateMsgStatus($meetingJournal);

                    $response['data'] =
                        $this->renderView('FeatureBundleMeetingRoomBundle:Default:journal_of_talk.html.twig', [
                            'journal' => $meetingJournal,
                            'actions' => $meetingJournalActions
                        ]);
                    $response['selectedJournal'] = $meetingJournal->getMeetingJournalAction()->getId();
                    $response['error'] = false;
                } catch (Exception $e) {
                }
            }
        }

        return new JsonResponse($response);
    }

    /**
     *
     * Leave queue
     *
     * @Route("/meeting-room/visitor/leave-all-queues", name="meeting_room_visitor_leave_all_queues")
     *
     * @return JsonResponse
     */
    public function visitorLeaveAllQueuesAction()
    {

        $response = [];
        $response['error'] = true;

        if ($this->request->getMethod() == 'POST' &&
            $this->request->request->has('user') &&
            $this->request->request->has('stand')
        ) {
            /** @var User $user */
            $user = $this->userRepo->findOneById($this->request->request->get('user'));
            $stand = $this->standRepo->findOneById($this->request->request->get('stand'));

            if ($user && $stand) {
                try {
                    $this->meetingVisitorQueueRepo->removeVisitorFormMJQueue($user);
                    $response['error'] = false;
                } catch (Exception $e) {
                    throw new Exception();
                }
            }
        }

        return new JsonResponse($response);
    }
}

