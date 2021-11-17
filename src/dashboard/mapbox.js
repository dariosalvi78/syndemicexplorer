mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9lbHN2ZW4iLCJhIjoiY2t1bWd3aXgwMWRrOTJxbzY1a3EwOTdhcyJ9.nrnAVPEsxD0zqcmH9g8E3g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/joelsven/ckw29pxch04ls14p4lndhhfjf',
  center: [-5.0, 52.47],
  zoom: 1,
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav);
const setBoundingBox = (bound1, bound2) => {
  let bounds = new mapboxgl.LngLatBounds(bound1, bound2);

  console.log('hej' + bounds);
  map.fitBounds(bounds);
};

var popup = new mapboxgl.Popup({
  closeButton: false,
});
map.on('load', function () {
  // Add the source to query. In this example we're using
  // county polygons uploaded as vector tiles
  map.addSource('heatmap', {
    type: 'vector',
    url: 'joelsven.ckw12tb6k0wmv24qalr4bd9d0-5dzee',
  });

  map.on('mousemove', 'heatmap', function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Single out the first found feature.
    var feature = e.features[0];

    // Display a popup with the name of the county
    popup
      .setLngLat(e.lngLat)
      .setText('Confirmed cases: ' + feature.properties.confirmed)
      .addTo(map);
  });

  map.on('mouseleave', 'heatmap', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});
