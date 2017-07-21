<?php
/**
 * Class UserManager
 * @package UserBundle\Service
 * @author WebCodin <info@webcodin.com>
 */

namespace UserBundle\Service;

use Knp\DoctrineBehaviors\ORM\SoftDeletable\SoftDeletableSubscriber;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use UserBundle\Entity\ConfirmationCode;
use UserBundle\Entity\User;
use UserBundle\Exception\ConfirmationCodeException;
use UserBundle\Repository\UserRepository;

class UserManager
{
    /** @var  ContainerInterface */
    private $container;

    /** @var  UserRepository */
    private $repo;

    /** @var  SoftDeletableSubscriber */
    private $softDeletableSubscriber;

    public function __construct(
        ContainerInterface $container,
        UserRepository $repository,
        SoftDeletableSubscriber $softDeletableSubscriber
    ) {
        $this->container = $container;
        $this->repo = $repository;
        $this->softDeletableSubscriber = $softDeletableSubscriber;
    }

    /**
     * @param $email
     * @return User
     * @throws UsernameNotFoundException
     */
    public function getUserByEmail($email)
    {
        $user = $this->repo->getByEmail($email);
        if (!$user) {
            throw new UsernameNotFoundException("User with email '$email' does not exist");
        }
        return $user;
    }

    /**
     * @param User $user
     * @return User
     */
    public function registerUser(User $user)
    {
        $this->encodePassword($user);
        $this->container->get('user.repository.user')->save($user);

        return $user;
    }

    /**
     * @param ConfirmationCode $code
     * @return User
     * @throws ConfirmationCodeException
     */
    public function confirmUser(ConfirmationCode $code)
    {
        $user = $code->getUser();
        if (!$user) {
            throw new ConfirmationCodeException(
                'User not exist for this code.',
                ConfirmationCodeException::NO_USER
            );
        }
        if (!$code->isActual()) {
            throw new ConfirmationCodeException(
                'Security code is longer no actual.',
                ConfirmationCodeException::NO_ACTUAL
            );
        } else {
            switch ($code->getType()) {
                case ConfirmationCode::TYPE_REGISTRATION_CONFIRM:
                    $user->setConfirmed();
                    break;
                default:
                    throw new ConfirmationCodeException(
                        'Unsupported code type.',
                        ConfirmationCodeException::UNSUPPORTED_TYPE
                    );
            }
            $this->container->get('confirmation_code_manager')->deactivate($code);
            $this->repo->save($user);
        }
        return $user;
    }

    /**
     * @param string $code
     * @param string $password
     * @return User
     * @throws ConfirmationCodeException
     */
    public function resetPassword($code, $password)
    {
        $codeManager = $this->container->get('confirmation_code_manager');
        $codeObject = $codeManager->get($code, ConfirmationCode::TYPE_PASSWORD_RESET);

        if (!$codeObject) {
            throw new ConfirmationCodeException(
                'Invalid security code.',
                ConfirmationCodeException::INVALID_CODE
            );
        } elseif (!$codeObject->isActual()) {
            throw new ConfirmationCodeException(
                'Security code is longer no actual. Try restore your password again.',
                ConfirmationCodeException::NO_ACTUAL
            );
        } else {
            $user = $codeObject->getUser();
            $codeManager->deactivate($codeObject);
            $this->encodePassword($user, $password);
            $this->repo->save($user);
            return $user;
        }
    }

    /**
     * @param User $user
     * @param string $password
     * @return string
     */
    public function encodePassword(User $user, $password = null)
    {
        $encoder = $this->container->get('security.password_encoder');
        if ($password) {
            $encoded = $encoder->encodePassword($user, $password);
        } else {
            $encoded = $encoder->encodePassword($user, $user->getPassword());
        }

        $user->setPassword($encoded);

        return $encoded;
    }

    /**
     * Delete user from DB
     *
     * @param User $user
     */
    public function hardDeleteUser(User $user)
    {
        $eventManager = $this->container->get('doctrine.orm.entity_manager')->getEventManager();

        $eventManager->removeEventListener(
            $this->softDeletableSubscriber->getSubscribedEvents(),
            $this->softDeletableSubscriber
        );
        $this->repo->delete($user);

        $eventManager->addEventSubscriber($this->softDeletableSubscriber);
    }
}