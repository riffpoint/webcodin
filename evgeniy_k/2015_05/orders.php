<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * orders.php
 *
 * Contains Orders class
 *
 * @package GimmeRide
 * @subpackage Backend
 * @category Controller
 */
class Orders extends Site_Controller {

    protected $current_state = array(1, 2, 4, 8);
    protected $archived_state = array(16, 32, 64, 128);

    /**
     * Constructor 
     */
    public function __construct () 
    {

        parent::__construct();

        /**
         * Save current URI into the session for non-AJAX action
         */
        $this->set_session_uri();

        /**
         * Redirect to the login form for not logged in user
         */
        if (!$this->site_current_user) redirect(SITE_ADMIN_ENTRY.'/login', 'refresh');
        $params=$this->site_users->get_role_permission($this->site_current_user['id']);
        if (!$this->site_users->is_admin($params['permission'])) redirect(SITE_ADMIN_ENTRY.'/login', 'refresh');

        /**
         * setup of the current model
         */
        $this->load->model(SITE_BACKEND_WORKSPACE.'/orders_model', 'model');
        
        /**
         * Breadcrumb
         */
        $this->load->library('BreadcrumbComponent');
        $this->breadcrumbcomponent->add('Home', base_url(SITE_ADMIN_ENTRY));
    }

    public function index($action = 'current', $id = NULL)
    {
        $template = NULL;
        $action = strtolower($action);
        switch($action)
        {
            case 'current':
                $this->_get_current_orders();
                break;
            case 'archived':
                $this->_get_archived_orders();
                break;
            case 'drivers':
                if (is_numeric($id) && $this->model->exist_user($id))
                {
                    $this->_get_driver_orders($id);
                }
                else
                {
                    show_404();
                }
                break;
            case 'customers':
                if (is_numeric($id) && $this->model->exist_user($id))
                {
                    $this->_get_customer_orders($id);
                }
                else
                {
                    show_404();
                }
                break;
            default :
                show_404();
                break;
        }
        $this->load->tpl_view($template, array('data'=>$this->model->data));
    }

    /**
     * The method searches information for the specified criteria named 'current orders'
     * 
     */
    protected function _get_current_orders()
    {
        $alerts = array();
        $this->_set_site_data('page_title', 'Current orders');
        $this->model->data['orders'] = $this->model->get_orders($this->current_state);
        $this->model->data['order_state'] = 'current';
        $this->model->data['alerts'] = $alerts;
        $this->breadcrumbcomponent->add('Current orders', base_url(SITE_ADMIN_ENTRY.'/orders/current'));
    }

    /**
     * The method searches information for the specified criteria named 'archived orders'
     * 
     */    
    protected function _get_archived_orders()
    {
        $alerts = array();
        $this->_set_site_data('page_title', 'Archived orders');
        $this->model->data['orders'] = $this->model->get_orders($this->archived_state);
        $this->model->data['order_state'] = 'archived';
        $this->model->data['alerts'] = $alerts;
        $this->breadcrumbcomponent->add('Archived orders', base_url(SITE_ADMIN_ENTRY.'/orders/current'));
    }

    /**
     * The method searches information about orders by driver_id
     * 
     */
    protected function _get_driver_orders($user_id)
    {
        $alerts = array();
        $user_name = $this->model->get_user_name($user_id);
        $this->_set_site_data('page_title', 'Orders by ' . $user_name);
        $this->model->data['orders'] = $this->model->get_driver_orders($user_id);
        $this->model->data['order_state'] = 'current';
        $this->model->data['alerts'] = $alerts;
       
        $this->breadcrumbcomponent->add('Drivers', base_url('admin/drivers'));
        $this->breadcrumbcomponent->add('Orders', base_url('orders/current'));
    }

   /**
     * The method searches information about orders by customer_id
     * 
     */
    protected function _get_customer_orders($user_id)
    {
        $alerts = array();
        $user_name = $this->model->get_user_name($user_id);
        $this->_set_site_data('page_title', 'Orders by ' . $user_name);
        $this->model->data['orders'] = $this->model->get_customer_orders($user_id);
        $this->model->data['order_state'] = 'current';
        $this->model->data['alerts'] = $alerts;
       
        $this->breadcrumbcomponent->add('Customers', base_url('admin/customers'));
        $this->breadcrumbcomponent->add('Orders', base_url('orders/current'));
    }
}
/* End of file orders.php */
