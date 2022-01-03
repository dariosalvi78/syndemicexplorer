let populationLabel = [],
  comparedPopulationLabel = [];

async function populationSocioChart(param) {
  console.log('DENNA FUNKAR');
  // deleteAndAddSocioChart();
  await populationSocioData(param);

  const newDataSet = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: color,
    pointBackgroundColor: 'rgb(189,195,199)',
    data: populationLabel,
    fill: true,
    radius: 3,
    hitRadius: 10,
    hoverRadius: 5,
    tension: 0.3,
    opacity: 0.5,
  };
  if (chartSocio.data.datasets != []) {
    chartSocio.data.datasets = [];
  }

  chartSocio.data.datasets.push(newDataSet);
  chartSocio.data.labels = xAxisLabel;
  chartSocio.update();
}

async function populationSocioData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  // if (barChartData.length == 0) {
  //   modalSoc.classList.add('is-active');
  // }
  console.log(barChartData);

  const population = barChartData.map((x) => x.value);
  console.log(population);
  const place = barChartData[0].gid;
  const ageGroup = barChartData.map((x) =>
    x.indicator.slice(17, 28).replace('_', ' ')
  );

  populationLabel = population;
  xAxisLabel = ageGroup;
  placeLabel = place;
  console.log(xAxisLabel);
}

async function comparePopulationSocioData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
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
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedPopulationLabel,
  };
  console.log(comparedPopulationLabel);
  chartSocio.data.datasets.push(newDataset);
  chartSocio.update();
}

function randomColor() {
  color = colorArray[Math.floor(Math.random() * colorArray.length)];
  return color;
}
