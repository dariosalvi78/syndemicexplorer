let disposableIncomeLabel = [],
  comparedDisposableIncomeLabel = [];

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
    borderColor: color,
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
