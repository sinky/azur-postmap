(function() {

function extend(obj, src) {
  Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
  return obj;
}

function azurPostMap(container, data) {

  var map, markers = new L.featureGroup();
  
  container.innerHTML = '';

  /*
    Map
  */
  var map = L.map(container, {
    center: [0,0],
    zoom: 9
  });


  /*
    Layers
  */
  var tile_osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var tile_stamen_watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    maxZoom: 18,
    subdomains: "a b c d".split(" "),
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
  });

  var tile_stamen_terrain = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
    maxZoom: 16,
    subdomains: "a b c d".split(" "),
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
  });

  var baseLayers = {
    "OSM": tile_osm,
    "Stamen Watercolor": tile_stamen_watercolor,
    "Stamen Terrain": tile_stamen_terrain
  };

  var overlays = {
    "Posts": markers
  };

  tile_osm.addTo(map);
  markers.addTo(map);


  /*
    Control
  */
  // Layer Control
  var controlLayers = L.control.layers(baseLayers, overlays).addTo(map);

  // Map Scale
  L.control.scale().addTo(map);


  /*
    Data
  */
  data.forEach(function(entry, i) {

    var post_title = entry.post_title;
    var post_content = entry.post_content;
    var post_date = entry.post_date;
    var post_tags = entry.post_tags;
    var permalink = entry.permalink;

    var lat = entry.lat;
    var lng = entry.lng;
    if(!/^[+-]?\d+(\.\d+)?/.test(lat) || !/^[+-]?\d+(\.\d+)?/.test(lng)){
      return;
    }

    var icon = L.icon({ 
		iconUrl:"//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png", 
		iconSize: [25, 41],
		iconAnchor: [12, 40],
		popupAnchor: [0, -40]
	});

    var marker = L.marker([lat, lng], {icon: icon});
    markers.addLayer(marker);

    marker.bindTooltip(post_title);
    marker.bindPopup(
      '<div class="popup-title"><a href="' + permalink + '">' + post_title + '</a></div>' +
      '<div class="popup-date">' + post_date + '</div>' +
      '<div class="popup-content">' + post_content + '</div>'
    )

    marker.on('mouseover', function (e) {
      this.openTooltip();
    });
    marker.on('mouseout', function (e) {
      this.closeTooltip();
    });

  });

  map.fitBounds(markers.getBounds().pad(0.05));
  
  return {
    map: map,
    controlLayers: controlLayers
  };
}

window.azurPostMap = azurPostMap;

})();