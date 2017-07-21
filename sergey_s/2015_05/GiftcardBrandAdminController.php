<?php

namespace SiteBundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Vrapit\HemaBundle\Entity\GiftcardBrand;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Class GiftcardBrandAdminController
 * @package SiteBundle\BackendBundle\Controller
 * @author WebCodin <info@webcodin.com>
 */
class GiftcardBrandAdminController extends Controller
{
    const FILE_SIZE = 1000000;
    public static $mimeTypes = ['image/png'];
    private static $UPLOAD_IMAGE_PATH;
    private static $UPLOAD_ADMIN_IMAGE_PATH;

    public function __construct()
    {

        self::$UPLOAD_IMAGE_PATH = $_SERVER['DOCUMENT_ROOT'] . '/images/uploads/';
        self::$UPLOAD_ADMIN_IMAGE_PATH = $_SERVER['DOCUMENT_ROOT'] . '/uploads/admin/slider';
    }


    /**
     * @return JsonResponse
     * @Route("/admin-ajax-load", name="admin_ajax_image_load")
     * @Method("POST")
     */
    public function ajaxAdminImageLoadAction()
    {
        /** @var Request $request */
        $request = $this->container->get('request');
        try {
            $file = $request->files->get('files');

            $GiftcardBrand = new GiftcardBrand();
            if (in_array($file->getMimeType(), self::$mimeTypes) && (self::FILE_SIZE > $file->getClientSize())) {
                $newname = $GiftcardBrand->makeImagename();

                $path = self::$UPLOAD_IMAGE_PATH . $newname;

                if (file_exists($path)) {
                    unlink($path);
                }

                $file->move(self::$UPLOAD_IMAGE_PATH, $newname . ".png");
                $tmpname = self::$UPLOAD_IMAGE_PATH . $newname . ".png";
                $GiftcardBrand->imgResize($tmpname, 100, self::$UPLOAD_IMAGE_PATH . "/klein/" . $newname . ".png");
                $GiftcardBrand->imgResize($tmpname, 300, self::$UPLOAD_IMAGE_PATH . "/medium/" . $newname . ".png");

                return new JsonResponse([
                    'error' => false,
                    'userPhoto' => '/images/uploads/' . $newname . ".png",
                    "value" => $newname
                ]);
            }
            return new JsonResponse(['error' => true]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => true]);
        }
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     * @Route("/admin-archive-brand", name="admin_archive_brand")
     * @Method("GET")
     */
    public function archiveAction(Request $request)
    {

        if ($request->get("id") != "") {
            $Card = $this->getDoctrine()->getRepository("VrapitHemaBundle:GiftcardBrand")->find($request->get("id"));
            if (!$Card) {
                throw $this->createNotFoundException('This Giftcard Brand doesn\'t exists');
            }
            $em = $this->getDoctrine()->getManager();
            $Card->setArchived(true);
            $em->persist($Card);
            $em->flush();
            $this->get('session')->getFlashBag()->set('sonata_flash_success', 'Archived');
            return new RedirectResponse($this->container->get('router')->generate('admin_vrapit_hema_giftcardbrand_list'));

        } else {
            throw $this->createNotFoundException('Empty id');
        }
    }
}
