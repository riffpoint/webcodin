<?php

class RPAdv_AdvertWidget extends WP_Widget {
    
	/**
	 * Sets up the widgets name etc
	 */
	public function __construct() {
		$widget_ops = array( 'description' => __( "Adds visual adverts to sidebar") );
		parent::__construct('rpadv_widget', __('WP Visual Adverts'), $widget_ops);
	}
    
	/**
	 * Outputs the content of the widget
	 *
	 * @param array $args
	 * @param array $instance
	 */
	public function widget( $args, $instance ) {
        echo $args['before_widget'];
        if (!empty( $instance['title'])) {
            echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ). $args['after_title'];
        }
      
        RPAdv()->showWidget(array(
                'id' => $this->id,
                'term' => !empty($instance['taxonomy_term']) && taxonomy_exists('advert-category') ? $instance['taxonomy_term'] : array(),
                'color' => !empty($instance['color']) ? $instance['color'] : '',            
            )
        );
        echo $args['after_widget'];
	}

	/**
	 * Outputs the options form on admin
	 *
	 * @param array $instance The widget options
	 */
	public function form( $instance ) {
		$title = !empty($instance['title']) ? $instance['title'] : '';
        $taxonomy_term = !empty($instance['taxonomy_term']) ? $instance['taxonomy_term'] : '';                
        $color = !empty($instance['color']) ? $instance['color'] : '';
    ?>
        <p><?php $this->renderTitleField($title); ?></p>
        <p><?php $this->renderTaxonomyTermField('advert-category', $taxonomy_term); ?></p>        
        <p><?php $this->renderTextColorField($color); ?></p>                
    <?php    
	}
    
    
	/**
	 * Processing widget options on save
	 *
	 * @param array $new_instance The new options
	 * @param array $old_instance The previous options
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = array();
        
		$instance['title'] = (!empty($new_instance['title'])) ? strip_tags( $new_instance['title'] ) : '';
        $instance['taxonomy_term'] = (!empty($new_instance['taxonomy_term'])) ? strip_tags( $new_instance['taxonomy_term'] ) : '';        
        $instance['color'] = (!empty($new_instance['color'])) ? strip_tags( $new_instance['color'] ) : '';        
        
		return $instance;
	}    
    
    public function renderTextColorField($color) {
    ?>
        <script type='text/javascript'>
            jQuery('.widgets-sortables .rpadv-color-picker').wpColorPicker();                                        
        </script>
        <label for="<?php echo esc_attr( $this->get_field_id( 'color' ) ); ?>" style="display:block;"><?php _e( 'Font Color:' ); ?></label> 
        <input class="widefat rpadv-color-picker" id="<?php echo esc_attr( $this->get_field_id( 'color' ) ); ?>" name="<?php echo $this->get_field_name( 'color' ); ?>" type="text" value="<?php echo esc_attr( $color ); ?>" />        
    <?php 
    }
    
    public function renderTitleField ($title) {
    ?>
        <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php _e( 'Title:' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">    
    <?php    
    }    

    public function renderTaxonomyTermField ($taxonomy, $current_term = '') {
        if (taxonomy_exists('advert-category')) :
        $args = array(
            'orderby'       => 'name', 
            'order'         => 'ASC',
            'hide_empty'    => false, 
            'fields'        => 'all', 
            'hierarchical'  => true, 
        ); 

        $terms = get_terms( $taxonomy, $args ); 
    ?>    
        <label for="<?php echo esc_attr( $this->get_field_id( 'taxonomy_term' ) ); ?>"><?php _e( 'Category:' ); ?></label>
        <select id="<?php echo esc_attr( $this->get_field_id( 'taxonomy_term' ) ); ?>" class="taxonomy-select widefat" name="<?php echo esc_attr( $this->get_field_name( 'taxonomy_term' ) ); ?>">
        <option value=""<?php selected( $current_term, '' ); ?>>All Adverts</option>            
        <?php foreach ( $terms as $term ) : ?>
            <option value="<?php echo $term->term_id; ?>"<?php selected( $current_term, $term->term_id ); ?>><?php echo $term->name; ?></option>
        <?php endforeach; ?>
        </select>
    <?php  
        endif;
    }    
    
}

    