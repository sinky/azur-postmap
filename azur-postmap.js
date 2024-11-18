function _azurPostMap(container, data) {

	var map, markers = new L.featureGroup();

	container.innerHTML = '';

	/*
		Map
	*/
	var map = L.map(container, {
		center: [51,7],
		zoom: 3
	});


	/*
		Layers
	*/
	var tile_osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var baseLayers = {
		"OSM": tile_osm
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
	var controlLayers = new L.control.layers(baseLayers, overlays).addTo(map);

	// Map Scale
	L.control.scale().addTo(map);


	/*
		Data
	*/
	if(data.length > 0) {
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

			var marker = L.marker([lat, lng], {icon: icon, zIndexOffset: i*100});
			markers.addLayer(marker);

			marker.bindTooltip(post_title);
			marker.bindPopup(
				'<div class="popup-title"><a href="' + permalink + '">' + post_title + '</a></div>' +
				'<div class="popup-date">' + post_date + '</div>' +
				'<div class="popup-content">' + post_content + '</div>'
			)

		});

		map.fitBounds(markers.getBounds().pad(0.05));
	}

	return {
		map: map,
		controlLayers: controlLayers
	};
}
