<?php

/**
 * Date: 7/28/15
 * Time: 5:07 PM
 *
 * Class StandController
 *
 * @author WebCodin <info@webcodin.com>
 * @package SiteBundle\FrontendBundle\Controller
 */

namespace SiteBundle\FrontendBundle\Controller;

use Doctrine\ORM\EntityNotFoundException;
use FeatureBundle\BillingBundle\Entity\Payment;
use FeatureBundle\ExhibitionBundle\Entity\ExhibitionTicket;
use FeatureBundle\ExhibitionBundle\Entity\Stand;
use FeatureBundle\ExhibitionBundle\Entity\StandCatalog;
use FeatureBundle\ExhibitionBundle\Entity\StandCatalogImage;
use FeatureBundle\ExhibitionBundle\Entity\StandDocument;
use FeatureBundle\ExhibitionBundle\Repository\ExhibitionTicketRepository;
use FeatureBundle\ExhibitionBundle\Repository\StandDocumentRepository;
use FeatureBundle\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class StandController extends Controller
{

    /**
     * @DI\Inject("stand.repository")
     */
    private $standRepo;

    /**
     * @DI\Inject("stand_catalog.repository")
     */
    private $standCatalogRepo;

    const STAND_CATALOG_TOSHOWCASE = 1;
    const TO_SHOWCASE_AMOUNT = 4;
    const IS_STAND_DRAFTED = 0;
    const IS_DEMO_ROUTE = 'demo_stand';
    const IS_PREVIEW_ROUTE = 'preview_stand';
    const VIEW_SHOW_CASE_ITEMS_AMOUNT = 10;

    /**
     *
     * Stand - index page view
     *
     * @Route("/stand/{id}", name="stand_index")
     * @Route("/demo-stand/{id}", name="demo_stand_index")
     * @Route("/preview-stand/{id}", name="preview_stand_index")
     *
     * @param $id
     * @return Response
     * @throws EntityNotFoundException
     */
    public function indexStandAction($id)
    {

        $returnData = [];

        /** @var Stand $stand */
        $stand = $this->checkStandBeforeDemo($id);

        /** @var User $user */
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $standManagers = null;

        if ($stand && $stand->getStandManager()) {
            $standManagers = $stand->getStandManager();
        }

        $meetingroom = $this->get('request')->get('meetingroom', false);

        $toShowCaseItems = $this->standCatalogRepo->getFirstShowCaseItems(
            $stand,
            self::STAND_CATALOG_TOSHOWCASE,
            self::TO_SHOWCASE_AMOUNT
        );
        $totalToShowCaseItems = $this->standCatalogRepo->findBy([
            'stand' => $stand->getId(),
            'toShowcase' => self::STAND_CATALOG_TOSHOWCASE,
        ]);

        $totalToShowCaseItemsAmount = count($totalToShowCaseItems);

        $returnData['stand'] = $stand;
        $returnData['standManagers'] = $standManagers;
        $returnData['meetingroom'] = $meetingroom;
        $returnData['toShowCaseItems'] = $toShowCaseItems;
        $returnData['totalToShowCaseItemsAmount'] = $totalToShowCaseItemsAmount;
        $returnData['isVisitorInQueue'] = $this->checkVisitorForQueue($stand, $user);
        $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
        $returnData['toShowNotification'] = $accessRights['toShow'];
        $returnData['notificationText'] = $accessRights['text'];

        if ($user != 'anon.') {
            $isSelectedByUser = $this->get('user_stand_bookmart.repository')->isUserBookmark(
                $stand->getId(),
                $user
            );

            $next = $this->getStandForExhibitionOrder($stand, $stand->getExhibitionOrder(), 'ASC', true);
            $prev = $this->getStandForExhibitionOrder($stand, $stand->getExhibitionOrder(), 'DESC', false);

            $returnData['isSelectedByUser'] = $isSelectedByUser;
            $returnData['next'] = $next;
            $returnData['prev'] = $prev;
        }

        return $this->render('SiteBundleFrontendBundle:Stand:index.html.twig', $returnData);
    }

    /**
     *
     * Stand - company info tab view
     *
     * @Route("/stand/{id}/company-info", name="stand_company_info")
     * @Route("/demo-stand/{id}/company-info", name="demo_stand_company_info")
     * @Route("/preview-stand/{id}/company-info", name="preview_stand_company_info")
     *
     * @param $id
     * @return Response
     * @throws EntityNotFoundException
     */
    public function standCompanyInfoAction($id)
    {
        $stand = null;
        $returnData = [];

        if ($id) {
            $stand = $this->checkStandBeforeDemo($id);

            $returnData['stand'] = $stand;

            /** @var User $user */
            $user = $this->get('security.token_storage')->getToken()->getUser();

            $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
            $returnData['toShowNotification'] = $accessRights['toShow'];
            $returnData['notificationText'] = $accessRights['text'];
        }

        return $this->render('SiteBundleFrontendBundle:Stand:companyInfo.html.twig', $returnData);
    }

    /**
     *
     * Stand - contacts tab view
     *
     * @Route("/stand/{id}/contact", name="stand_contact")
     * @Route("/demo-stand/{id}/contact", name="demo_stand_contact")
     * @Route("/preview-stand/{id}/contact", name="preview_stand_contact")
     *
     * @param $id
     * @return Response
     * @throws EntityNotFoundException
     */
    public function standContactsAction($id)
    {
        $stand = null;
        $returnData = [];

        if ($id) {
            $stand = $this->checkStandBeforeDemo($id);

            $returnData['stand'] = $stand;

            /** @var User $user */
            $user = $this->get('security.token_storage')->getToken()->getUser();

            $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
            $returnData['toShowNotification'] = $accessRights['toShow'];
            $returnData['notificationText'] = $accessRights['text'];
        }

        return $this->render('SiteBundleFrontendBundle:Stand:contacts.html.twig', $returnData);
    }

    /**
     *
     * Stand - view stand catalog item
     *
     * @Route("/view-stand-catalog/{id}", name="stand_view_catalog")
     * @Route("/demo-stand/view-stand-catalog/{id}", name="demo_stand_view_catalog")
     * @Route("/preview-stand/view-stand-catalog/{id}", name="preview_stand_view_catalog")
     *
     * @param $id
     * @param bool $isStand
     * @return Response
     * @throws EntityNotFoundException
     */
    public function viewStandCatalogAction($id, $isStand = true)
    {

        $returnData = [];
        $data = $this->get('catalog_tree_builder.service')->getDataToStandCatalog($id, $isStand);
        $stand = $this->checkStandBeforeDemo($id);

        /** @var User $user */
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
        $returnData['toShowNotification'] = $accessRights['toShow'];
        $returnData['notificationText'] = $accessRights['text'];
        $returnData['catalogs'] = $data[0];
        $returnData['items'] = $this->get('catalog_items_builder.service')->catalogItems($data[1]['items']);
        $returnData['itemsAmount'] = $data[1]['allItems'];
        $returnData['stand'] = $stand;
        $returnData['meetingroom'] = $this->get('request')->get('meetingroom', false);
        $returnData['isVisitorInQueue'] = $this->checkVisitorForQueue(
            $stand,
            $this->get('security.token_storage')->getToken()->getUser()
        );

        return $this->render('SiteBundleFrontendBundle:Stand:catalog.html.twig', $returnData);
    }

    /**
     *
     * Stand - view catalog additional item information
     *
     * @Route("/item-view/{id}", name="stand_catalog_item_view")
     * @Route("/demo-stand/item-view/{id}", name="demo_stand_catalog_item_view")
     * @Route("/preview-stand/item-view/{id}", name="preview_stand_catalog_item_view")
     *
     * @param $id
     * @return Response
     * @throws EntityNotFoundException
     */
    public function catalogItemViewAction($id, $isStand = true)
    {
        /** @var StandCatalog $standCatalogItem */
        $standCatalogItem = $this->standCatalogRepo->findOneBy(['id' => $id]);

        $stand = $this->checkStandBeforeDemo($standCatalogItem->getStand()->getId());

        /** @var User $user */
        $user = $this->get('security.token_storage')->getToken()->getUser();


        $data = $this->get('catalog_tree_builder.service')
            ->getDataToStandCatalog($standCatalogItem->getStand()->getId(), $isStand);


        $returnData = [];
        $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
        $returnData['toShowNotification'] = $accessRights['toShow'];
        $returnData['notificationText'] = $accessRights['text'];
        $returnData['catalogs'] = $data[0];
        $returnData['stand'] = $data[2];
        $returnData['isVisitorInQueue'] = $this->checkVisitorForQueue(
            $standCatalogItem->getStand(),
            $this->get('security.token_storage')->getToken()->getUser()
        );

        if ($standCatalogItem) {
            $returnData['item'] = $standCatalogItem;

            if ($this->get('security.token_storage')->getToken()->getUser() != 'anon.') {
                $returnData['isUserSelected'] = !is_null($this->get('user_catalog_bookmart.repository')->isUserBookmark(
                    $standCatalogItem->getId(),
                    $this->get('security.token_storage')->getToken()->getUser()
                ));
            }
        }

        return $this->render('SiteBundleFrontendBundle:Stand:catalog_item_view.html.twig', $returnData);
    }

    /**
     *
     * Stand - documents preview
     *
     * @Route("/stand-documents/{id}", name="stand_documents")
     * @Route("/demo-stand-documents/{id}", name="demo_stand_documents")
     * @Route("/preview-stand-documents/{id}", name="preview_stand_documents")
     *
     * @param $id
     * @return Response
     * @throws EntityNotFoundException
     */
    public function standDocumentsAction($id)
    {

        $returnData = [];

        /** @var Stand $stand */
        $stand = $this->checkStandBeforeDemo($id);

        $returnData['stand'] = $stand;

        /** @var User $user */
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
        $returnData['toShowNotification'] = $accessRights['toShow'];
        $returnData['notificationText'] = $accessRights['text'];
        $returnData['documents'] = $this->get('stand_document.repository')->findBy([
            'stand' => $stand,
            'isConfirmed' => StandDocumentRepository::IS_DOCUMENT_CONFIRMED
        ]);

        return $this->render("SiteBundleFrontendBundle:Stand:documents.html.twig", $returnData);
    }

    /**
     *
     * Stand - upload document
     *
     * @Route("/stand/{id}/document-download", name="stand_document_download")
     * @Route("/demo-stand/{id}/document-download", name="demo_stand_document_download")
     * @Route("/preview-stand/{id}/document-download", name="preview_stand_document_download")
     *
     * @param $id
     * @return Response
     */
    public function standDocumentDownloadAction($id)
    {
        $response = new Response();

        $document = $this->get('stand_document.repository')->findOneById($id);

        $path = $document->getPath();

        if ($path && file_exists($path)) {
            $this->uploadDocumentHeaders($response, $path, $document->getDocName());
        }

        return $response;
    }

    /**
     *
     * Stand - showcase
     *
     * @Route("/stand/{id}/showcase", name="stand_showcase")
     * @Route("/demo-stand/{id}/showcase", name="demo_stand_showcase")
     * @Route("/preview-stand/{id}/showcase", name="preview_stand_showcase")
     *
     * @param $id
     * @return Response
     * @throws EntityNotFoundException
     */
    public function showcaseAction($id)
    {

        $returnData = [];

        $stand = $this->checkStandBeforeDemo($id);

        /** @var User $user */
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $accessRights = $this->get('access_rights_checker.service')->ticketBlockNotificationOrRedirect($user, $stand->getExhibition());
        $returnData['toShowNotification'] = $accessRights['toShow'];
        $returnData['notificationText'] = $accessRights['text'];
        $returnData['stand'] = $stand;
        $returnData['showCaseItems'] = $this->standCatalogRepo->getShowCaseCatalogItems($stand, self::STAND_CATALOG_TOSHOWCASE);
        $returnData['isVisitorInQueue'] = $this->checkVisitorForQueue($stand, $user);

        return $this->render('SiteBundleFrontendBundle:Stand:showcase.html.twig', $returnData);
    }

    /**
     *
     * Documents upload headers
     *
     * @param $response
     * @param $filename
     * @return mixed
     */
    private function uploadDocumentHeaders($response, $filename, $docName)
    {

        $response->headers->set('Content-Type', mime_content_type($filename));
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $docName . '"');
        $response->headers->set('Content-Length', filesize($filename));
        $response->headers->set('Pragma', "no-cache");
        $response->headers->set('Expires', "0");
        $response->headers->set('Content-Transfer-Encoding', "binary");

        $response->sendHeaders();

        $response->setContent(readfile($filename));

        return $response;
    }

    /**
     *
     * Stand exhibition order
     *
     * @param Stand $stand
     * @param $exhibitionOrder
     * @param $order
     * @param $isNext
     * @return array
     */
    private function getStandForExhibitionOrder(Stand $stand, $exhibitionOrder, $order, $isNext = true)
    {

        $isStandExists = false;

        /** @var Stand $stand */
        $standOrder = $this->standRepo->findOneBy([
            'exhibition' => $stand->getExhibition(),
            'exhibitionOrder' => $exhibitionOrder,
            'draft' => self::IS_STAND_DRAFTED,
            'status' => Stand::IS_NOT_BLOCKED
        ]);

        if (!$standOrder) {
            $standOrder = $this->standRepo
                ->getNextOrPrevStandIfNotFind($stand->getExhibition(), $exhibitionOrder, $order, $isNext);
        }

        if ($standOrder) {
            $isStandExists = true;

            return [
                'isStandExists' => $isStandExists,
                'route' => $this->get('router')->generate('stand_index', ['id' => $standOrder->getId()])
            ];
        }


        $endStand = $this->standRepo->findOneBy(
            ['exhibition' => $stand->getExhibition(), 'draft' => self::IS_STAND_DRAFTED, 'status' => Stand::IS_NOT_BLOCKED],
            ['exhibitionOrder' => $order]
        );

        $endStandId = false;
        $route = false;

        if ($endStand) {
            $endStandId = $endStand->getId();
            $route = $this->get('router')->generate('stand_index', ['id' => $endStandId]);
        }

        return [
            'isStandExists' => $isStandExists,
            'route' => $route
        ];

    }

    /**
     *
     * Separation between demo stand and real stand
     *
     * @param $id
     * @return mixed
     * @throws EntityNotFoundException
     */
    private function checkStandBeforeDemo($id)
    {

        /** @var Stand $stand */
        $stand = $this->get('stand.repository')->findOneById($id);

        if (!$stand) {
            throw new EntityNotFoundException();
        }

        if ($stand->getIsDemo()) {
            if (substr($this->get('request')->get('_route'), 0, 10) == self::IS_DEMO_ROUTE
            ) {
                $this->get('twig')->addGlobal('isDemo', substr($this->get('request')->get('_route'), 0, 10) == self::IS_DEMO_ROUTE);
                $this->get('twig')->addGlobal('isPreview', false);
            } else {
                throw new AccessDeniedException();
            }
        }

        if (!$stand->getIsDemo()) {
            if (substr($this->get('request')->get('_route'), 0, 13) == self::IS_PREVIEW_ROUTE) {
                /** @var User $currentAuthUser */
                $currentAuthUser = $this->get('security.token_storage')->getToken()->getUser();

                if ($stand->getExhibitor()->getId() === $currentAuthUser->getId()) {
                    $this->get('twig')->addGlobal('isPreview', substr($this->get('request')->get('_route'), 0, 13) == self::IS_PREVIEW_ROUTE);
                } else {
                    throw new AccessDeniedException();
                }

            } else {
                if (!$this->get('access_rights_checker.service')->checkAccessRights($stand->getExhibition()) && !$stand->getStatus()) {
                    throw new AccessDeniedException();
                }

                $this->get('twig')->addGlobal('isPreview', false);
            }
        }

        return $stand;
    }
    
}

