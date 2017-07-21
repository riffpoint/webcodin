<?php
/**
 * Class ConfirmationCodeManager
 * @package UserBundle\Service
 * @author WebCodin <info@webcodin.com>
 */

namespace UserBundle\Service;

use NotificationBundle\Service\Types\MailNotification;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use UserBundle\Entity\ConfirmationCode;
use UserBundle\Entity\User;
use UserBundle\Exception\ConfirmationCodeException;
use UserBundle\Repository\ConfirmationCodeRepository;

class ConfirmationCodeManager
{
    const AVAILABILITY_TIME = 3600;

    /** @var  ConfirmationCodeRepository */
    private $repo;

    /** @var  MailNotification */
    private $mailer;

    /** @var  Router */
    private $router;

    public function __construct(
        ConfirmationCodeRepository $repository,
        MailNotification $mailer,
        Router $router
    ) {
        $this->repo = $repository;
        $this->mailer = $mailer;
        $this->router = $router;
    }

    /**
     * @param User $user
     * @param string $type
     * @param bool $real
     * @return ConfirmationCode
     */
    public function create(User $user, $type, $real = true)
    {
        $code = $this->repo->getOrCreateByUserAndType($user, $type);
        if ($real) {
            $code->setCode($this->generateCode($user));
            $code->setIsActual(true);
            $code->incrementCounter();
        } else {
            $code->setCode($code->getCode() ?: $this->generateCode($user));
            $code->setIsActual(false);
        }
        $this->repo->save($code);

        return $code;
    }

    /**
     * @param User $user
     * @param string $type
     * @throws ConfirmationCodeException
     */
    public function createAndSend(User $user, $type)
    {
        $code = $this->create($user, $type);
        switch ($code->getType()) {
            case ConfirmationCode::TYPE_PASSWORD_RESET:
                $link = $this->router->generate(
                    'reset_password',
                    ['code' => $code->getCode()],
                    UrlGeneratorInterface::ABSOLUTE_URL
                );
                $vars = [
                    'user' => $user,
                    'link' => $link,
                    'code' => $code->getCode(),
                    'subject' => 'Restore Password'
                ];
                $this->mailer->add($user, '@User/email/restore_password.html.twig', $vars);
                break;
            case ConfirmationCode::TYPE_REGISTRATION_CONFIRM:
                $link = $this->router->generate(
                    'confirm_account',
                    ['code' => $code->getCode()],
                    UrlGeneratorInterface::ABSOLUTE_URL
                );
                $vars = [
                    'user' => $user,
                    'link' => $link,
                    'code' => $code->getCode(),
                    'subject' => 'Confirm your account'
                ];
                $this->mailer->add($user, '@User/email/confirm_account.html.twig', $vars);
                break;
            default:
                throw new ConfirmationCodeException(
                    'Unknown code type: ' . $code->getType(),
                    ConfirmationCodeException::UNSUPPORTED_TYPE
                );
        }
    }

    /**
     * @param string $code
     * @param string $type
     * @param bool $withException
     * @return null|ConfirmationCode
     * @throws \Exception
     */
    public function get($code, $type, $withException = false)
    {
        $parts = explode('!', $code);
        $userId = (int) $parts[0];
        if (!$userId) {
            $codeObject = null;
        } else {
            $codeObject = $this->repo->getByUserIdCodeAndType($userId, $code, $type);
        }

        if (!$codeObject && $withException) {
            throw new \Exception('Invalid code format');
        }

        if ($codeObject instanceof ConfirmationCode && !$this->checkCodeActual($codeObject)) {
            $codeObject->setIsActual(false);
        }

        return $codeObject;
    }

    /**
     * @param ConfirmationCode $code
     * @return ConfirmationCode
     */
    public function deactivate(ConfirmationCode $code)
    {
        $code->setIsActual(false);
        $this->repo->save($code);

        return $code;
    }

    /**
     * @param User $user
     * @return string
     */
    private function generateCode(User $user)
    {
        return uniqid($user->getId() . '!');
    }

    /**
     * @param ConfirmationCode $code
     * @return bool
     */
    private function checkCodeActual(ConfirmationCode $code)
    {
        return (time() - $code->getUpdatedAt()->getTimestamp()) < self::AVAILABILITY_TIME && $code->getUser();
    }


}