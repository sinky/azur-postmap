/*
 Constructor for the tooltip
 @ param options an object containing: marker(required), content(required), cssClass(a css class, optional), position(top, left, right or bottom (default), optional), gap(gap between tooltip and marker)
 @ see google.maps.OverlayView()
 */

function Tooltip(options) {
  // Now initialize all properties.
  this.marker_ = options.marker;
  this.content_ = options.content;
  this.map_ = options.marker.get('map');
  this.cssClass_ = options.cssClass || null;
  this.position = options.position || 'bottom';
  this.gap = options.gap || 0;

  // We define a property to hold the content's
  // div. We'll actually create this div
  // upon receipt of the add() method so we'll
  // leave it null for now.
  this.div_ = null;

  //Explicitly call setMap on this overlay
  this.setMap(this.map_);
  var me = this;
  // Show tooltip on mouseover event.
  google.maps.event.addListener(me.marker_, 'mouseover', function () {
    me.show();
  });
  // Hide tooltip on mouseout event.
  google.maps.event.addListener(me.marker_, 'mouseout', function () {
    me.hide();
  });
  
  // hasClass, addClass, removeClass functions
  this.hasClass = function(el, className) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);  
  };
  this.addClass = function(el, className) {
    if( !this.hasClass(el, className) ) {
      if (el.classList)
        el.classList.add(className);
      else
        el.className += ' ' + className;
    }  
  };
  this.removeClass = function(el, className) {
    if( this.hasClass(el, className) ) {
      if (el.classList)
        el.classList.remove(className);
      else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    } 
  };  
}
// Now we extend google.maps.OverlayView()
Tooltip.prototype = new google.maps.OverlayView();

// onAdd is one of the functions that we must implement, 
// it will be called when the map is ready for the overlay to be attached.
Tooltip.prototype.onAdd = function () {

  // Create the DIV and set some basic attributes.
  var div = document.createElement('DIV');
  div.style.position = "absolute";

  // Add User CSS Class
  if (this.cssClass_)
    div.className += " " + this.cssClass_;

  //Attach content to the DIV.
  div.innerHTML = this.content_;

  // Set the overlay's div_ property to this DIV
  this.div_ = div;

  // We add an overlay to a map via one of the map's panes.
  // We'll add this overlay to the floatPane pane.
  var panes = this.getPanes();
  panes.floatPane.appendChild(this.div_);
}
// We here implement draw
Tooltip.prototype.draw = function () {
  var that = this;
  setTimeout(function() { // Workaround: Google uses a custom font. This cause resize of the tooltip after the tooltip hat positioned.
    var div = that.div_;
    if (div) {
      // Position the overlay. We use the position of the marker
      // to peg it to the correct position, just northeast of the marker.
      // We need to retrieve the projection from that overlay to do that.
      var overlayProjection = that.getProjection();

      // Retrieve the coordinates of the marker
      // in latlngs and convert them to pixels coordinates.
      // We'll use these coordinates to place the DIV.
      var ne = overlayProjection.fromLatLngToDivPixel(that.marker_.getPosition());

      // Position the DIV.  
      var posLeft, posTop;
          
      switch(that.position) {
        case 'top':
          posLeft = ne.x - div.offsetWidth / 2;
          posTop = ne.y - div.offsetHeight - that.gap; // TODO: subtract marker height, but its often unknown
          break;
        case 'right':
          posLeft = ne.x + that.gap;
          posTop = ne.y - div.offsetHeight / 2;
          break;
        case 'left':
          posLeft = ne.x - div.offsetWidth - that.gap;
          posTop = ne.y - div.offsetHeight /2 ;
          break;  
        default: // bottom
          posLeft = ne.x - div.offsetWidth / 2;
          posTop = ne.y + that.gap;
      }
      
      div.style.left = posLeft + 'px';
      div.style.top = posTop + 'px';  
    }
  }, 150);
}
// We here implement onRemove
Tooltip.prototype.onRemove = function () {
  this.div_.parentNode.removeChild(this.div_);
}

// Note that the visibility property must be a string enclosed in quotes
Tooltip.prototype.hide = function () {
  if (this.div_) {
   this.removeClass(this.div_, 'hover');
  }
}

Tooltip.prototype.show = function () {
  if (this.div_) {
   this.addClass(this.div_, 'hover');
  }
}