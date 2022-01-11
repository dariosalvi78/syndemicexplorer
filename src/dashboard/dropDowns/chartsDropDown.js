//Dropdown for epidemiology chart
const epidemDataText = document.getElementById('stats1');
const dropdownEpidem = document.getElementById('statisticEpidem');
dropdownEpidem.addEventListener('click', function (event) {
  dropdownEpidem.classList.toggle('is-active');
});
//Options

const confirmedOption = document.getElementById('confirmedOption');
confirmedOption.addEventListener('click', function () {
  if (state.area1_code) {
    confirmedCasesChart('admareas1?area1Code=' + state.area1_code);
  }
  if (state.area2_code) {
    confirmedCasesChart('admareas2?area2Code=' + state.area2_code);
  }
  if (state.area3_code) {
    confirmedCasesChart('admareas3?area3Code=' + state.area3_code);
  }

  epidemDataText.innerHTML = 'Confirmed cases';
});
//Not implemented yet with cumulative data
const deathsOption = document.getElementById('deathsOption');
deathsOption.addEventListener('click', function () {
  if (state.area1_code) {
    deathsConfirmedChart('admareas1?area1Code=' + state.area1_code);
  }
  if (state.area2_code) {
    deathsConfirmedChart('admareas2?area2Code=' + state.area2_code);
  }
  if (state.area3_code) {
    deathsConfirmedChart('admareas3?area3Code=' + state.area3_code);
  }
  epidemDataText.innerHTML = 'Deaths';
});

//Dropdown for socioeconomic chart

const socioDropText = document.getElementById('socioText');
const dropDownSocio = document.getElementById('socioEconomDrop');
dropDownSocio.addEventListener('click', function (event) {
  dropDownSocio.classList.toggle('is-active');
});

//Options

const populationOption = document.getElementById('populationOption');
populationOption.addEventListener('click', function () {
  if (secondChart) {
    populationSocioChart('population?area3Code=' + state.area3_code);
    comparePopulationSocioChart(
      'population?area3Code=' + secondChartData.area3_code
    );
  } else {
    populationSocioChart('population?area3Code=' + state.area3_code);
  }

  socioDropText.innerHTML = 'Population';
});

const foreignBackgroundOption = document.getElementById('foreignOptions');
foreignBackgroundOption.addEventListener('click', function () {
  if (secondChart) {
    foreignBackgroundSocioChart(
      'foreignbackground?area3Code=' + state.area3_code
    );
    compareForeignBackgroundChart(
      'foreignbackground?area3Code=' + secondChartData.area3_code
    );
  } else {
    foreignBackgroundSocioChart(
      'foreignbackground?area3Code=' + state.area3_code
    );
  }
  socioDropText.innerHTML = 'Foreign Background';
});

const educationalOption = document.getElementById('educationalOption');
educationalOption.addEventListener('click', function () {
  if (secondChart) {
    educationalLevelSocioChart(
      'educationallevel?area3Code=' + state.area3_code
    );
    compareEducationalLevelChart(
      'educationallevel?area3Code=' + secondChartData.area3_code
    );
  } else {
    educationalLevelSocioChart(
      'educationallevel?area3Code=' + state.area3_code
    );
  }

  socioDropText.innerHTML = 'Educational Level';
});

const incomeOption = document.getElementById('incomeOptions');
incomeOption.addEventListener('click', function () {
  socioDropText.innerHTML = 'Disposable Income';
  if (secondChart) {
    disposableIncomeSocioChart(
      'disposableincome?area3Code=' + state.area3_code
    );
    compareDisposableIncomeChart(
      'disposableincome?area3Code=' + secondChartData.area3_code
    );
  } else {
    disposableIncomeSocioChart(
      'disposableincome?area3Code=' + state.area3_code
    );
  }
});

//Change year for socio indicator for Population stats

const dropSocioYearContent = document.querySelector('.dropSocioYearContent');
const dropSocioYearText = document.getElementById('socioYearText');
const dropSocioYear = document.getElementById('dropSocioYear');
dropSocioYear.addEventListener('click', function () {
  dropSocioYear.classList.toggle('is-active');
});

const optionYear2020 = document.getElementById('option2020');
optionYear2020.addEventListener('click', function () {
  populationSocioChart(
    'population?area3Code=' + state.area3_code + '&year=2020'
  );
});
const optionYear2021 = document.getElementById('option2021');
optionYear2021.addEventListener('click', function () {
  addSocioChart();
  populationSocioChart(
    'population?area3Code=' + state.area3_code + '&year=2021'
  );
  dropSocioYear.classList.toggle('is-visible');
});

