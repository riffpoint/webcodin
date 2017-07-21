<?php

class Pages_model extends CI_Model 
{
    
    /**
     * Default image directory
     * 
     * @var string
     */
    public $image_dir = './uploads/image/';    
    
    /**
     * Default PDF directory
     * 
     * @var string
     */
    public $pdf_dir = './uploads/pdf/';    
    
    /**
     * Default cache directory
     * 
     * @var string
     */
    public $cache_dir = './uploads/cache/';    
    
    /**
     * Image width
     * 
     * @var int
     */
    public $image_width = 1050;
    
    /**
     * Image height
     * 
     * @var int
     */
    public $image_height = 700;
        
    
    /**
     * Constructor
     */
    function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Delete Image
     *  
     * @param string $file_name
     * @return boolean
     */
    public function delete_image($file_name) 
    {
        return @unlink($file_name);
    }
    
    /**
     * Prepare uploaded image
     * 
     * @param array $file_data
     * @return boolean
     */
    public function prepare_image ($file_data) 
    {

        $file_name = $this->cache_dir . $file_data['file_name'];
        $original_file_name = $this->cache_dir . 'original_'.$file_data['file_name'];

        copy($file_name, $original_file_name);
        
        $dim = (intval($file_data['image_width']) / intval($file_data['image_height'])) - ($this->image_width / $this->image_height);        
        $this->load->library('image_lib');                                             

        $config['image_library'] = 'gd2';
        $config['source_image'] = $this->cache_dir . $file_data['file_name'];
        $config['maintain_ratio'] = TRUE;
        $config['height'] = $this->image_height;                        
        $config['width'] = $this->image_width;                                    
        $config['quality'] = "100%";
        $config['master_dim'] = ($dim > 0)? "height" : "width";
        $this->image_lib->initialize($config); 
        $this->image_lib->resize();
        $this->image_lib->clear();        


        list($image_width, $image_height) = getimagesize($file_name);        
        $dim = (intval($image_width) / intval($image_height)) - ($this->image_width / $this->image_height);                
        

        $config['image_library'] = 'gd2';
        $config['source_image'] = $this->cache_dir . $file_data['file_name'];
        $config['maintain_ratio'] = FALSE;
        $config['height'] = $this->image_height;                        
        $config['width'] = $this->image_width;                                    
        $config['quality'] = "100%";
        $config['x_axis'] = ($dim < 0) ? intval(($image_width - $this->image_width) / 2) : 0 ;
        $config['y_axis'] = ($dim < 0) ? intval(($image_height - $this->image_height) / 2) : 0;
        $this->image_lib->initialize($config); 
        $this->image_lib->crop();
        $this->image_lib->clear();                    
        
        return true;
    }
    
    /**
     * Upload image
     * 
     * @param string|int $file
     * @return string
     */
    public function upload_image ($file = 0) 
    {
		$config['upload_path'] = $this->cache_dir;
		$config['allowed_types'] = 'gif|jpg|png';
		$config['max_size']	= 0;
		$config['max_width']  = 0;
		$config['max_height']  = 0;
        $config['encrypt_name'] = TRUE;
        
        if (!empty($_POST['delete'])) {
            $this->delete_image($this->cache_dir . $_POST['delete']);
        }
        
        $this->load->library('upload', $config);
        
		if ( ! $this->upload->do_upload($file)) {
			$error = array('error' => $this->upload->display_errors('', ''));
            $data = array('error' => $error);
		} else {
			$file_data = $this->upload->data();
            if (!$this->prepare_image($file_data)) {
                $data = array( 'error' => 'Cannot resize image' );                
            } else {
                $data = array('upload_data' => $file_data);
            }            
		}        
        
        return json_encode($data);
    }
    
    /**
     * Submit form
     * 
     * @param array $param
     * @return string
     */
    public function submit($param) 
    {
        $this->db->trans_start();
        
        $file_name = '';
        if (!empty($param['preview'])) {
            $file_name = $param['preview'];
        }

        if (empty($file_name) || !file_exists($this->cache_dir . $file_name)) {
            $data = json_decode($this->upload_image('image'));
            $file_name = $data->upload_data->file_name;
        }             
        
        $this->db->insert('form', array(
            'key' => uniqid(),
            'name' => $param['name'],
            'team' => $param['team'],            
            'image' => $file_name,            
        ));
        $id = $this->db->insert_id(); 
        $this->db->trans_complete(); 
        if ($this->db->trans_status() === TRUE) {
            if (rename($this->cache_dir . $file_name , $this->image_dir . $file_name)) {
                if (rename($this->cache_dir . 'original_'. $file_name , $this->image_dir . 'original_'. $file_name)) {
                    return $this->get_key_by_id($id);    
                }                
            }
        }        
    }

    /**
     * Create PDF
     * 
     * @param string $key
     * @param string $html
     * @return boolean
     */
    public function create_pdf($key, $html) 
    {
        $this->load->helper(array('dompdf', 'file'));  
        $data = pdf_create($html, $key, FALSE);
        return write_file($this->pdf_dir . $key . '.pdf', $data);
    }
    
    /**
     * Get Key by Id
     * 
     * @param int $id
     * @return string
     */
    public function get_key_by_id ($id) 
    {
        $query = $this->db->get_where('form', array('id' => $id));        
        if ($query->num_rows() > 0) {
           $row = $query->row();
           return $row->key;
        } 
    }
    
    /**
     * Get form data by key
     * 
     * @param string $key
     * @return array
     */
    public function get_form_by_key ($key) 
    {
        $query = $this->db->get_where('form', array('key' => $key));        
        if ($query->num_rows() > 0) {
           return $query->row_array();
        } 
    }    
    
    /**
     * Download certificate
     * 
     * @param string $key
     */
    public function download ($key) 
    {    
        $this->load->helper('download');
        $data = file_get_contents($this->pdf_dir . $key . '.pdf'); 
        force_download($key . '.pdf', $data); 					
    }    
    
}