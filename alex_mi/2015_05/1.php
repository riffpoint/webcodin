<?php

namespace SiteBundle\BackendBundle\Controller;

use FeatureBundle\UserBundle\Entity\ExhibitorProfile;
use FeatureBundle\UserBundle\Entity\User;
use FeatureBundle\UserBundle\Repository\ExhibitorProfileRepository;
use FeatureBundle\UserBundle\Repository\ExhibitorUploadFileRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use SiteBundle\BackendBundle\Controller\CRUDController as Controller;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Sonata\AdminBundle\Exception\ModelManagerException;
use SiteBundle\BackendBundle\Form\Type\AdminCustomUserFormType;
use Symfony\Component\HttpFoundation\RedirectResponse;

class ExhibitorCRUDController extends Controller
{

    /** 
     * Create new Exhibitor instance 
     */
    public function createAction()
    {

        $templateKey = 'edit';

        if (false === $this->admin->isGranted('CREATE')) {
            throw new AccessDeniedException();
        }

        /** @var $form \Symfony\Component\Form\Form */
        $form = $this->createForm(
            new AdminCustomUserFormType(null)

        );

        $object = $this->admin->getNewInstance();

        $this->admin->setSubject($object);

        $form->setData($object);

        if ($this->getRestMethod() == 'POST') {

            $form->submit($this->get('request'));

            $isFormValid = $form->isValid();

            if ($isFormValid && (!$this->isInPreviewMode() || $this->isPreviewApproved())) {

                if (false === $this->admin->isGranted('CREATE', $object)) {
                    throw new AccessDeniedException();
                }

                try {

                    $object = $this->admin->create($object);

                    if ($this->isXmlHttpRequest()) {
                        return $this->renderJson(array(
                            'result' => 'ok',
                            'objectId' => $this->admin->getNormalizedIdentifier($object)
                        ));
                    }

                    $this->addFlash(
                        'flash_success',
                        $this->admin->trans(
                            'flash_create_exhibitor_success',
                            array('%name%' => $this->escapeHtml($this->admin->toString($object))),
                            'AdminBundle'
                        )
                    );

                    $this->addUsersToExhibitorProfile(
                        $object->getExhibitorProfileUser()->getId(),
                        $this->get('request')->request->get($form->getName())['exhibitorProfileUser']['managerId'],
                        $object
                    );

                    return $this->redirectTo($object);

                } catch (ModelManagerException $e) {
                    $isFormValid = false;
                }
            }

            if (!$isFormValid) {
                if (!$this->isXmlHttpRequest()) {
                    $this->addFlash(
                        'flash_error',
                        $this->admin->trans(
                            'flash_create_error',
                            array('%name%' => $this->escapeHtml($this->admin->toString($object))),
                            'AdminBundle'
                        )
                    );
                }
            } elseif ($this->isPreviewRequested()) {
                $templateKey = 'preview';
                $this->admin->getShow();
            }
        }

        $view = $form->createView();

        $this->get('twig')->getExtension('form')->renderer->setTheme($view, $this->admin->getFormTheme());

        return $this->render($this->admin->getTemplate($templateKey), array(
            'action' => 'create',
            'form' => $view,
            'object' => $object,
        ));
    }

    /** 
     * Update Exhibitor 
     */
    public function editAction($id = null)
    {
        $templateKey = 'edit';

        /** @var ExhibitorUploadFileRepository $exhibitorUploadedFileRepo */
        $exhibitorUploadedFileRepo = $this->get('exhibitor_file_upload.repository');

        $id = $this->get('request')->get($this->admin->getIdParameter());

        $object = $this->admin->getObject($id);
        $files = null;
        if ($object->getExhibitorProfileUser()) {
            $files = $exhibitorUploadedFileRepo->findBy(['exhibitorProfile' => $object->getExhibitorProfileUser()->getId()]);
        }

        if (!$object) {
            throw new NotFoundHttpException(sprintf('unable to find the object with id : %s', $id));
        }

        if (false === $this->admin->isGranted('EDIT', $object)) {
            throw new AccessDeniedException();
        }

        /** @var $form \Symfony\Component\Form\Form */
        $form = $this->createForm(new AdminCustomUserFormType($object->getId()), $object);

        if ($this->getRestMethod() == 'POST') {

            $form->submit($this->get('request'));

            $isFormValid = $form->isValid();

            if ($isFormValid && (!$this->isInPreviewMode() || $this->isPreviewApproved())) {

                try {
                    $object = $this->admin->update($object);

                    if ($this->isXmlHttpRequest()) {
                        return $this->renderJson(array(
                            'result' => 'ok',
                            'objectId' => $this->admin->getNormalizedIdentifier($object)
                        ));
                    }

                    $this->addFlash(
                        'flash_success',
                        $this->admin->trans(
                            'flash_edit_success',
                            array('%name%' => $this->escapeHtml($this->admin->toString($object))),
                            'AdminBundle'
                        )
                    );

                    $this->addUsersToExhibitorProfile(
                        $object->getExhibitorProfileUser()->getId(),
                        $this->get('request')->request->get($form->getName())['exhibitorProfileUser']['managerId'],
                        $object
                    );

                    return $this->redirectTo($object);

                } catch (ModelManagerException $e) {
                    $isFormValid = false;
                }
            }

            if (!$isFormValid) {
                if (!$this->isXmlHttpRequest()) {
                    $this->addFlash(
                        'flash_error',
                        $this->admin->trans(
                            'flash_edit_error',
                            array('%name%' => $this->escapeHtml($this->admin->toString($object))),
                            'AdminBundle'
                        )
                    );
                }
            } elseif ($this->isPreviewRequested()) {
                $templateKey = 'preview';
                $this->admin->getShow();
            }
        }

        $view = $form->createView();

        $this->get('twig')->getExtension('form')->renderer->setTheme($view, $this->admin->getFormTheme());

        return $this->render($this->admin->getTemplate($templateKey), array(
            'action' => 'edit',
            'form' => $view,
            'object' => $object,
            'files' => $files
        ));
    }

   /**
    * Bind users with exhibitorProfile
    */
    private function addUsersToExhibitorProfile($profileId, $siteManagerId, User $user)
    {
        /** @var ExhibitorProfileRepository $exhibitorProfileRepo */
        $exhibitorProfileRepo = $this->get('exhibitor_profile.repository');

        /** @var ExhibitorProfile $profile */
        $profile = $exhibitorProfileRepo->findOneBy(['id' => $profileId]);

        $siteManager = $this->get('user.repository')->findOneBy(['id' => $siteManagerId]);

        $profile->upload();

        $profile
            ->setUser($user)
            ->setSiteManager($siteManager);

        $exhibitorProfileRepo->save($profile);

    }
}
