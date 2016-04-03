(function($) {

  function azurPostMap() {
    var infowindow = new google.maps.InfoWindow({maxWidth: 500});
    //var iconGoogle = { url: "//my-azur.de/load/f/o/marker-google-red.png" }; 
    var iconGoogle = { url: "//mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1" };
    //var iconGoogleBlue = { url: "//my-azur.de/load/f/o/marker-google-blue.png" };
    var iconGoogleBlue = { url: "//mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-blue.png?scale=1" };
    var iconRed = { anchor: new google.maps.Point(11, 11), url: "//my-azur.de/load/f/o/dot-red.png" };
    var iconGreen = { anchor: new google.maps.Point(11, 11), url: "//my-azur.de/load/f/o/dot-green.png" };
    var iconBlue = { anchor: new google.maps.Point(11, 11), url: "//my-azur.de/load/f/o/dot-blue.png"};
    var iconPinRed = { anchor: new google.maps.Point(24, 12), url: "//my-azur.de/load/f/o/map-marker-24.png"};
    // Icons: http://stackoverflow.com/a/18531494

    for(var type in google.maps.MapTypeId) {
      mapTypeIds.push(google.maps.MapTypeId[type]);
    }

    map = new google.maps.Map($map.get(0), {
      zoom: 4,
      center: new google.maps.LatLng(0, 0),
      mapTypeControlOptions: {
        mapTypeIds: mapTypeIds
      }
    });

    newMapType("osm", "OSM", "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    newMapType("watercolor", "Watercolor", "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", "abcd");

    google.maps.event.addListener(map, 'click', function() {
      infowindow.close();
    });

    $.each(azurPostmapData, function(i, entry){
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

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map
      });
      
      if(post_tags.indexOf('sehenswert') != -1) {
        marker.setIcon(iconGoogleBlue);
      }
      
      markers.push(marker);

      if(post_title) {
        var tooltip = new Tooltip({
          marker: marker,
          content: post_title,
          cssClass: 'googleTooltip',
          position: 'left',
          gap: 8
        });
      }

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(
          '<nobr><h2><a href="' + permalink + '">' + post_title + '</a></h2></nobr>' +
          '<p>' + post_content + '</p>' +
          '<p>' + post_date + ' <a href="' + permalink + '">Kompletten Bericht lesen</a></p>'
        );
        infowindow.open(map,marker);
      });

    });

    var bounds = new google.maps.LatLngBounds();
    for(i=0; i<markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }
    map.fitBounds(bounds);
  }

  function newMapType(id, text, url, subdomains, maxzoom, tilesize) {
    subdomains = typeof subdomains !== 'undefined' ? subdomains : 'abc';
    maxzoom = typeof maxzoom !== 'undefined' ? maxzoom : 18;
    tilesize = typeof tilesize !== 'undefined' ? tilesize : 256;

    mapTypeIds.push(id);
    map.mapTypes.set(id, new google.maps.ImageMapType({
      name: text,
      getTileUrl: function(coord, zoom) {
        tileUrl = url;
        subdomain = subdomains.charAt(Math.floor(Math.random() * subdomains.length));

        // normalize coord, repeat x but not y
        var y = coord.y; var x = coord.x;
        var tileRange = 1 << zoom;
        if (y < 0 || y >= tileRange) {return null;}
        if (x < 0 || x >= tileRange) { x = (x % tileRange + tileRange) % tileRange;}
        tileCoord = {x: x,y: y};

        tileUrl = tileUrl.replace("{s}", subdomain);
        tileUrl = tileUrl.replace("{z}", zoom).replace("{x}", tileCoord.x).replace("{y}", tileCoord.y);
        return tileUrl;
      },
      maxZoom: maxzoom,
      tileSize: new google.maps.Size(tilesize, tilesize)
    }));
  }

  var $map = $('#azur-postmap');
  var map, mapTypeIds = [], markers = [];

  window.azurPostMap = azurPostMap;

  if($map.length){
    var scripts = document.getElementsByTagName("script"); // http://stackoverflow.com/a/2255727/1461859
    var file = scripts[scripts.length-1].src.split('?')[0];
    var azurPostMapPluginDir = file.substr(0, file.lastIndexOf( '/' ) );

    $.getScript(azurPostMapPluginDir + '/google.tooltip.js', function() {
      azurPostMap();
    });
  }

})(jQuery);
