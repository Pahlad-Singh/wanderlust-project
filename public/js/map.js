mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(coordinates) //listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${mapListing}</h4><p>Exact Location provided after booking</p>`))
.addTo(map);