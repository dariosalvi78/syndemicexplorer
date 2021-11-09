let dateLabel = [],
  confirmedLabel = [],
  employeeAgeData = [];

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

function deleteAndAddChart() {
  let element = document.getElementById('myChart');
  element.parentNode.removeChild(element);
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'myChart');
  document.getElementById('chartArea').append(canvas);
}

async function dummyChart(pelle) {
  deleteAndAddChart();
  await getDummyData(pelle);
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

//Fetch Data from API

async function getDummyData(pelle) {
  const apiUrl = `http://localhost:5000/api/v1/epidemiology/admareas2?area2Code=${pelle}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChatData = await response.json();
  console.log(barChatData);

  const confirmed = barChatData.map((x) => x.confirmed);
  console.log(confirmed);
  const date = barChatData.map((x) => x.date.slice(0, 10));

  confirmedLabel = confirmed;
  dateLabel = date;
  console.log(dateLabel);
}
