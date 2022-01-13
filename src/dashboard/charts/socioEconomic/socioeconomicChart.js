let xAxisLabel = {};
let color = {};
let compareColor = {};
let chartSocio;
let secondChart = false;

let overcrowdednessLabel = [],
  comparedOvercrowdednessLabel = [];

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
