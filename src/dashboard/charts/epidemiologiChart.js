/*
const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
const apiUrl = 'http://dummy.restapiexample.com/api/v1/employees';

var employeeLabel = [],
  employeeSalaryData = [],
  employeeAgeData = [];

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Confirmed Cases',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: employeeSalaryData,
    },
  ],
};
const config = {
  type: 'line',
  data: employeeSalaryData,
  options: {},
};
const myChart = new Chart(document.getElementById('myChart'), config);*/

let dateLabel = [],
  confirmedLabel = [],
  employeeAgeData = [];

async function dummyChart() {
  await getDummyData();

  const ctx = document.getElementById('myChart').getContext('2d');

  const chart = new Chart(ctx, {
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

dummyChart();

//Fetch Data from API

async function getDummyData() {
  const apiUrl = 'http://localhost:5000/api/v1/epidemiology/';

  const response = await fetch(apiUrl);
  const barChatData = await response.json();
  console.log(barChatData);

  const confirmed = barChatData.map((x) => x.confirmed).slice(0, 20);
  console.log(confirmed);
  const date = barChatData.map((x) => x.date).slice(0, 20);

  confirmedLabel = confirmed;
  dateLabel = date;
  console.log(dateLabel);
}
