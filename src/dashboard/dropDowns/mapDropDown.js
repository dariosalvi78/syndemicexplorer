let state = {};
let heatmapDate = {};
let borderSelectedRegion = [];
let borderSelectedMunicipality = [];
let borderSelectedDistrict = [];
let borderSecondSelectedDistrict = [];
let borderArray = [];
let secondBorderArray = [];
let secondChartData = {};
const chart1 = document.getElementById('myChart');
const chartColumn = document.getElementById('chartColumn');

const startDateLabel = document.getElementById('startDateLabel');
const endDateLabel = document.getElementById('endDateLabel');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

const socioEconomDrop = document.getElementById('socioEconomDrop');

const mapContainer = document.getElementById('map');

const dropdown1 = document.getElementById('level1');
dropdown1.addEventListener('click', function () {
  dropDownContent1.innerHTML = '';
  fillDropDown1();
  dropdown1.classList.toggle('is-active');
});

const dropDownContent1 = document.querySelector('.dropContent1');
const level1Text = document.getElementById('level1Text');
const urlLevel1 = 'http://localhost:5000/api/v1/maps/countrynames';
//Fills the level 1 dropdown with data
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
        //Actionlistener for each element in the data, adjusts the map to selected area
        level1.addEventListener('click', function () {
          level1Text.innerHTML = myJson.country_name;

          state = myJson.country_code;

          deleteEpidemChart();
          deleteSocioChart();
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

const dropdown2 = document.getElementById('level2');
dropdown2.addEventListener('click', function (event) {
  dropDownContent2.innerHTML = '';
  dropdown2.classList.toggle('is-active');
  fillDropDown2();
});

const dropDownContent2 = document.querySelector('.dropContent2');
const level2Text = document.getElementById('level2Text');
//Fills the level 2 with data
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
        //Actionlistener for each element in the data, adjusts the map to selected area and creates a chart for selected area
        level2.addEventListener('click', async function () {
          borderArray = [];
          borderSelectedDistrict = [];
          borderSelectedMunicipality = [];
          randomColor();
          chartColumn.classList.remove('is-hidden');

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

          state = myJson;

          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );
          mapContainer.style.width = '99%';

          showHeatMapForSelectedLevel(
            'level=2&countryCode=SWE&date=2021-11-22&indicator=confirmed&area1Code=' +
              myJson.area1_code
          );

          dropdownEpidem.classList.remove('is-hidden');
          addAndDeleteEpidemChart();
          chart1.classList.remove('is-hidden');

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

const dropdown3 = document.getElementById('level3');
dropdown3.addEventListener('click', function (event) {
  dropDownContent3.innerHTML = '';
  dropdown3.classList.toggle('is-active');
  fillDropDown3();
});

const dropDownContent3 = document.querySelector('.dropContent3');
const level3Text = document.getElementById('level3Text');

function fillDropDown3() {
  fetch(
    `http://localhost:5000/api/v1/maps/admareas2?area1Code=${state.area1_code}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const level3 = document.createElement('a');
        //Actionlistener for each element in the data, adjusts the map to selected area and creates a epidemiology chart for selected area
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
          addAndDeleteEpidemChart();

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

const dropdown4 = document.getElementById('level4');
dropdown4.addEventListener('click', function (event) {
  dropDownContent4.innerHTML = '';
  fillDropDown4();
  dropdown4.classList.toggle('is-active');
});

const dropDownContent4 = document.querySelector('.dropContent4');
const level4Text = document.getElementById('level4Text');

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
        //Actionlistener for each element in the data, adjusts the map to selected area and creates a socioeconomic and epidemiology chart for selected area
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

          addAndDeleteEpidemChart();
          addSocioChart();
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

const compareWithDropContent = document.querySelector(
  '.compareWithDropContent'
);
const dropCompareWithText = document.getElementById('dropCompareWithText');
const dropCompareWith = document.getElementById('compareWithDropdown');

dropCompareWith.addEventListener('click', function () {
  dropCompareWith.classList.toggle('is-active');
});

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
          map.removeLayer('secondFill');
          console.log(myJson);
          secondChart = true;
          secondChartData = myJson;

          if (chart.data.datasets.length === 2) {
            chart.data.datasets.pop();
          }
          if (chartSocio.data.datasets.length === 2) {
            chartSocio.data.datasets.pop();
          }
          if (chartSocio2) {
            if (chartSocio2.data.datasets.length === 2) {
              chartSocio2.data.datasets.pop();
            }
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
          compareRandomColor();
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

            //Second Socioeconomic graph

            if (socioDropText2.innerHTML == 'Foreign Background') {
              compareForeignBackgroundChart2(
                'foreignbackground?area3Code=' + myJson.area3_code
              );
            }
            if (socioDropText2.innerHTML == 'Population') {
              comparePopulationSocioChart2(
                'population?area3Code=' + myJson.area3_code
              );
            }
            if (socioDropText2.innerText == 'Educational Level') {
              compareEducationalLevelChart2(
                'educationallevel?area3Code=' + myJson.area3_code
              );
            }
            if (socioDropText2.innerText == 'Disposable Income') {
              compareDisposableIncomeChart2(
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
