<?php

namespace SiteBundle\FrontendBundle\Service;

use FeatureBundle\ExhibitionBundle\Entity\ExhibitionCatalog;
use FeatureBundle\ExhibitionBundle\Entity\Stand;
use FeatureBundle\ExhibitionBundle\Entity\Exhibition;
use FeatureBundle\ExhibitionBundle\Entity\StandCatalog;
use FeatureBundle\ExhibitionBundle\Repository\ExhibitionCatalogRepository;
use FeatureBundle\ExhibitionBundle\Repository\StandCatalogRepository;
use FeatureBundle\ExhibitionBundle\Repository\StandRepository;
use SiteBundle\FrontendBundle\Controller\BaseController;
use SiteBundle\FrontendBundle\Controller\StandController;

/**
 * Class BuildCatalogTreeService
 *
 * Catelog tree builder
 *
 * @author WebCodin <info@webcodin.com>
 * @package SiteBundle\FrontendBundle\Service
 */
class BuildCatalogTreeService
{

    /**
     * @var StandRepository
     */
    private $standRepo;

    /**
     * @var StandCatalogRepository
     */
    private $standCatalogRepo;

    /**
     * @var ExhibitionCatalogRepository
     */
    private $exhibitionCatalogRepo;

    private $stand = null;
    private $tree = null;
    private $toShow = [];

    /**
     * BuildCatalogTreeService constructor.
     *
     * @param StandRepository $standRepository
     * @param StandCatalogRepository $standCatalogRepository
     * @param ExhibitionCatalogRepository $exhibitionCatalogRepository
     */
    public function __construct(
        StandRepository $standRepository,
        StandCatalogRepository $standCatalogRepository,
        ExhibitionCatalogRepository $exhibitionCatalogRepository
    ) {
        $this->standRepo = $standRepository;
        $this->standCatalogRepo = $standCatalogRepository;
        $this->exhibitionCatalogRepo = $exhibitionCatalogRepository;
    }

    /**
     *
     * Get tree catalog structure
     *
     * @param $standId
     * @return array
     */
    public function getDataToStandCatalog($standId, $isStand = false)
    {
        if ($standId) {
            /** @var Stand $stand */
            $this->stand = $this->standRepo->findOneBy(['id' => $standId]);

            if ($this->stand) {
                $this->tree = $this->exhibitionCatalogRepo->getHierarchyForStand($standId);

                foreach ($this->tree as $key => $node) {
                    $newnode = $this->getNodeItem($this->tree[$key]);
                    $this->tree[$key] = $newnode;
                }
            }

            $data = $this->getItemsFromStand($this->stand);
        }

        if ($isStand) {
            foreach ($this->tree as $key => $node) {
                $this->tree[$key] = $this->setToShowItemProperty($this->tree[$key]);
            }
        }

        return [$this->tree, $data, $this->stand];
    }

    /**
     *
     * Gathering catalog items to showcase
     *
     * @param Stand $stand
     * @return array
     */
    private function getItemsFromStand(Stand $stand)
    {
        $items = [];
        $allItems = 0;
        $exhibitionCatalogs = $this->exhibitionCatalogRepo->findBy([
            'stand' => $stand
        ]);

        /** @var ExhibitionCatalog $exhibitionCatalog */
        foreach ($exhibitionCatalogs as $exhibitionCatalog) {
            $elements = $this->standCatalogRepo->getStandCatalogItems($stand, $exhibitionCatalog);

            /** @var StandCatalog $element */
            foreach ($elements as $element) {
                if (count($items) <= BaseController::VIEW_SHOW_CASE_ITEMS_AMOUNT) {
                    $items[] = $element;
                }

                $allItems++;
            }
        }

        return [
            'items' => $items,
            'allItems' => $allItems
        ];
    }

    /**
     *
     * Structure catelog item data.
     * Check for children
     *
     * @param $node
     * @return mixed
     */
    private function getNodeItem($node)
    {

        if (count($node['__children']) > 0) {
            foreach ($node['__children'] as $key => $leaf) {
                $newnode = $this->getNodeItem($leaf);
                $node['__children'][$key] = $newnode;
            }
        }

        /** @var ExhibitionCatalog $catalog */
        $catalog = $this->exhibitionCatalogRepo->find($node['id']);
        $children = [];

        if ($catalog) {
            $items = $this->standCatalogRepo->findBy([
                'exhibition_catalog' => $catalog,
                'stand' => $this->stand
            ]);

            if (count($items)) {
                $isItemApproved = false;
                foreach ($items as $item) {
                    $children[] = [
                        'name' => $item->getName(),
                        'id' => $item->getId(),
                        'isApproved' => $item->getIsApproved()
                    ];

                    if (!is_null($item->getIsApproved()) && $item->getIsApproved()) {
                        $isItemApproved = true;
                    }
                }

                $node['items'] = $children;

                if ($isItemApproved) {
                    $node['toShow'] = true;
                    $this->checkParent($catalog);
                }
            }
        }

        return $node;
    }

    /**
     *
     * Select only checked items from admin panel catelog
     *
     * @param $item
     * @return mixed
     */
    private function setToShowItemProperty($item)
    {

        if (in_array($item['id'], array_unique($this->toShow))) {
            $item['toShow'] = true;
        }

        if (count($item['__children']) > 0) {
            foreach ($item['__children'] as $key => $leaf) {
                if (in_array($item['__children'][$key]['id'], array_unique($this->toShow))) {
                    $item['__children'][$key]['toShow'] = true;
                }
            }
        }

        return $item;
    }

    /**
     *
     * Select parent elements depends on selected "toShow" option in the admin panel for child element
     *
     * @param ExhibitionCatalog $exhibitionCatalog
     */
    private function checkParent(ExhibitionCatalog $exhibitionCatalog)
    {
        if ($exhibitionCatalog && $exhibitionCatalog->getParent()) {
            $this->toShow[] = $exhibitionCatalog->getParent()->getId();
            $this->checkParent($exhibitionCatalog->getParent());
        }
    }
}

