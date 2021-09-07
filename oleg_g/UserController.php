<?php
declare(strict_types=1);

namespace Api\Controller;

use Api\Serializer\UserSerializer;
use Application\User\GetUsersQuery;
use Application\User\UpdateUserByIdCommand;
use Application\User\SoftDeleteCommand;
use Domain\Core\Pagination\PaginationParams;
use Domain\Core\Sorting\SortingParams;
use Domain\User\User;
use Infrastructure\DTO\User\UpdateUserDTO;
use Infrastructure\Validation\Api\UserValidation;
use Infrastructure\Validation\RequestValidator;
use SimpleBus\SymfonyBridge\Bus\CommandBus;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @author WebCodin <info@webcodin.com>
 *
 * @Route(path="/")
 */
final class UserController extends Controller
{
    /**
     * @var UserSerializer
     */
    private UserSerializer $serializer;

    /**
     * @var GetUsersQuery
     */
    private GetUsersQuery $getUsersQuery;

    /**
     * @var UpdateUserByIdCommand
     */
    private UpdateUserByIdCommand $updateUserByIdCommand;

    /**
     * @var SoftDeleteCommand
     */
    private SoftDeleteCommand $softDeleteCommand;

    /**
     * @param RequestValidator $requestValidator
     * @param UserSerializer $serializer
     * @param GetUsersQuery $getUsersQuery
     * @param UpdateUserByIdCommand $updateUserByIdCommand
     * @param SoftDeleteCommand $softDeleteCommand
     * @param CommandBus $commandBus
     */
    public function __construct(
        RequestValidator $requestValidator,
        UserSerializer $serializer,
        GetUsersQuery $getUsersQuery,
        UpdateUserByIdCommand $updateUserByIdCommand,
        SoftDeleteCommand $softDeleteCommand,
        CommandBus $commandBus
    ){
        parent::__construct($requestValidator, $commandBus);

        $this->serializer = $serializer;
        $this->getUsersQuery = $getUsersQuery;
        $this->updateUserByIdCommand = $updateUserByIdCommand;
        $this->softDeleteCommand = $softDeleteCommand;
    }

    /**
     * @Route(path="/users", methods={"GET"})
     *
     * @param PaginationParams $paginationParams
     * @param SortingParams|null $sortingParams
     *
     * @return JsonResponse
     */
    public function getUsersAction(PaginationParams $paginationParams, ?SortingParams $sortingParams): JsonResponse
    {
        $data = $this->getUsersQuery->handle($paginationParams, $sortingParams);

        return $this->json([
            'users' => array_map(function (User $user): array {
                return $this->serializer->serialize($user);
            }, $data['users']),
            'usersTotal' => $data['usersTotal']
        ]);
    }

    /**
     * @Route(path="/users/{id}", methods={"GET"})
     *
     * @param User $user
     *
     * @return JsonResponse
     */
    public function getUserByIdAction(User $user): JsonResponse
    {
        return $this->json(
                 $this->serializer->serialize($user)
        );
    }

    /**
     * @Route(path="/users/{id}", methods={"PUT"})
     *
     * @param Request $request
     * @param User $user
     *
     * @return JsonResponse
     */
    public function updateUserByIdAction(Request $request, User $user): JsonResponse
    {
        $this->validate($request, UserValidation::class);

        $this->updateUserByIdCommand->handle($user, UpdateUserDTO::fromRequest($request));

        return $this->json([], JsonResponse::HTTP_ACCEPTED);
    }

    /**
     * @Route(path="/users/{id}", methods={"DELETE"})
     *
     * @param User $user
     *
     * @return JsonResponse
     */
    public function deleteUserAction(User $user): JsonResponse
    {
        $this->softDeleteCommand->handle($user);

        return $this->json([], JsonResponse::HTTP_NO_CONTENT);
    }
}
