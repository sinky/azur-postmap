# Wordpress Posts as Marker on Leaflet Map


## Usage
```
[azur-postmap]
```
All posts with geolocation
```
[azur-postmap category_name="Reisen"]
```
All posts with geolocation within given category will displayed

```
[azur-postmap center="51.163375,10.447683" radius="400"]
```
All posts with geolocation within a specified radius of the coordinates

```
[azur-postmap bbox="51.261915,6.866455,51.757640,7.848008"]
```
All posts with geolocation within a bounding box (http://bboxfinder.com //  Coordinate Format: Lat/Lng GDAL)

## Recommended CSS
```CSS 
.azur-postmap {
  height: 500px;
  margin-bottom: 1em;
}

.azur-postmap img {
  max-width: none;
}

.azur-postmap .popup-title,
.azur-postmap .popup-date {
  margin-bottom: .5em;
}

.azur-postmap .popup-title {
  font-size: large;
}
```

## Customize leaflet map
Use the Wordpress Hook ''azur_postmap_user_script'' to inject custom Javascript. For example to add a new tile layer.

The variable ''azurPostMap'' is an object with the property `map` and `controlLayers`

### Example
```PHP
add_action('azur_postmap_user_script', 'my_function');
function my_function() {?>
var mapbox_street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 22,
  id: 'mapbox.streets',
  accessToken: 'ACCESS_TOKEN'
});

// add custom tileLayer to controlLayers
azurPostMap.controlLayers.addBaseLayer(mapbox_street, "Mapbox Street");
```
