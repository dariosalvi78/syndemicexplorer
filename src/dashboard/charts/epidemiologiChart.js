let dateLabel = [],
  confirmedLabel = [];

let delayed;
let chart;
let options = {
  scales: {},

  responsive: true,
  pan: {
    enabled: true,
    mode: 'x',
  },
  zoom: {
    enabled: true,
    mode: 'x', // or 'x' for "drag" version
  },
  transitions: {
    show: {
      animations: {
        x: {
          from: 0,
          xAxis: true,
        },
        y: {
          from: 0,
          yAxis: true,
        },
      },
    },
    hide: {
      animations: {
        x: {
          to: 0,
          xAxis: true,
        },
        y: {
          to: 0,
          yAxis: true,
        },
      },
    },
  },
};

//Creates a graph with confirmed cases for the area
async function confirmedCasesChart(param) {
  // deleteAndAddEpidemChart();
  await confirmedCasesData(param);
  const ctx = document.getElementById('myChart').getContext('2d');
  //Fill gradient
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(58,123, 213, 1');
  gradient.addColorStop(1, 'rgba(0,210, 255, 0.1)');

  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: dateLabel,
      datasets: [
        {
          label: 'Confirmed Cases',
          backgroundColor: gradient,
          borderColor: '#fff',
          pointBackgroundColor: 'rgb(189,195,199)',
          data: confirmedLabel,
          fill: true,
          radius: 3,
          hitRadius: 10,
          hoverRadius: 5,
          tension: 0.3,
        },
      ],
    },

    // Configuration options go here
    options: options,
  });
}

//Fetches the data of area2Code depending on which dropdown menu value
async function confirmedCasesData(param) {
  const apiUrl = `http://localhost:5000/api/v1/epidemiology/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modal.classList.add('is-active');
  }
  console.log(barChartData);

  const confirmed = barChartData.map((x) => x.confirmed);
  console.log(confirmed);
  const date = barChartData.map((x) => x.date.slice(0, 10));

  confirmedLabel = confirmed;
  dateLabel = date;
  console.log(dateLabel);
}

function deleteAndAddEpidemChart() {
  let element = document.getElementById('myChart');
  element.parentNode.removeChild(element);
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'myChart');
  document.getElementById('chartArea').append(canvas);
}

//modal
const modalBgEpi = document.querySelector('.modal-background1');
const modalBgSoc = document.querySelector('.modal-background2');
const modalEpi = document.querySelector('.modalEpidem');
const modalSoc = document.querySelector('.modalSocio');

modalBgEpi.addEventListener('click', () => {
  modalEpi.classList.remove('is-active');
});

modalBgSoc.addEventListener('click', () => {
  modalSoc.classList.remove('is-active');
});
