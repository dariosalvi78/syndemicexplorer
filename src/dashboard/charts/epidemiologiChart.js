let dateLabel = [],
  confirmedLabel = [],
  employeeAgeData = [];

let chart;

function deleteAndAddChart() {
  let element = document.getElementById('myChart');
  element.parentNode.removeChild(element);
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'myChart');
  document.getElementById('chartArea').appendChild(canvas);
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
        },
      ],
    },

    // Configuration options go here
    options: {
      tooltips: {
        mode: 'index',
      },
    },
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
