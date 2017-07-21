<?php
/**
 * Class AuthController
 * @package UserBundle\Controller
 * @author WebCodin <info@webcodin.com>
 */

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use UserBundle\Entity\ConfirmationCode;
use UserBundle\Entity\User;
use UserBundle\Exception\ConfirmationCodeException;
use UserBundle\Form\Type\RegisterType;
use UserBundle\Form\Type\ResetPasswordType;
use UserBundle\Form\Type\RestorePasswordType;
use Symfony\Component\Security\Core\Exception\LockedException;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\Exception\AccountExpiredException;
use Symfony\Component\Security\Core\Exception\CredentialsExpiredException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

class AuthController extends Controller
{
    /**
     * @return Response|mixed
     *
     * @Route("/", name="auth")
     * @Route("/login", name="login")
     * @Template("UserBundle:Auth:login.html.twig")
     */
    public function loginAction()
    {
        $authenticationUtils = $this->get('security.authentication_utils');
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastEmail = null;
        if ($error) {
            $lastEmail = $authenticationUtils->getLastUsername();
            if ($error instanceof BadCredentialsException) {
                $errorMsg = $error->getMessage();
            } else {
                $user = $this->get('user_manager')->getUserByEmail($lastEmail);
                switch (true) {
                    case ($error instanceof LockedException):
                        $errorMsg = $error->getMessage();
                        break;
                    case ($error instanceof DisabledException):
                        $code = $this->get('confirmation_code_manager')
                            ->create($user, ConfirmationCode::TYPE_REGISTRATION_CONFIRM, false);
                        $link = $this->generateUrl('resend_code', ['id' => $code->getId(), 'code' => $code->getCode()]);
                        $errorMsg = '<b>Hey, ' . $user->getName() . '!</b><br>Your account is not confirmed.<br>' .
                            'Click <a href="' . $link . '" class="badge badge-danger">here</a> ' .
                            'to send confirmation code to your email again.'
                        ;
                        break;
                    case ($error instanceof AccountExpiredException):
                        $errorMsg = $error->getMessage();
                        break;
                    case ($error instanceof CredentialsExpiredException):
                        $errorMsg = $error->getMessage();
                        break;
                    default:
                        $errorMsg = $error->getMessage();
                }
            }
            $this->addFlash('error', $errorMsg);
        }

        return [
            'lastEmail' => $lastEmail
        ];
    }

