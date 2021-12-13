'use strict';
const dropdown1 = document.getElementById('level1');

let state = {};
let startDate = {};
let endDate = {};
let heatmapDate = {};
let borderSelectedRegion = [];
let borderSelectedMunicipality = [];
let borderSelectedDistrict = [];
let borderSecondSelectedDistrict = [];
let borderArray = [];
let secondBorderArray = [];

dropdown1.addEventListener('click', function () {
  dropDownContent1.innerHTML = '';
  fillDropDown1();
  dropdown1.classList.toggle('is-active');
});

const dropdown2 = document.getElementById('level2');
dropdown2.addEventListener('click', function (event) {
  dropDownContent2.innerHTML = '';
  dropdown2.classList.toggle('is-active');
  fillDropDown2();
});

const dropdown3 = document.getElementById('level3');
dropdown3.addEventListener('click', function (event) {
  dropDownContent3.innerHTML = '';
  dropdown3.classList.toggle('is-active');
  fillDropDown3();
});

const dropdown4 = document.getElementById('level4');
dropdown4.addEventListener('click', function (event) {
  dropDownContent4.innerHTML = '';
  fillDropDown4();
  dropdown4.classList.toggle('is-active');
});

const dropDownContent1 = document.querySelector('.dropContent1');
const level1Text = document.getElementById('level1Text');
const urlLevel1 = 'http://localhost:5000/api/v1/maps/countrynames';

async function fillDropDown1() {
  await fetch(urlLevel1)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      myJson.forEach(function (myJson) {
        const level1 = document.createElement('a');
        level1.innerHTML = myJson.country_name;
        level1.setAttribute('class', 'dropdown-item');
        dropDownContent1.appendChild(level1);
        level1.addEventListener('click', function () {
          level1Text.innerHTML = myJson.country_name;

          state = myJson.country_code;

          console.log(heatmapDate);
          deleteAndAddEpidemChart();
          deleteAndAddSocioChart();
          if (myJson.country_name === 'Sweden') {
            level2Text.innerHTML = 'Region';
            level3Text.innerHTML = 'Municipality';
            level4Text.innerHTML = 'District';
          }

          const boundingBox = new mapboxgl.LngLatBounds(
            [11.0273686052, 55.3617373725],
            [23.9033785336, 69.1062472602]
          );
          map.fitBounds(boundingBox);
        });
      });
    });
}

const dropDownContent2 = document.querySelector('.dropContent2');
const level2Text = document.getElementById('level2Text');

