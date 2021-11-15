mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9lbHN2ZW4iLCJhIjoiY2t1bWd3aXgwMWRrOTJxbzY1a3EwOTdhcyJ9.nrnAVPEsxD0zqcmH9g8E3g';

const successLocation = (position) => {
  // setupMap([position.coords.longitude, position.coords.latitude], 3);
};
const errorLocation = () => {
  // setupMap([-5.0, 52.47], 2);
};
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

const swedenLocation = () => {
  // setupMap([17.56, 59.33], 4);
};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
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
let total = 0;
fetch('http://localhost:5000/api/v1/epidemiology/')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((dat) => {
      let { area1_code, area2_code, confirmed, area3_code } = dat;
      if (area1_code === 'SWE.13_1') {
        total += confirmed;
        console.log(area2_code + ' ' + total + ' ' + area2_code);
      }
      new mapboxgl.Marker({}).setLngLat([0, 0]).addTo(map);
    });
  });
