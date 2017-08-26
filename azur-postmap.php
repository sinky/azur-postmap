<?php
/*
Plugin Name: Azur Post Map
Plugin URI: http://my-azur.de
Version: 0.1
Author: Marco Krage
Author URI: http://my-azur.de
Description: Show a map with posts
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

function azur_postmap_scripts() {
  wp_register_script('google-maps', 'https://maps.googleapis.com/maps/api/js?v=3.26', array(), 0, true);
  wp_register_script('azur-google-maps-tooltips', plugins_url('google.tooltip.js', __FILE__ ), array(), 0, true);
  wp_register_script('azur-postmap', plugins_url('azur-postmap.js', __FILE__ ), array(), 0, true);
}
add_action('wp_enqueue_scripts', 'azur_postmap_scripts');

function azur_postmap_shortcode( $atts ) {
  $options = shortcode_atts( array(
    'category_name' => '',
    'tag' => ''
    ), $atts );

  $posts = get_posts(array(
    'numberposts'   => -1,
    'category_name' => $options['category_name'],
    'tag' => $options['tag']
  ));
  
  wp_enqueue_script('google-maps');
  wp_enqueue_script('azur-google-maps-tooltips');
  wp_enqueue_script('azur-postmap');

  $data = array();

  foreach($posts as $post) {
    $id = $post->ID;
    $lat = get_post_meta($post->ID, 'geo_latitude', true);
    $lng = get_post_meta($post->ID, 'geo_longitude', true);
    if(empty($lat) || empty($lng)) { continue; }

    $e = new StdClass();
    $e->id = $id;
    $e->permalink = get_permalink($id);
    $e->lat = $lat;
    $e->lng = $lng;
    $e->post_title = $post->post_title;
    $e->post_content = $post->post_excerpt;
    if(empty(trim($e->post_content))) {
      $e->post_content = substr(strip_tags($post->post_content),0, 300);
      if(strlen($e->post_content) >= 300) {
        $e->post_content .= " &hellip;";
      }

      if(empty(trim($e->post_content))) {
        $e->post_content = "Kein Text Auszug vorhanden.";
      }
    }
    
    $e->post_date = date("d.m.Y", strtotime($post->post_date));
    $e->post_tags = implode(',', wp_get_post_tags($id, array('fields'=>'names')) );
    
    $data[] = $e;
  }

  $json = json_encode($data);

  $output =  "<script>var azurPostmapData = ".$json.";</script>";
  $output .=  "<div id='azur-postmap' class='azur-postmap'>Lade Postmap ...</div>";

  return $output;
}
add_shortcode( 'azur-postmap', 'azur_postmap_shortcode' );

if(!function_exists('azur_adminbar_map')) {
  function azur_adminbar_map() {
    global $wp_admin_bar;
    $wp_admin_bar->add_menu( array(
      'parent' => false,
      'id' => 'map',
      'title' => 'Map',
      'href' => plugins_url('map.html', __FILE__ ),
      'meta' => array('target' => '_blank')
    ));
  }
  add_action( 'wp_before_admin_bar_render', 'azur_adminbar_map' );
}
