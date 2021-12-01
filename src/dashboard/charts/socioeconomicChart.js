let chartSocio;
let optionsSocio = {
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

function deleteAndAddSocioChart() {
  let element = document.getElementById('chart2');
  element.parentNode.removeChild(element);
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'chart2');
  document.getElementById('chartArea2').append(canvas);
}

async function populationSocioChart(param) {
  console.log('DENNA FUNKAR');
  // deleteAndAddSocioChart();
  await populationSocioData(param);
  const ctx = document.getElementById('chart2').getContext('2d');
  //Fill gradient
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(58,123, 213, 1');
  gradient.addColorStop(1, 'rgba(0,210, 255, 0.1)');

  chartSocio = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: dateLabel,
      datasets: [
        {
          label: 'Population ' + placeLabel,
          backgroundColor: gradient,
          borderColor: '#fff',
          pointBackgroundColor: 'rgb(189,195,199)',
          data: populationLabel,
          fill: true,
          radius: 3,
          hitRadius: 10,
          hoverRadius: 5,
          tension: 0.3,
        },
      ],
    },

    // Configuration options go here
    options: optionsSocio,
  });
}

async function populationSocioData(param) {
  const apiUrl = `http://localhost:3000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const population = barChartData.map((x) => x.value);
  console.log(population);
  const place = barChartData[0].gid;
  const date = barChartData.map((x) =>
    x.indicator.slice(17, 28).replace('_', ' ')
  );

  populationLabel = population;
  dateLabel = date;
  placeLabel = place;
  console.log(dateLabel);
}
async function comparePopulationSocioData(param) {
  const apiUrl = `http://localhost:3000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const population = barChartData.map((x) => x.value);
  const place = barChartData[0].gid;
  console.log(population);

  comparedPopulationLabel = population;
  placeLabel = place;

  //Använd av find metod på array för att kolla om population redan finns

  console.log(dateLabel);
}

async function comparePopulationSocioChart(param) {
  await comparePopulationSocioData(param);

  const newDataset = {
    label: 'Population ' + placeLabel,
    backgroundColor: randomColor(),
    borderColor: '#fff',
    data: comparedPopulationLabel,
  };
  console.log(comparedPopulationLabel);
  chartSocio.data.datasets.push(newDataset);
  chartSocio.update();
}

function randomColor() {
  var r = () => (Math.random() * 256) >> 0;
  var color = `rgb(${r()}, ${r()}, ${r()})`;
  return color;
}