async function fillDropDown2() {
  await fetch(
    `http://localhost:5000/api/v1/maps/admareas1?countryCode=${state}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      myJson.forEach(function (myJson) {
        const level2 = document.createElement('a');
        level2.addEventListener('click', function () {
          borderArray = [];
          borderSelectedDistrict = [];
          borderSelectedMunicipality = [];
          randomColor();

          borderSelectedRegion = myJson.coordinates;
          console.log(myJson);
          level2Text.innerHTML = myJson.area1_name;
          epidemDataText.innerHTML = 'Confirmed cases';

          borderSelectedRegion.forEach((i) => {
            i.forEach((j) => {
              j.forEach((k, index) => {
                if (index % 4 == 0) {
                  borderArray.push(k);
                }
              });
            });
          });

          borderAroundSelectedArea();

          state = myJson.area1_code;

          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );

          showHeatMapForSelectedLevel(
            'level=2&countryCode=SWE&date=2021-11-22&indicator=confirmed&area1Code=' +
              myJson.area1_code
          );

          dropdownEpidem.classList.remove('is-hidden');
          deleteAndAddEpidemChart();
          createEpidemChart();

          confirmedCasesChart('admareas1?area1Code=' + myJson.area1_code);
        });
        const newLine = document.createElement('br');
        level2.innerHTML = myJson.area1_name;
        level2.setAttribute('class', 'dropdown-item');
        dropDownContent2.appendChild(level2);
        dropDownContent2.appendChild(newLine);
      });
    });
}

const dropDownContent3 = document.querySelector('.dropContent3');
const level3Text = document.getElementById('level3Text');
const urlLevel3 = `http://localhost:5000/api/v1/maps/admareas2?area1Code=${state}`;
function fillDropDown3() {
  fetch(`http://localhost:5000/api/v1/maps/admareas2?area1Code=${state}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const level3 = document.createElement('a');
        level3.addEventListener('click', function () {
          map.removeLayer('inline');
          randomColor();
          borderArray = [];
          borderSelectedRegion = [];
          level3Text.innerHTML = myJson.area2_name;
          epidemDataText.innerHTML = 'Confirmed cases';
          borderSelectedMunicipality = myJson.coordinates;
          state = myJson;
          console.log(myJson);
          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );

          borderSelectedMunicipality.forEach((i) => {
            i.forEach((j) => {
              j.forEach((k, index) => {
                borderArray.push(k);
              });
            });
          });

          borderAroundSelectedArea();
          showHeatMapForSelectedLevel(
            'level=3&countryCode=SWE&date=2021-11-22&indicator=confirmed&area2Code=' +
              myJson.area2_code
          );

          startDateLabel.classList.remove('is-hidden');
          endDateLabel.classList.remove('is-hidden');
          startDateInput.classList.remove('is-hidden');
          endDateInput.classList.remove('is-hidden');
          dateButton.classList.remove('is-hidden');
          dropCompareWith.classList.remove('is-hidden');
          deleteAndAddEpidemChart();
          deleteAndAddSocioChart();
          createEpidemChart();
          compareWithDropContent.innerHTML = '';
          fillCompareWith('admareas2?area1Code=SWE.13_1');
          confirmedCasesChart('admareas2?area2Code=' + myJson.area2_code);
          populationSocioChart('population?area3Code=' + myJson.area2_code);
        });
        const newLine = document.createElement('br');
        level3.innerHTML = myJson.area2_name;
        level3.setAttribute('class', 'dropdown-item');
        dropDownContent3.appendChild(level3);
        dropDownContent3.appendChild(newLine);
      });
    });
}

const dropDownContent4 = document.querySelector('.dropContent4');
const level4Text = document.getElementById('level4Text');
const urlLevel4 = `http://localhost:5000/api/v1/maps/admareas3?area2Code=SWE.13.19_1${state}`;

async function fillDropDown4() {
  await fetch(
    `http://localhost:5000/api/v1/maps/admareas3?area2Code=${state.area2_code}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const level4 = document.createElement('a');
        level4.addEventListener('click', function () {
          map.removeLayer('secondFill');
          map.removeLayer('inline');
          borderSelectedMunicipality = [];
          borderArray = [];
          borderSelectedDistrict = myJson.coordinates;
          level4Text.innerHTML = myJson.area3_name;
          epidemDataText.innerHTML = 'Confirmed cases';
          socioDropText.innerHTML = 'Population';
          state = myJson;
          console.log(state);
          console.log(myJson);

          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );

          randomColor();

          borderSelectedDistrict.forEach((i) => {
            i.forEach((j) => {
              borderArray.push(j);
            });
          });
          console.log(borderArray);

          borderAroundSelectedArea();

          deleteAndAddEpidemChart();
          deleteAndAddSocioChart();
          createEpidemChart();
          createSocioChart();
          compareWithDropContent.innerHTML = '';
          fillCompareWith('admareas3?area2Code=SWE.13.19_1');

          confirmedCasesChart('admareas3?area3Code=' + myJson.area3_code);

          populationSocioChart('population?area3Code=' + myJson.area3_code);
          dropCompareWith.classList.remove('is-hidden');
          dropSocioYear.classList.remove('is-hidden');
          socioEconomDrop.classList.remove('is-hidden');
          extraSocioEconomicGraph.classList.remove('is-hidden');
        });
        level4.setAttribute('class', 'dropdown-item');
        const newLine = document.createElement('br');
        level4.innerHTML = myJson.area3_name;
        dropDownContent4.appendChild(level4);
        dropDownContent4.appendChild(newLine);
      });
    });
}

async function fillCompareWith(param) {
  const compareUrl = `http://localhost:5000/api/v1/maps/${param}`;
  console.log(compareUrl);
  await fetch(compareUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const compareData = document.createElement('a');
        compareData.addEventListener('click', function () {
          compareRandomColor();
          console.log(myJson);

          if (chart.data.datasets.length === 2) {
            chart.data.datasets.pop();
          }
          if (chartSocio.data.datasets.length === 2) {
            chartSocio.data.datasets.pop();
          }

          if (myJson.bounding_box[0] > state.bounding_box[0]) {
            setBoundingBox(
              [myJson.bounding_box[2], myJson.bounding_box[3]],
              [state.bounding_box[0], state.bounding_box[1]]
            );
          }
          if (myJson.bounding_box[0] < state.bounding_box[0]) {
            setBoundingBox(
              [myJson.bounding_box[0], myJson.bounding_box[1]],
              [state.bounding_box[2], state.bounding_box[3]]
            );
          }

          borderSecondSelectedDistrict = myJson.coordinates;

          secondBorderArray = [];
          borderSecondSelectedDistrict.forEach((i) => {
            i.forEach((j) => {
              secondBorderArray.push(j);
            });
          });

          borderAroundSecondArea();

          if (myJson.area2_code) {
            compareDataConfirmedChart(
              'admareas2?area2Code=' + myJson.area2_code
            );
          }
          if (myJson.area3_code) {
            // Check so we actually go in to this IF statement.
            if (!Object.keys(endDate) === 0) {
              compareDataConfirmedChart(
                'admareas3?area3Code=' +
                  myJson.area3_code +
                  '&startDate=' +
                  startDate +
                  '&endDate=' +
                  endDate
              );
            }
            compareDataConfirmedChart(
              'admareas3?area3Code=' + myJson.area3_code
            );
            if (socioDropText.innerHTML == 'Foreign Background') {
              compareForeignBackgroundChart(
                'foreignbackground?area3Code=' + myJson.area3_code
              );
            }
            if (socioDropText.innerHTML == 'Population') {
              comparePopulationSocioChart(
                'population?area3Code=' + myJson.area3_code
              );
            }
            if (socioDropText.innerText == 'Educational Level') {
              compareEducationalLevelChart(
                'educationallevel?area3Code=' + myJson.area3_code
              );
            }
            if (socioDropText.innerText == 'Disposable Income') {
              compareDisposableIncomeChart(
                'disposableincome?area3Code=' + myJson.area3_code
              );
            }
          }
        });
        compareData.setAttribute('class', 'dropdown-item');
        const newLine = document.createElement('br');
        if (myJson.area2_code) {
          compareData.innerHTML = myJson.area2_name;
        }
        if (myJson.area3_code) {
          compareData.innerHTML = myJson.area3_name;
        }

        compareWithDropContent.appendChild(compareData);
        compareWithDropContent.appendChild(newLine);
      });
    });
}
const compareWithDropContent = document.querySelector(
  '.compareWithDropContent'
);
const dropCompareWithText = document.getElementById('dropCompareWithText');
const dropCompareWith = document.getElementById('compareWithDropdown');

dropCompareWith.addEventListener('click', function () {
  dropCompareWith.classList.toggle('is-active');
});

const epidemDataText = document.getElementById('stats1');
const dropdownEpidem = document.getElementById('statisticEpidem');
dropdownEpidem.addEventListener('click', function (event) {
  dropdownEpidem.classList.toggle('is-active');
});

const socioDropText = document.getElementById('socioText');
const dropDownSocio = document.getElementById('socioEconomDrop');
dropDownSocio.addEventListener('click', function (event) {
  dropDownSocio.classList.toggle('is-active');
});

const populationOption = document.getElementById('populationOption');
populationOption.addEventListener('click', function () {
  populationSocioChart('population?area3Code=' + state.area3_code);

  socioDropText.innerHTML = 'Population';
});

const foreignBackgroundOption = document.getElementById('foreignOptions');
foreignBackgroundOption.addEventListener('click', function () {
  foreignBackgroundSocioChart(
    'foreignbackground?area3Code=' + state.area3_code
  );
  socioDropText.innerHTML = 'Foreign Background';
});

const educationalOption = document.getElementById('educationalOption');
educationalOption.addEventListener('click', function () {
  educationalLevelSocioChart('educationallevel?area3Code=' + state.area3_code);

  socioDropText.innerHTML = 'Educational Level';
});

const incomeOption = document.getElementById('incomeOptions');
incomeOption.addEventListener('click', function () {
  socioDropText.innerHTML = 'Disposable Income';
  disposableIncomeSocioChart('disposableincome?area3Code=' + state.area3_code);
});

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
  deleteAndAddSocioChart();
  populationSocioChart(
    'population?area3Code=' + state.area3_code + '&year=2021'
  );
  dropSocioYear.classList.toggle('is-visible');
});

