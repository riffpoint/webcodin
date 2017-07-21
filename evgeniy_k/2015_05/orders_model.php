<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * The model class of orders 
 * 
 * @package GimmeRide
 * @subpackage Backend
 * @category Models
 */
class Orders_model extends Site_Model {
    
    const DATE_FORMAT = "d/m/Y H:i";
    protected $color_map = array(
        'Created' => 'label-success',
        'Active' => 'label-danger',
        'Accepted' => 'label-primary',
        'Achieved' => 'label-info',
        'Canceled by Customer' => 'label-primary',
        'Canceled by Driver' => 'label-info',
        'Closed' => 'label-default',
        'Closed - No drivers' => 'label-danger'
    );

    public function get_orders($status = array())
    {
        $this->db->distinct();
        $this->db->select(''
            . 'order.id as order_id, '
            . 'order.date, '
            . 'order.location, '
            . 'order.location_lat, '
            . 'order.location_lng, '
            . 'order.dst_location, '
            . 'order.dst_location_lat, '
            . 'order.dst_location_lng, '
            . 'customer.id as customer_id, '
            . 'customer.first_name as customer_name, '
            . 'customer.last_name as customer_surname, '
            . 'customer.phone as customer_phone, '
            . 'driver.id as driver_id, '
            . 'driver.first_name as driver_name, '
            . 'driver.last_name as driver_surname, '
            . 'r_order_state.name as state_name'
            );
        $this->db->from('order');
        $this->db->join('session_option as cust_s_o', 'cust_s_o.id = order.session_id', 'left');
        $this->db->join('session_option as drv_s_o', 'drv_s_o.id = order.driver_session_id', 'left');
        $this->db->join('session as cust_s', 'cust_s.id = cust_s_o.session_id', 'left');
        $this->db->join('session as drv_s', 'drv_s.id = drv_s_o.session_id', 'left');
        $this->db->join('user as customer', 'customer.id = cust_s.user_id', 'left');
        $this->db->join('user as driver', 'driver.id = drv_s.user_id', 'left');
        $this->db->join('r_order_state', 'r_order_state.id = order.r_order_state_id');
        if ( ! empty($status) && is_array($status))
        {
            $this->db->where_in('r_order_state.mask', $status);
        }
        $this->db->order_by('order_id', 'desc');
        $result = $this->db->get()->result_array();
        if ( ! empty($result))
        {
            foreach($result as $key => $value)
            {
                $result[$key]['date'] = date(self::DATE_FORMAT, $result[$key]['date']);
                $result[$key]['customer_full_name'] = $this->formated_full_name($result[$key]['customer_name'], $result[$key]['customer_surname']);
                $result[$key]['driver_full_name'] = $this->formated_full_name($result[$key]['driver_name'], $result[$key]['driver_surname']);
                $result[$key]['color_state'] = $this->color_map[$result[$key]['state_name']];
            }
        }
        return $result;
    }

    protected function formated_full_name($name = NULL, $surname = NULL)
    {
        $full_name = trim($name . ' ' . $surname);
        return (empty($full_name)) ? 'Undefined' : $full_name;
    }

    public function exist_user($user_id = NULL)
    {
        if (empty($user_id))
        {
            return FALSE;
        }
        $this->db->select('id');
        $result = $this->db->get_where('user', array('id'=>$user_id))->num_rows();
        if ($result > 0)
        {
            return TRUE;
        }
        else
        {
            return FALSE;
        }
    }

    public function get_user_name($user_id = NULL)
    {
        if (empty($user_id))
        {
            return NULL;
        }
        $this->db->select('first_name, last_name');
        $result = $this->db->get_where('user', array('id'=>$user_id))->row_array();
        return $result['first_name'] . ' ' . $result['last_name'];
    }

