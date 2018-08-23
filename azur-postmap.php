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
	wp_register_style('leaflet', '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css');
	wp_register_script('leaflet-js', '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js', array(), 0, true);
	wp_register_script('azur-postmap', plugins_url('azur-postmap.js', __FILE__ ), array(), 0, true);
}
add_action('wp_enqueue_scripts', 'azur_postmap_scripts');

function azur_postmap_footer_script() { ?>
	<script>
	(function() {
		if(azurPostMapData.length){
			window.azurPostMap = _azurPostMap(document.querySelector('#azur-postmap'), azurPostMapData);
			<?php do_action('azur_postmap_user_script'); ?>
		}
	})();
</script>
<?php
}

function azur_postmap_shortcode( $atts ) {
	$options = shortcode_atts( array(
		'category_name' => '',
		'tag' => '',
		'center' => '',
		'radius' => ''
		), $atts );

	$posts = get_posts(array(
		'numberposts'	 => -1,
		'category_name' => $options['category_name'],
		'tag' => $options['tag']
	));

	wp_enqueue_style('leaflet');
	wp_enqueue_script('leaflet-js');
	wp_enqueue_script('azur-postmap');
	add_action('wp_footer', 'azur_postmap_footer_script', 99);

	$data = array();

	foreach($posts as $post) {
		$id = $post->ID;
		$lat = get_post_meta($post->ID, 'geo_latitude', true);
		$lng = get_post_meta($post->ID, 'geo_longitude', true);
		if(empty($lat) || empty($lng)) { continue; }

		if($options['center'] && $options['radius']) {
			list($searchLat,$searchLng) = explode(',', $options['center']);
			$coords = getBoundingBox($searchLat, $searchLng, $options['radius']);
			$checkInBounds = inBounds($lat, $lng, $coords['ne']['lat'], $coords['ne']['lon'], $coords['sw']['lat'], $coords['sw']['lon']);
			if(!$checkInBounds) { continue;	}
		}

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

	$output =	"<script>var azurPostMapData = ".$json.";</script>";
	$output .=	"<div id='azur-postmap' class='azur-postmap'>Lade Postmap ...</div>";

	return $output;
}
add_shortcode( 'azur-postmap', 'azur_postmap_shortcode' );


function getBoundingBox($lat, $lon, $radius) {
	$earth_radius = 6371.01;
	$maxLat = $lat + rad2deg($radius/$earth_radius);
	$minLat = $lat - rad2deg($radius/$earth_radius);
	$maxLon = $lon + rad2deg($radius/$earth_radius/cos(deg2rad($lat)));
	$minLon = $lon - rad2deg($radius/$earth_radius/cos(deg2rad($lat)));

	return array(
		"center" => array("lat" => $lat, "lon" => $lon),
		"nw" => array("lat" => $maxLat, "lon" => $minLon),
		"ne" => array("lat" => $maxLat, "lon" => $maxLon),
		"sw" => array("lat" => $minLat, "lon" => $minLon),
		"se" => array("lat" => $minLat, "lon" => $maxLon)
	);
}

function inBounds($pointLat, $pointLong, $boundsNElat, $boundsNElong, $boundsSWlat, $boundsSWlong) {
		$eastBound = $pointLong < $boundsNElong;
		$westBound = $pointLong > $boundsSWlong;

		if ($boundsNElong < $boundsSWlong) {
				$inLong = $eastBound || $westBound;
		} else {
				$inLong = $eastBound && $westBound;
		}

		$inLat = $pointLat > $boundsSWlat && $pointLat < $boundsNElat;
		return $inLat && $inLong;
}