const dateButton = document.getElementById('dateButton');
dateButton.addEventListener('click', function () {
  console.log('CLICKED');
  console.log(state);
  getValuesFromDates();
  if (state.area3_code) {
    confirmedCasesChart(
      'admareas3?area3Code=' +
        state.area3_code +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
  } else if (state.area2_code) {
    confirmedCasesChart(
      'admareas2?area2Code=' +
        state.area2_code +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
  }

  console.log(startDate);
  console.log(endDate);
});
const heatmapDatePicker = document.getElementById('heatmapDate');
heatmapDatePicker.addEventListener('change', () => {
  changeHeatmapWithDate();
  console.log(heatmapDate);

  showHeatMapForSelectedLevel(
    `level=2&countryCode=SWE&date=${heatmapDate}&indicator=confirmed&area1Code=` +
      state
  );
});

const getValuesFromDates = () => {
  startDate = document.getElementById('startDate').value;
  endDate = document.getElementById('endDate').value;
};

const changeHeatmapWithDate = () => {
  heatmapDate = document.getElementById('heatmapDate').value;
};
heatmapDate = document.getElementById('heatmapDate').value;

const startDateLabel = document.getElementById('startDateLabel');
const endDateLabel = document.getElementById('endDateLabel');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

const socioEconomDrop = document.getElementById('socioEconomDrop');

const mapContainer = document.getElementById('map');
const mapColumn = document.getElementById('mapColumn');
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
  populationSocioChart2('population?area3Code=' + state.area3_code);

  socioDropText2.innerHTML = 'Population';
});

