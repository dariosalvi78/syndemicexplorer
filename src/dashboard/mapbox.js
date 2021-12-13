mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9lbHN2ZW4iLCJhIjoiY2t1bWd3aXgwMWRrOTJxbzY1a3EwOTdhcyJ9.nrnAVPEsxD0zqcmH9g8E3g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-5.0, 52.47],
  zoom: 1,
});
map.on('load', () => {
  map.addSource('custom', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
    },
  });
});

map.on('load', () => {
  map.addSource('secondArea', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
    },
  });
});

map.on('load', function () {
  map.addSource('confirmedcases', {
    type: 'geojson',
    data: 'http://localhost:5000/api/v1/heatmapdata?level=1&countryCode=SWE&date=2021-11-22&indicator=confirmed',
  });

  map.addLayer(
    {
      id: 'confirmed-heat',
      type: 'heatmap',
      source: 'confirmedcases',
      maxzoom: 21,
      paint: {
        // increase weight as diameter breast height increases
        'heatmap-weight': {
          property: 'confirmed',
          type: 'exponential',
          stops: [
            [1, 1],
            [5000, 3],
          ],
        },
        // increase intensity as zoom level increases
        'heatmap-intensity': {
          stops: [
            [11, 1],
            [15, 3],
          ],
        },
        // assign color values be applied to points depending on their density
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(253, 90, 0,0)',
          0.2,
          'rgb(208,209,230)',
          0.4,
          'rgb(254, 208, 0)',
          0.6,
          'rgb(253, 4, 0)',
          0.8,
          'rgb(171, 0, 0)',
        ],
        // increase radius as zoom increases
        'heatmap-radius': {
          stops: [
            [11, 15],
            [15, 20],
          ],
        },
        // decrease opacity to transition into the circle layer
        'heatmap-opacity': {
          default: 1,
          stops: [
            [14, 1],
            [15, 0],
          ],
        },
      },
    },
    'waterway-label'
  );
  map.addLayer(
    {
      id: 'confirmed-point',
      type: 'circle',
      source: 'confirmedcases',
      minzoom: 7,
      paint: {
        'circle-radius': {
          property: 'confirmed',
          type: 'exponential',
          stops: [
            [{ zoom: 15, value: 500 }, 5],
            [{ zoom: 15, value: 5000 }, 20],
            [{ zoom: 22, value: 500 }, 20],
            [{ zoom: 22, value: 5000 }, 50],
          ],
        },
        'circle-color': {
          property: 'confirmed',
          type: 'exponential',
          stops: [
            [0, 'rgba(236,222,233,0)'],
            [1000, 'rgb(236,222,239)'],
            [2000, 'rgb(208,209,230)'],
            [3000, 'rgb(254, 186, 0)'],
            [4000, 'rgb(254, 208, 0)'],
            [5000, 'rgb(253, 4, 0)'],
            [6000, 'rgb(171, 0, 0)'],
          ],
        },
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': {
          stops: [
            [6, 0.2],
            [8, 0.8],
          ],
        },
      },
    },
    'waterway-label'
  );
});

const showHeatMapForSelectedLevel = (param) => {
  let data = {};

  data = `http://localhost:5000/api/v1/heatmapdata?${param}`;

  console.log(data);

  map.getSource('confirmedcases').setData(data);
};
map.on('draw.update', showHeatMapForSelectedLevel);

map.getCanvas().style.cursor = 'pointer';
map.on('mousemove', 'confirmed-point', function (e) {
  console.log('DET FUNKAR ATT KLICKA');
  popup
    .setLngLat(e.features[0].geometry.coordinates)
    .setHTML('<b>Confirmed cases:</b> ' + e.features[0].properties.confirmed)
    .addTo(map); /* Add layer to the map. */
});

//fits the map around the selected area
const setBoundingBox = (bound1, bound2) => {
  let bounds = new mapboxgl.LngLatBounds(bound1, bound2);

  map.fitBounds(bounds);
};

//sets a colored border around the selected area

const borderAroundSecondArea = () => {
  map.getSource('secondArea').setData({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [secondBorderArray],
    },
  });
  map.addLayer(
    {
      id: 'secondFill',
      type: 'fill',
      source: 'secondArea',
      paint: {
        'fill-outline-color': compareColor,
        'fill-color': compareColor,
      },
    },
    'settlement-label'
  );
};

const borderAroundSelectedArea = () => {
  map.getSource('custom').setData({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [borderArray],
    },
  });
  map.addLayer(
    {
      id: 'inline',
      type: 'fill',
      source: 'custom',
      paint: {
        'fill-outline-color': color,
        'fill-color': color,
      },
    },
    'settlement-label'
  );
};

var popup = new mapboxgl.Popup({
  closeButton: false,
});

map.on('mouseleave', 'confirmed-point', function () {
  map.getCanvas().style.cursor = '';
  popup.remove();
});
