<?php

namespace SiteBundle\BackendBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\AdminBundle\Route\RouteCollection;

/**
 * Class GiftcardBrandAdmin
 * @package SiteBundle\BackendBundle\Admin
 * @author WebCodin <info@webcodin.com>
 */
class GiftcardBrandAdmin extends Admin
{
    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('name')
            ->add('shortDescription')
            ->add('description')
            ->add('minValue')
            ->add('maxValue')
            ->add('defaultValue')
            ->add('website')
            ->add('brandImage')
            ->add('showOnFrontpage')
            ->add('frontpageImage')
            ->add('ean')
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add('name', null, ["label"=>"Naam"])
            ->add('shortDescription', null, ["label"=>"Korte Beschrijving"])
            ->add('minValue', null, ["label"=>"Min. Waarde"])
            ->add('maxValue', null, ["label"=>"Max. Waarde"])
            ->add('defaultValue', null, ["label"=>"Standaard Waarde"])
            ->add('website', null, ["required"=>false, "label"=>"Website"])
            ->add('showOnFrontpage', null, ["required"=>false, "label"=>"Toon op Voorpagina"])
        ->add('categories', null, array(
            'label' => 'Categorieen',
            'sortable' => true,
            'editable' => false,
            'sort_field_mapping' => array('fieldName' => 'name'),
            'sort_parent_association_mappings' => array(array('fieldName' => 'categories'))
        ))
            ->add('giftcardbrandowner', null, array(
                'label' => 'Cadeaukaart Uitgever',
                'sortable' => true,
                'editable' => false,
                'sort_field_mapping' => array('fieldName' => 'name'),
                'sort_parent_association_mappings' => array(array('fieldName' => 'giftcardbrandowner'))
            ))
            ->add('brandImage', 'string', [
                'template' => 'SiteBundleBackendBundle:Images:image.html.twig'
            ])
            ->add('ean')
            ->add('archived')
            ->add('_action', 'actions', array('label'=>'Actie',
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'Archive' => array(
                        'template' => 'SiteBundleBackendBundle:CRUD:list__action_archive_brand.html.twig'
                    )
                )
            ))
        ;
    }

    /**
     * @param FormMapper $formMapper
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            //->add('id')
            ->add('name', null, ["label"=>"Naam"])
            ->add('shortDescription', null, ["label"=>"Korte Beschrijving"])
            ->add('description', null, ["label"=>"Beschrijving"])
            ->add('minValue', null, ["label"=>"Min. Waarde"])
            ->add('maxValue', null, ["label"=>"Max. Waarde"])
            ->add('defaultValue', null, ["label"=>"Standaard Waarde"])
            ->add('website', "url", ["required"=>false, "label"=>"Website"])
            ->add('brandImage', 'hidden', ['attr' => ['id' => "brandImage"]])
            ->add('showOnFrontpage', null, ["required"=>false, "label"=>"Toon op Voorpagina"])
            ->add('categories', null, array('multiple' => true, 'by_reference' => false, 'label' => 'Categorieen', 'expanded'=>false))
            ->add('giftcardBrandOwner', null, array('multiple' => false, 'by_reference' => true, 'label' => 'Cadeaukaart Uitgever'))
            ->add('ean', null, ["label"=>"Ean"])
            ->add('archived', 'checkbox', ["required"=>false])
        ;
    }

    /**
     * @param ShowMapper $showMapper
     */
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper
            ->add('id')
            ->add('name')
            ->add('shortDescription')
            ->add('description')
            ->add('minValue', null, ["label"=>"Min. Waarde"])
            ->add('maxValue', null, ["label"=>"Max. Waarde"])
            ->add('defaultValue', null, ["label"=>"Standaard Waarde"])
            ->add('website', null, ["required"=>false, "label"=>"Website"])
            ->add('brandImage', 'string', [
                'template' => 'SiteBundleBackendBundle:Images:image.html.twig'
            ])
            ->add('showOnFrontpage', null, ["required"=>false, "label"=>"Toon op Voorpagina"])
            ->add('ean')
        ;
    }

    public function getObjectMetadata($object)
    {
        return [
            "image" => $object->getBrandImage(),
            "description" => $object->getShortdescription(),
            "title" => $object->getName()
        ];
    }

    protected function configureRoutes(RouteCollection $collection)
    {
        /**
         * to remove a single route
         */
        $collection->remove('delete');
    }
}