const foreignBackgroundOption2 = document.getElementById('foreignOption2');
foreignBackgroundOption2.addEventListener('click', function () {
  foreignBackgroundSocioChart2(
    'foreignbackground?area3Code=' + state.area3_code
  );
  socioDropText2.innerHTML = 'Foreign Background';
});

const educationalOption2 = document.getElementById('educationalOption2');
educationalOption2.addEventListener('click', function () {
  educationalLevelSocioChart2('educationallevel?area3Code=' + state.area3_code);

  socioDropText2.innerHTML = 'Educational Level';
});

const incomeOption2 = document.getElementById('incomeOption2');
incomeOption2.addEventListener('click', function () {
  socioDropText2.innerHTML = 'Disposable Income';
  disposableIncomeSocioChart2('disposableincome?area3Code=' + state.area3_code);
});

// $(function () {
//   $('#slider-range').slider({
//     min: new Date('2010.01.01').getTime() / 1000,
//     max: new Date('2014.01.01').getTime() / 1000,
//     step: 86400,
//     values: new Date('2013.02.01').getTime() / 1000,

//     slide: function (event, ui) {
//       $('#amount').val(new Date(ui.values[0] * 1000).toDateString());
//     },
//   });
//   $('#amount').val(
//     new Date($('#slider-range').slider('values', 0) * 1000).toDateString()
//   );
// });
