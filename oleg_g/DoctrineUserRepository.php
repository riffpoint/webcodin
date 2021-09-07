<?php
declare(strict_types=1);

namespace Infrastructure\Repository\Doctrine;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use Domain\Core\Pagination\PaginationParams;
use Domain\Core\Sorting\SortingParams;
use Domain\User\UserRepositoryInterface;
use Infrastructure\Repository\Paginatable;
use Infrastructure\Repository\Sortable;

/**
 * @author WebCodin <info@webcodin.com>
 */
final class DoctrineUserRepository extends EntityRepository implements UserRepositoryInterface
{
    use Paginatable, Sortable;

    /**
     * @var array
     */
    protected array $sortableFields = [
        'id' => 'u.id',
        'createdAt' => 'u.createdAt',
    ];

    /**
     * @return array
     */
    public function total(): array
    {
        return $this->createQueryBuilder()
            ->getQuery()
            ->getResult();
    }

    /**
     * @param PaginationParams $paginationParams
     * @param SortingParams|null $sortingParams
     * @return array
     */
    public function all(PaginationParams $paginationParams, ?SortingParams $sortingParams): array
    {
        $queryBuilder = $this->createQueryBuilder();

        if ($sortingParams) {
            $queryBuilder = $this->sorting($queryBuilder, $sortingParams);
        }

        return $this->paginate($queryBuilder, $paginationParams);
    }

    /**
     * Creates a new QueryBuilder instance that is prepopulated for this entity name.
     *
     * @param string $alias
     * @param string|null $indexBy The index for the from.
     *
     * @return QueryBuilder
     */
    public function createQueryBuilder($alias = 'u', $indexBy = null): QueryBuilder
    {
        return $this->_em->createQueryBuilder()
            ->select($alias)
            ->from($this->_entityName, $alias, $indexBy);
    }
}
