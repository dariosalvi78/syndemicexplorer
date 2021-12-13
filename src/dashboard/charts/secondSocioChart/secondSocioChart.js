let chartSocio2;
function deleteAndAddSecondSocioChart() {
  let element = document.getElementById('chartSocio2');
  element.parentNode.removeChild(element);
  const canvas1 = document.createElement('canvas');
  canvas1.setAttribute('id', 'chartSocio2');
  document.getElementById('chartSocioArea2').append(canvas1);
}
async function createSecondSocioChart() {
  const ctx = document.getElementById('chartSocio2').getContext('2d');
  //Fill gradient

  chartSocio2 = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: dateLabel,
      datasets: [],
    },
    options: options,
  });
  chartSocio2.update('active');
}

async function compareDisposableIncomeChart2(param) {
  await compareDisposableIncomeData2(param);

  const newDataset = {
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedEducationalLevelLabel,
  };

  chartSocio2.data.datasets.push(newDataset);
  chartSocio2.update();
}

async function compareDisposableIncomeData2(param) {
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

async function disposableIncomeSocioData2(param) {
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
async function disposableIncomeSocioChart2(param) {
  chartSocio2.data.datasets = [];
  await disposableIncomeSocioData2(param);
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
  chartSocio2.data.datasets.push(newDataSet);
  chartSocio2.data.labels = xAxisLabel;
  chartSocio2.update();
}

async function educationalLevelSocioChart2(param) {
  chartSocio2.data.datasets = [];
  await educationalLevelSocioData2(param);
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
  chartSocio2.data.datasets.push(newDataSet);
  chartSocio2.data.labels = xAxisLabel;
  chartSocio2.update();
}
async function educationalLevelSocioData2(param) {
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
async function compareEducationalLevelChart2(param) {
  await compareEducationalLevelData2(param);

  const newDataset = {
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedEducationalLevelLabel,
  };

  chartSocio2.data.datasets.push(newDataset);
  chartSocio2.update();
}
async function compareEducationalLevelData2(param) {
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
async function foreignBackgroundSocioChart2(param) {
  chartSocio2.data.datasets = [];
  await foreignBackgroundSocioData2(param);
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
  chartSocio2.data.datasets.push(newDataSet);
  chartSocio2.data.labels = xAxisLabel;
  chartSocio2.update();
}
async function foreignBackgroundSocioData2(param) {
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

async function populationSocioChart2(param) {
  console.log('DENNA FUNKAR');
  // deleteAndAddSocioChart();
  await populationSocioData2(param);

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
  if (chartSocio2.data.datasets != []) {
    chartSocio2.data.datasets = [];
  }

  chartSocio2.data.datasets.push(newDataSet);
  chartSocio2.data.labels = xAxisLabel;
  chartSocio2.update();
}

async function populationSocioData2(param) {
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
async function compareForeignBackgroundData2(param) {
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
async function compareForeignBackgroundChart2(param) {
  await compareForeignBackgroundData2(param);

  const newDataset = {
    label: placeLabel,
    backgroundColor: compareColor,
    borderColor: compareColor,
    data: comparedForeignBackgroundLabel,
  };
  console.log(comparedForeignBackgroundLabel);
  chartSocio2.data.datasets.push(newDataset);
  chartSocio2.update();
}
async function comparePopulationSocioData2(param) {
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

async function comparePopulationSocioChart2(param) {
  await comparePopulationSocioData2(param);

  const newDataset = {
    label: 'Population ' + placeLabel,
    backgroundColor: compareColor,
    borderColor: '#fff',
    data: comparedPopulationLabel,
  };
  console.log(comparedPopulationLabel);
  chartSocio2.data.datasets.push(newDataset);
  chartSocio2.update();
}
