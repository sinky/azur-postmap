# Wordpress Post on Map


## Usage
```
[azur-postmap category_name="Reisen"]
```
All posts with a custom field "latlng" and a coordinate like "51.4,7.5" will displayed


## Recommended CSS
```CSS 
.azur-postmap {
  height: 500px;
}
.azur-postmap img {
  max-width: none;
}
.googleTooltip {
  border-radius: 5px;
  background-color: rgba(0,0,0,0.7);
  color: #fff;
  padding: 5px;
  max-width: 200px;
  position: relative;
}

/* Arrow */
.googleTooltip.arrow:after {
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-color: rgba(0, 0, 0, 0);
  border-width: 5px;
}
.googleTooltip.top.arrow:after {
  top: 100%;
  right: 50%;
  border-top-color: rgba(0,0,0,0.7);
  margin-right: -5px;
}
.googleTooltip.bottom.arrow:after {
  bottom: 100%;
  left: 50%;
  border-bottom-color: rgba(0,0,0,0.7);
  margin-left: -5px;
}
.googleTooltip.arrow.right:after {
  top: 50%;
  right: 100%;
  border-right-color: rgba(0,0,0,0.7);
  margin-top: -5px;
}
.googleTooltip.arrow.left:after {
  top: 50%;
  left: 100%;
  border-left-color: rgba(0,0,0,0.7);
  margin-top: -5px;
}
```