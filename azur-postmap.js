(function($) {

  function azurPostMapInit() {
    var scripts = document.getElementsByTagName("script"), // http://stackoverflow.com/a/2255727/1461859
      file = scripts[scripts.length-1].src.split('?')[0];
    var azurPostMapPluginDir = file.substr(0, file.lastIndexOf( '/' ) );
    
    $.getScript(azurPostMapPluginDir + '/google.tooltip.js', function() {
      azurPostMap();
    });
  }
  
  function azurPostMap() {
    var infowindow = new google.maps.InfoWindow({maxWidth: 500});
    var iconGoogle = { url: "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1" };
    var iconRed = { anchor: new google.maps.Point(11, 11), url: "http://load.my-azur.de/f/o/dot-red.png" };
    var iconGreen = { anchor: new google.maps.Point(11, 11), url: "http://load.my-azur.de/f/o/dot-green.png" };
    var iconBlue = { anchor: new google.maps.Point(11, 11), url: "http://load.my-azur.de/f/o/dot-blue.png"};
    var iconPinRed = { anchor: new google.maps.Point(24, 12), url: "http://load.my-azur.de/f/o/map-marker-24.png"};
    
    for(var type in google.maps.MapTypeId) {
      mapTypeIds.push(google.maps.MapTypeId[type]);
    }     

    map = new google.maps.Map($map.get(0), {
      zoom: 4,
      center: new google.maps.LatLng(0, 0),
      mapTypeControlOptions: {
        mapTypeIds: mapTypeIds
      },
      styles: [{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]}]
    });
    
    newMapType("osm", "OSM", "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    newMapType("watercolor", "Watercolor", "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", "abcd");    
    
    google.maps.event.addListener(map, 'click', function() {
      infowindow.close();
    }); 
    
    $.each(azurPostmapData, function(i, entry){
      var post_title = entry.post_title;
      var post_content = entry.post_content;
      var post_date = entry.post_date;
      var permalink = entry.permalink;
      
      var lat = entry.lat;
      var lng = entry.lng;
      
      if(!/^[+-]?\d+(\.\d+)?/.test(lat) || !/^[+-]?\d+(\.\d+)?/.test(lng)){
        return;
      }
        
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        //icon: iconPinRed,
        map: map,
        //title: entry.post_title
      });
      
      markers.push(marker);

      var tooltip = new Tooltip({
        marker: marker,
        content: entry.post_title,
        cssClass: 'googleTooltip',
        position: 'left',
        gap: 8
      });      
      
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

  window.azurPostMapInit = azurPostMapInit;
  window.azurPostMap = azurPostMap;   

  if($map.length){
    azurPostMapInit();
  }   
  
})(jQuery);
