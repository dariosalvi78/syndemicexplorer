let dateLabel = [],
  confirmedLabel = [],
  employeeAgeData = [];

let chart;
let options = {
  scales: {},
  pan: {
    enabled: true,
    mode: 'x',
  },
  zoom: {
    enabled: true,
    mode: 'x', // or 'x' for "drag" version
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

  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: dateLabel,
      datasets: [
        {
          label: 'Confirmed Cases',
          backgroundColor: 'blue',
          borderColor: 'rgb(255, 99, 132)',
          data: confirmedLabel,
          fill: false,
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