    /**
     * @param Request $request
     * @return Response|mixed
     *
     * @Route("/register", name="register")
     * @Template("UserBundle:Auth:register.html.twig")
     */
    public function registerAction(Request $request)
    {
        $errors = array();
        $user = new User();
        $form = $this->createForm(
            RegisterType::class,
            $user,
            ['action' => $this->generateUrl('register'), 'method' => 'POST']
        );
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                try {
                    /** @var User $user */
                    $user = $form->getData();
                    $user = $this->get('user_manager')->registerUser($user);
                    $this->get('confirmation_code_manager')
                        ->createAndSend($user, ConfirmationCode::TYPE_REGISTRATION_CONFIRM);

                    $message = "Good work, {$user->getName()}!<br>You needed only to confirm your email address.<br>" .
                        "We sent confirmation code to your email ({$user->getEmail()})."
                    ;
                    $this->addFlash('success', $message);

                    return $this->redirectToRoute('login');
                } catch (\Exception $ex) {
                    $form->addError(new FormError('Oops. Something goes wrong. Try later.'));
                }
            } else {
                $errors = $form->getErrors();
            }
        }

        return [
            'form'   => $form->createView(),
            'errors' => $errors
        ];
    }

    /**
     * @param Request $request
     * @param string $type
     * @param string $code
     * @return RedirectResponse
     * @throws NotFoundHttpException
     *
     * @Route("/confirm/{type}/{code}", name="confirm_account", defaults={"type": "email"},
     *     requirements={"type": "[a-z0-9]+(?:-[a-z0-9]+)*", "code": ".*"})
     */
    public function confirmAction(Request $request, $type, $code)
    {
        $error = null;
        switch ($type) {
            case 'email':
                $codeObject = $this->get('confirmation_code_manager')
                    ->get($code, ConfirmationCode::TYPE_REGISTRATION_CONFIRM);
                break;
            default:
                throw new NotFoundHttpException();
        }
        if (!$codeObject) {
            throw new NotFoundHttpException();
        }

        try {
            $user = $this->get('user_manager')->confirmUser($codeObject);
            $message = '<b>Hey, ' . $user->getName() . '!</b><br>You successfully confirm your account.<br>' .
                'Now you can login'
            ;
            $this->addFlash('success', $message);
        } catch (ConfirmationCodeException $ex) {
            if ($ex->getCode() === ConfirmationCodeException::NO_ACTUAL) {
                $user = $codeObject->getUser();
                $link = $this->generateUrl(
                    'resend_code',
                    ['id' => $codeObject->getId(), 'code' => $codeObject->getCode()]
                );
                $message = '<b>Hey, ' . $user->getName() . '!</b><br>Your confirmation code is expired.<br>' .
                    'Click <a href="' . $link . '" class="badge badge-danger">here</a> ' .
                    'to send confirmation code to you again.'
                ;
            } else {
                $message = $ex->getMessage();
            }
            $this->addFlash('error', $message);
        }
        return $this->redirectToRoute('login');
    }

    /**
     * @param Request $request
     * @param ConfirmationCode $codeObject
     * @param string $code
     * @return RedirectResponse
     * @throws NotFoundHttpException
     *
     * @Route("/resend-code/{id}/{code}", name="resend_code", requirements={"code": ".*"})
     * @ParamConverter("codeObject", class="UserBundle:ConfirmationCode", options={"id" = "id"});
     */
    public function reSendConfirmationCodeAction(Request $request, ConfirmationCode $codeObject, $code)
    {
        if ($codeObject->getCode() != $code || !$codeObject->getUser()) {
            throw new NotFoundHttpException();
        }

        try {
            $user = $codeObject->getUser();
            $type = $codeObject->getType();
            $this->get('confirmation_code_manager')->createAndSend($user, $type);
            switch ($type) {
                case ConfirmationCode::TYPE_REGISTRATION_CONFIRM:
                    $message = "<b>OK, {$user->getName()}!</b><br>" .
                        "We sent confirmation code to your email ({$user->getEmail()}) again."
                    ;
                    break;
                default:
                    $message = "<b>OK, {$user->getName()}!</b><br>We sent confirmation code to you again.";
            }
            $this->addFlash('success', $message);
        } catch (ConfirmationCodeException $ex) {
            $this->addFlash('error', $ex->getMessage());
        }

        return $this->redirectToRoute('login');
    }

    /**
     * @param Request $request
     * @return Response|mixed
     *
     * @Route("/restore-password", name="restore_password")
     * @Template("UserBundle:Auth:restore_password.html.twig")
     */
    public function restorePasswordAction(Request $request)
    {
        $errors = array();
        $form = $this->createForm(
            RestorePasswordType::class,
            null,
            ['action' => $this->generateUrl('restore_password'), 'method' => 'POST']
        );
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $email = $form->getData()['email'];
            $user = $this->get('user.repository.user')->getByEmail($email);
            if (!$user) {
                $form->addError(new FormError('User with this email does not exist.'));
            } else {
                try {
                    $this->get('confirmation_code_manager')
                        ->createAndSend($user, ConfirmationCode::TYPE_PASSWORD_RESET);

                    $message = "Reset code sent to your email ($email)";
                    $this->addFlash('success', $message);

                    return $this->redirectToRoute('reset_password');
                } catch (\Exception $ex) {
                    $form->addError(new FormError('Oops. Something goes wrong. Try later.'));
                }
            }
        }

        if ($form->getErrors()->count()) {
            $errors = $form->getErrors();
        }

        return [
            'form'   => $form->createView(),
            'errors' => $errors
        ];
    }

    /**
     * @param Request $request
     * @param string $code
     * @return Response|mixed
     *
     * @Route("/reset-password/{code}", name="reset_password", defaults={"code": null}, requirements={"code": ".*"})
     * @Template("UserBundle:Auth:reset_password.html.twig")
     */
    public function resetPasswordAction(Request $request, $code)
    {
        $errors = array();
        $form = $this->createForm(
            ResetPasswordType::class,
            null,
            ['action' => $this->generateUrl('reset_password'), 'method' => 'POST']
        );
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $manager = $this->get('user_manager');

            try {
                $user = $manager->resetPassword($data['code'], $data['password']);
                /**
                 * @TODO Maybe login in user after the password was restored?
                 */
                $message = 'You successfully restore your password. Now you can login.';
                $this->addFlash('success', $message);

                return $this->redirectToRoute('login');
            } catch (ConfirmationCodeException $ex) {
                $form->addError(new FormError($ex->getMessage()));
            }
        }

        if ($form->getErrors()->count()) {
            $errors = $form->getErrors();
        }

        return [
            'form'   => $form->createView(),
            'errors' => $errors,
            'code'   => $code
        ];
    }

}