<?php
declare(strict_types=1);

namespace Application\User;

use Domain\Core\Pagination\PaginationParams;
use Domain\Core\Sorting\SortingParams;
use Domain\User\UserRepositoryInterface;

/**
 * @author WebCodin <info@webcodin.com>
 */
final class GetUsersQuery
{
    /**
     * @var UserRepositoryInterface
     */
    private UserRepositoryInterface $userRepository;

    /**
     * GetUsersQuery constructor.
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(
        UserRepositoryInterface $userRepository
    ){
        $this->userRepository = $userRepository;
    }

    /**
     * @param PaginationParams $paginationParams
     * @param SortingParams|null $sortingParams
     * @return array
     */
    public function handle(PaginationParams $paginationParams, ?SortingParams $sortingParams): array
    {
        return [
            'users' => $this->userRepository->all($paginationParams, $sortingParams),
            'usersTotal' => count($this->userRepository->total()),
        ];
    }
}
