let foreignBackgroundLabel = [],
  comparedForeignBackgroundLabel = [];

async function foreignBackgroundSocioChart(param) {
  chartSocio.data.datasets = [];
  await foreignBackgroundSocioData(param);
  const newDataSet = {
    label: placeLabel,
    backgroundColor: color,
    borderColor: color,
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