    public function get_driver_orders($user_id)
    {
        $this->db->distinct();
        $this->db->select(''
            . 'order.id as order_id, '
            . 'order.date, '
            . 'order.location, '
            . 'order.location_lat, '
            . 'order.location_lng, '
            . 'order.dst_location, '
            . 'order.dst_location_lat, '
            . 'order.dst_location_lng, '
            . 'customer.id as customer_id, '
            . 'customer.first_name as customer_name, '
            . 'customer.last_name as customer_surname, '
            . 'customer.phone as customer_phone, '
            . 'driver.id as driver_id, '
            . 'driver.first_name as driver_name, '
            . 'driver.last_name as driver_surname, '
            . 'r_order_state.name as state_name'
            );
        $this->db->from('order');
        $this->db->join('session_option as cust_s_o', 'cust_s_o.id = order.session_id', 'left');
        $this->db->join('session_option as drv_s_o', 'drv_s_o.id = order.driver_session_id', 'left');
        $this->db->join('session as cust_s', 'cust_s.id = cust_s_o.session_id', 'left');
        $this->db->join('session as drv_s', 'drv_s.id = drv_s_o.session_id', 'left');
        $this->db->join('user as customer', 'customer.id = cust_s.user_id', 'left');
        $this->db->join('user as driver', 'driver.id = drv_s.user_id and driver.id = ' . $user_id);
        $this->db->join('r_order_state', 'r_order_state.id = order.r_order_state_id');
        $this->db->order_by('order_id', 'desc');
        $result = $this->db->get()->result_array();
        if ( ! empty($result))
        {
            foreach($result as $key => $value)
            {
                $result[$key]['date'] = date(self::DATE_FORMAT, $result[$key]['date']);
                $result[$key]['customer_full_name'] = $this->formated_full_name($result[$key]['customer_name'], $result[$key]['customer_surname']);
                $result[$key]['driver_full_name'] = $this->formated_full_name($result[$key]['driver_name'], $result[$key]['driver_surname']);
                $result[$key]['color_state'] = $this->color_map[$result[$key]['state_name']];
            }
        }
        return $result;
    }

    public function get_customer_orders($user_id)
    {
        $this->db->distinct();
        $this->db->select(''
            . 'order.id as order_id, '
            . 'order.date, '
            . 'order.location, '
            . 'order.location_lat, '
            . 'order.location_lng, '
            . 'order.dst_location, '
            . 'order.dst_location_lat, '
            . 'order.dst_location_lng, '
            . 'customer.id as customer_id, '
            . 'customer.first_name as customer_name, '
            . 'customer.last_name as customer_surname, '
            . 'customer.phone as customer_phone, '
            . 'driver.id as driver_id, '
            . 'driver.first_name as driver_name, '
            . 'driver.last_name as driver_surname, '
            . 'r_order_state.name as state_name'
            );
        $this->db->from('order');
        $this->db->join('session_option as cust_s_o', 'cust_s_o.id = order.session_id', 'left');
        $this->db->join('session_option as drv_s_o', 'drv_s_o.id = order.driver_session_id', 'left');
        $this->db->join('session as cust_s', 'cust_s.id = cust_s_o.session_id', 'left');
        $this->db->join('session as drv_s', 'drv_s.id = drv_s_o.session_id', 'left');
        $this->db->join('user as customer', 'customer.id = cust_s.user_id and customer.id = ' . $user_id);
        $this->db->join('user as driver', 'driver.id = drv_s.user_id', 'left');
        $this->db->join('r_order_state', 'r_order_state.id = order.r_order_state_id');
        $this->db->order_by('order_id', 'desc');
        $result = $this->db->get()->result_array();
        if ( ! empty($result))
        {
            foreach($result as $key => $value)
            {
                $result[$key]['date'] = date(self::DATE_FORMAT, $result[$key]['date']);
                $result[$key]['customer_full_name'] = $this->formated_full_name($result[$key]['customer_name'], $result[$key]['customer_surname']);
                $result[$key]['driver_full_name'] = $this->formated_full_name($result[$key]['driver_name'], $result[$key]['driver_surname']);
                $result[$key]['color_state'] = $this->color_map[$result[$key]['state_name']];
            }
        }
        return $result;
    }
}
/* End of file orders_model.php */