//Change the confirmed cases to a span of two dates
let startDate = {};
let endDate = {};
const getValuesFromDates = () => {
  startDate = document.getElementById('startDate').value;
  endDate = document.getElementById('endDate').value;
};

const dateButton = document.getElementById('dateButton');
dateButton.addEventListener('click', function () {
  getValuesFromDates();
  if (secondChart) {
    confirmedCasesChart(
      'admareas3?area3Code=' +
        state.area3_code +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
    compareDataConfirmedChart(
      'admareas3?area3Code=' +
        secondChartData.area3_code +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
  } else {
    confirmedCasesChart(
      'admareas3?area3Code=' +
        state.area3_code +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
  }
});

//Change the heatmap data to the selected date in the datepicker
const changeHeatmapWithDate = () => {
  heatmapDate = document.getElementById('heatmapDate').value;
};
const heatmapDatePicker = document.getElementById('heatmapDate');
heatmapDatePicker.addEventListener('change', () => {
  changeHeatmapWithDate();
  console.log(heatmapDate);
  console.log(state);
  if (state.area2_code) {
    showHeatMapForSelectedLevel(
      `level=3&countryCode=SWE&date=${heatmapDate}&indicator=confirmed&area2Code=` +
        state.area2_code
    );
  }

  if (state.area3_code) {
    showHeatMapForSelectedLevel(
      `level=3&countryCode=SWE&date=${heatmapDate}&indicator=confirmed&area2Code=SWE.13.19_1`
    );
  }

  if (state.area1_code) {
    showHeatMapForSelectedLevel(
      `level=2&countryCode=SWE&date=${heatmapDate}&indicator=confirmed&area1Code=` +
        state.area1_code
    );
  }
  if (state.country_name) {
    showHeatMapForSelectedLevel(
      `level=2&countryCode=SWE&date=${heatmapDate}&indicator=confirmed`
    );
  }
});

//The optional second socioeconomic chart

const socioDropText2 = document.getElementById('socioText2');

const extraSocioEconomicGraph = document.getElementById('extraSocioGraphBtn');
extraSocioEconomicGraph.addEventListener('click', function () {
  deleteAndAddSecondSocioChart();
  createSecondSocioChart();

  extraSocioEconomicGraph.classList.add('is-hidden');
  dropSocioEconom2.classList.remove('is-hidden');
});
const dropSocioEconom2 = document.getElementById('socioEconomDrop2');
dropSocioEconom2.addEventListener('click', function (event) {
  dropSocioEconom2.classList.toggle('is-active');
});

const populationOption2 = document.getElementById('populationOption2');
populationOption2.addEventListener('click', function () {
  if (secondChart) {
    populationSocioChart2('population?area3Code=' + state.area3_code);
    comparePopulationSocioChart2(
      'population?area3Code=' + secondChartData.area3_code
    );
  } else {
    populationSocioChart2('population?area3Code=' + state.area3_code);
  }

  socioDropText2.innerHTML = 'Population';
});

const foreignBackgroundOption2 = document.getElementById('foreignOption2');
foreignBackgroundOption2.addEventListener('click', function () {
  if (secondChart) {
    foreignBackgroundSocioChart2(
      'foreignbackground?area3Code=' + state.area3_code
    );
    compareForeignBackgroundChart2(
      'foreignbackground?area3Code=' + secondChartData.area3_code
    );
  } else {
    foreignBackgroundSocioChart2(
      'foreignbackground?area3Code=' + state.area3_code
    );
  }

  socioDropText2.innerHTML = 'Foreign Background';
});

const educationalOption2 = document.getElementById('educationalOption2');
educationalOption2.addEventListener('click', function () {
  if (secondChart) {
    educationalLevelSocioChart2(
      'educationallevel?area3Code=' + state.area3_code
    );
    compareEducationalLevelChart2(
      'educationallevel?area3Code=' + secondChartData.area3_code
    );
  } else {
    educationalLevelSocioChart2(
      'educationallevel?area3Code=' + state.area3_code
    );
  }

  socioDropText2.innerHTML = 'Educational Level';
});

const incomeOption2 = document.getElementById('incomeOption2');
incomeOption2.addEventListener('click', function () {
  socioDropText2.innerHTML = 'Disposable Income';
  if (secondChart) {
    disposableIncomeSocioChart2(
      'disposableincome?area3Code=' + state.area3_code
    );
    compareDisposableIncomeChart2(
      'disposableincome?area3Code=' + secondChartData.area3_code
    );
  } else {
    disposableIncomeSocioChart2(
      'disposableincome?area3Code=' + state.area3_code
    );
  }
});
