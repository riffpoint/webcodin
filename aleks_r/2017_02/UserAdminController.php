<?php

namespace UserBundle\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\User;

class UserAdminController extends CRUDController
{
    /**
     * Restore user if he deleted
     * @param int $id
     * @return RedirectResponse
     */
    public function undeleteAction($id)
    {
        /** @var User $user */
        $user = $this->admin->getSubject();

        if (!$user) {
            throw new NotFoundHttpException(sprintf('unable to find the user with id : %s', $id));
        }

        $this->admin->checkAccess('undelete', $user);

        if ($user->isDeleted()) {
            $user->restore();
            $this->get('user.repository.user')->save($user);
            $this->addFlash('sonata_flash_success', 'Item "' . $user . '" has been restored successfully.');
        } else {
            $this->addFlash('warning', 'Item "' . $user . '" is not restored because it not in deleted status.');
        }

        return new RedirectResponse($this->admin->generateUrl('list', $this->admin->getFilterParameters()));
    }

    /**
     * Delete user from DB
     * @return RedirectResponse|Response
     */
    public function hardDeleteAction()
    {
        $request = $this->getRequest();
        $id = $request->get($this->admin->getIdParameter());
        $user = $this->admin->getObject($id);

        if (!$user) {
            throw $this->createNotFoundException(sprintf('unable to find the user with id : %s', $id));
        }

        $this->admin->checkAccess('hard_delete', $user);

        if ($this->getRestMethod() == 'DELETE') {
            $this->validateCsrfToken('sonata.delete');
            $objectName = $this->admin->toString($user);

            try {
                $this->get('user_manager')->hardDeleteUser($user);

                if ($this->isXmlHttpRequest()) {
                    return $this->renderJson(array('result' => 'ok'), 200, array());
                }

                $this->addFlash(
                    'sonata_flash_success',
                    $this->trans(
                        'flash_delete_success',
                        array('%name%' => $this->escapeHtml($objectName)),
                        'SonataAdminBundle'
                    )
                );
            } catch (\Exception $e) {
                $this->handleModelManagerException($e);

                if ($this->isXmlHttpRequest()) {
                    return $this->renderJson(array('result' => 'error'), 200, array());
                }

                $this->addFlash(
                    'sonata_flash_error',
                    $this->trans(
                        'flash_delete_error',
                        array('%name%' => $this->escapeHtml($objectName)),
                        'SonataAdminBundle'
                    )
                );
            }

            return $this->redirectTo($user);
        }

        return $this->render('@Admin/CRUD/hard_delete.html.twig', array(
            'object' => $user,
            'action' => 'delete',
            'csrf_token' => $this->getCsrfToken('sonata.delete'),
        ), null);
    }
}
