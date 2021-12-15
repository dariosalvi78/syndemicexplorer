let xAxisLabel = {};
let color = {};
let compareColor = {};
let chartSocio;

let comparedPopulationLabel = [],
  comparedForeignBackgroundLabel = [],
  populationLabel = [],
  foreignBackgroundLabel = [],
  educationalLevelLabel = [],
  disposableIncomeLabel = [],
  overcrowdednessLabel = [],
  comparedOvercrowdednessLabel = [],
  comparedDisposableIncomeLabel = [],
  comparedEducationalLevelLabel = [];

function addSocioChart() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'chart2');
  document.getElementById('chartArea2').append(canvas);
}

function deleteSocioChart() {
  let element = document.getElementById('chart2');
  if (element) {
    element.parentNode.removeChild(element);
  }
}

async function createSocioChart() {
  const ctx = document.getElementById('chart2').getContext('2d');
  //Fill gradient

  chartSocio = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: dateLabel,
      datasets: [],
    },
    options: options,
  });
  chartSocio.update('active');
}

async function overcrowdednessData(param) {}
async function overcrowdednessChart(param) {
  await overcrowdednessData(param);
  const newDataset = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: color,
    data: overcrowdednessLabel,
  };

  chartSocio.data.datasets.push(newDataset);
  chartSocio.update();
}

async function compareDisposableIncomeChart(param) {
  await compareDisposableIncomeData(param);

  const newDataset = {
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedEducationalLevelLabel,
  };

  chartSocio.data.datasets.push(newDataset);
  chartSocio.update();
}

async function compareDisposableIncomeData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const educationalLevel = barChartData.map((x) => x.value);
  const place = barChartData[0].gid;
  //console.log(population);

  comparedEducationalLevelLabel = educationalLevel;
  placeLabel = place;
}

async function disposableIncomeSocioData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const disposableIncome = barChartData.map((x) => x.value);

  const place = barChartData[0].gid;
  const levels = barChartData.map((x) =>
    x.indicator.slice(18).replace('_', ' ')
  );

  disposableIncomeLabel = disposableIncome;
  xAxisLabel = levels;
  placeLabel = place;
  console.log(xAxisLabel);
}
async function disposableIncomeSocioChart(param) {
  chartSocio.data.datasets = [];
  await disposableIncomeSocioData(param);
  const newDataSet = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: '#fff',
    pointBackgroundColor: 'rgb(189,195,199)',
    data: disposableIncomeLabel,
    fill: true,
    radius: 3,
    hitRadius: 10,
    hoverRadius: 5,
    tension: 0.3,
    opacity: 0.5,
  };
  chartSocio.data.datasets.push(newDataSet);
  chartSocio.data.labels = xAxisLabel;
  chartSocio.update();
}

async function educationalLevelSocioChart(param) {
  chartSocio.data.datasets = [];
  await educationalLevelSocioData(param);
  const newDataSet = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: '#fff',
    pointBackgroundColor: 'rgb(189,195,199)',
    data: educationalLevelLabel,
    fill: true,
    radius: 3,
    hitRadius: 10,
    hoverRadius: 5,
    tension: 0.3,
    opacity: 0.5,
  };
  chartSocio.data.datasets.push(newDataSet);
  chartSocio.data.labels = xAxisLabel;
  chartSocio.update();
}
async function educationalLevelSocioData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const educationalLevel = barChartData.map((x) => x.value);

  const place = barChartData[0].gid;
  const levels = barChartData.map((x) =>
    x.indicator.slice(18).replace('_', ' ')
  );

  educationalLevelLabel = educationalLevel;
  xAxisLabel = levels;
  placeLabel = place;
  console.log(xAxisLabel);
}
async function compareEducationalLevelChart(param) {
  await compareEducationalLevelData(param);

  const newDataset = {
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedEducationalLevelLabel,
  };

  chartSocio.data.datasets.push(newDataset);
  chartSocio.update();
}
async function compareEducationalLevelData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const educationalLevel = barChartData.map((x) => x.value);
  const place = barChartData[0].gid;
  //console.log(population);

  comparedEducationalLevelLabel = educationalLevel;
  placeLabel = place;
}
async function foreignBackgroundSocioChart(param) {
  chartSocio.data.datasets = [];
  await foreignBackgroundSocioData(param);
  const newDataSet = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: '#fff',
    pointBackgroundColor: 'rgb(189,195,199)',
    data: foreignBackgroundLabel,
    fill: true,
    radius: 3,
    hitRadius: 10,
    hoverRadius: 5,
    tension: 0.3,
    opacity: 0.5,
  };
  chartSocio.data.datasets.push(newDataSet);
  chartSocio.data.labels = xAxisLabel;
  chartSocio.update();
}
async function foreignBackgroundSocioData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const foreignBackground = barChartData.map((x) => x.value);

  const place = barChartData[0].gid;
  const ageGroup = barChartData.map((x) =>
    x.indicator.slice(19).replace('-', ' ').replace('_', ' ')
  );

  foreignBackgroundLabel = foreignBackground;
  xAxisLabel = ageGroup;
  placeLabel = place;
  console.log(xAxisLabel);
}

async function populationSocioChart(param) {
  console.log('DENNA FUNKAR');
  // deleteAndAddSocioChart();
  await populationSocioData(param);

  const newDataSet = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: '#fff',
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
async function compareForeignBackgroundData(param) {
  const apiUrl = `http://localhost:5000/api/v1/socio_economics/${param}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const barChartData = await response.json();
  if (barChartData.length == 0) {
    modalSoc.classList.add('is-active');
  }
  console.log(barChartData);

  const foreignBackground = barChartData.map((x) => x.value);
  const place = barChartData[0].gid;
  //console.log(population);

  comparedForeignBackgroundLabel = foreignBackground;
  placeLabel = place;
}
async function compareForeignBackgroundChart(param) {
  await compareForeignBackgroundData(param);

  const newDataset = {
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedForeignBackgroundLabel,
  };
  console.log(comparedForeignBackgroundLabel);
  chartSocio.data.datasets.push(newDataset);
  chartSocio.update();
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
    label: 'Population ' + placeLabel,
    backgroundColor: compareColor,
    borderColor: '#fff',
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

function compareRandomColor() {
  // var r = () => (Math.random() * 256) >> 0;
  compareColor = colorArray[Math.floor(Math.random() * colorArray.length)];
  return compareColor;
}

var colorArray = [
  'rgba(4, 70, 192, 0.33)',
  'rgba(209, 35, 26, 0.33)',
  'rgba(0, 141, 56, 0.33)',
  'rgba(141, 108, 0, 0.33)',
  'rgba(41, 24, 109, 0.5)',
  'rgba(254, 108, 67, 0.5)',
  'rgba(13, 186, 85, 0.5)',
];
