function initializeMap(imageUrl, iconUrl, shadowUrl) {
  var img = new Image();
  
  img.onload = function() {
    var w = this.width,
        h = this.height;
  
    var mapContainer = document.getElementById('map');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100vh';
    maxZoom = 4
    var map = L.map('map', {
        minZoom: -5,
        maxZoom: 3,
        center: [0, 0],
        zoom: 1,
        crs: L.CRS.Simple,
        zoomSnap: 0.5
    });
  
    L.Icon.Default.prototype.options.iconUrl = iconUrl;
    L.Icon.Default.prototype.options.shadowUrl = shadowUrl;
  
    var southWest = map.unproject([0, h], map.getMaxZoom());
    var northEast = map.unproject([w, 0], map.getMaxZoom());
    var bounds = new L.LatLngBounds(southWest, northEast);
  
    L.imageOverlay(imageUrl, bounds).addTo(map);
    map.fitBounds(bounds);
  
    map.on('click', function(e) {
        // Create a form in a popup at the clicked location
        var popupContent = '<form id="poi-form">' +
        '<label for="description">Description:</label>' +
        '<textarea id="description" name="description" rows="3"></textarea>' +
        '<button type="submit">Create POI</button>' +
        '</form>';

      var popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(popupContent)
      .openOn(map);

      // Submit listener for the form within the popup
      var form = document.getElementById('poi-form');
      form.onsubmit = function(event) {
        // Prevent the form from submitting the traditional way
        event.preventDefault();
        var description = document.getElementById('description').value;
        createPOI(e.latlng.lng, e.latlng.lat, description);
        map.closePopup();
      };
    });
    fetch('/pois')
    .then(response => response.json())
    .then(pois => {
      console.log(pois);
      pois.forEach(poi => {
        if(poi.latitude !== null && poi.longitude !== null) { // Check if the properties are defined
          L.marker([poi.latitude, poi.longitude]).addTo(map).bindPopup(poi.description);
        }
      });
    })
    .catch(error => console.log('Error loading POIs:', error));

  };
  
  img.src = imageUrl; // Set the source to start loading the image
}
window.initializeMap = initializeMap;

function createPOI(x, y, description) {
  fetch('/pois', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Ensure you have the CSRF token in the meta tag
    },
    body: JSON.stringify({
      poi: { longitude: x, latitude: y, description: description }
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('POI created:', data);
    // Here you might want to add a marker to the map or update the view in some way
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

