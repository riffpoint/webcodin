<?php
/**
 * Pages controller class
 */
class Pages extends CI_Controller 
{
    
    /**
     * Landing Action
     */
	public function landing() 
    {
        if ( ! file_exists(APPPATH.'/views/pages/landing.php')) {
            show_404();
        }

        $data['title'] = 'Lorem Ipsum';         

        $this->load->view('templates/header', $data);
        $this->load->view('pages/landing', $data);
        $this->load->view('templates/footer', $data);
	}
    
    /**
     * Certificate Form Action
     * 
     * @return string
     */
    public function certificate_form () 
    {
        if ( ! file_exists(APPPATH.'/views/pages/certificateform.php')) {
            show_404();
        }
        $data['title'] = 'Lorem Ipsum';         
        $data['is_form'] = TRUE;            
        
        if (!empty($_POST)) {
            $this->load->model('Pages_model');   
            $key = $this->Pages_model->submit($_POST);
            if (!empty($key)) {
                $html = $this->certificate($key, true);
                $this->Pages_model->create_pdf($key, $html);
                
                redirect( base_url("certificate/$key"), 'refresh');                    
            }
        } else {
            $this->load->view('templates/header', $data);
            $this->load->view('pages/certificateform', $data);
            $this->load->view('templates/footer', $data);        
        }
    }
    
    /**
     * Certificate Action
     * 
     * @param string $key
     * @param string $action
     * @return string
     */
    public function certificate ($key, $action = FALSE) 
    {
        if ( ! file_exists(APPPATH.'/views/pages/certificate.php')) {
            show_404();
        }

        $data['title'] = 'Lorem Ipsum';         
        $data['is_pdf'] = !empty($action);

        $this->load->model('Pages_model');                
        $form = $this->Pages_model->get_form_by_key($key);
        
        if (!empty($form)) {
            $data = array_merge_recursive($data, $form);
            
            $html = '';
            $html .= $this->load->view('templates/head', $data, true);
            $html .= $this->load->view('templates/certificate/header', $data, true);    
            $html .= $this->load->view('pages/certificate', $data, true);
            $html .= $this->load->view('templates/certificate/footer', true);        

            if ($action === 'download') {
                $this->load->helper('download');
                $this->load->helper(array('dompdf', 'file'));                  
                $data = pdf_create($html, $key, FALSE);
                force_download($key . '.pdf', $data); 					                
            } elseif ($action === 'test') {
                echo $html;
            } elseif ($action === FALSE) {
                echo $html;
            } else {
                return $html;
            }
        } else {
            show_404();
        }
    }    

    /**
     * Upload Image Action
     */
	function upload_image() 
    {
        $this->load->model('Pages_model');        

        echo $this->Pages_model->upload_image();         
	}    

    /**
     * Download Action
     * 
     * @param string $key
     */
    public function download ($key) 
    {    
        $this->load->model('Pages_model');        
        $this->Pages_model->download($key);                 
    }
    
}
