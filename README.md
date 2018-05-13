# Wordpress Post on Map


## Usage
```
[azur-postmap category_name="Reisen"]
```
All posts with geolocation within given category will displayed


## Recommended CSS
```CSS 
.azur-postmap {
  height: 500px;
  margin-bottom: 1.6471em;
}

.azur-postmap img {
  max-width: none;
}

.azur-postmap .gm-style .gm-style-iw {
  font-size: 14px;
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
Use Wordpress Hook ''azur_postmap_user_script'' to inject custom Javascript
var ''azurPostMap'' is an object with the property map and controlLayers

```
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
