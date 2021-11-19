'use strict';
const dropdown1 = document.getElementById('level1');
const buttonLevel1 = document.getElementById('level1Text');
const buttonLevel2 = document.getElementById('level2Text');

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

function fillDropDown1() {
  fetch(urlLevel1)
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
          console.log(myJson);
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
const urlLevel2 = 'http://localhost:5000/api/v1/maps/admareas1?countryCode=SWE';

function fillDropDown2() {
  fetch(urlLevel2)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      myJson.forEach(function (myJson) {
        const level2 = document.createElement('a');
        level2.addEventListener('click', function () {
          level2Text.innerHTML = myJson.area1_name;
          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );
          deleteAndAddEpidemChart();
          deleteAndAddSocioChart();
          confirmedCasesChart('admareas1?area1Code=' + myJson.area1_code);
          populationSocioChart('population?area3Code=' + myJson.area1_code);
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
const urlLevel3 =
  'http://localhost:5000/api/v1/maps/admareas2?area1Code=SWE.13_1';
function fillDropDown3() {
  fetch(urlLevel3)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const level3 = document.createElement('a');
        level3.addEventListener('click', function () {
          level3Text.innerHTML = myJson.area2_name;
          console.log(myJson);
          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );

          deleteAndAddEpidemChart();
          deleteAndAddSocioChart();
          compareWith.classList.toggle('is-active');
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
const urlLevel4 =
  'http://localhost:5000/api/v1/maps/admareas3?area2Code=SWE.13.19_1';

function fillDropDown4() {
  fetch(urlLevel4)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const level4 = document.createElement('a');
        level4.addEventListener('click', function () {
          level4Text.innerHTML = myJson.area3_name;
          console.log(myJson);
          setBoundingBox(
            [myJson.bounding_box[0], myJson.bounding_box[1]],
            [myJson.bounding_box[2], myJson.bounding_box[3]]
          );

          deleteAndAddEpidemChart();
          deleteAndAddSocioChart();
          if (!compareWith.classList.toggle('is-active')) {
            compareWithDropContent.innerHTML = '';
            compareWith.classList.toggle('is-active');
          }

          fillCompareWith('admareas3?area2Code=SWE.13.19_1');

          confirmedCasesChart('admareas3?area3Code=' + myJson.area3_code);
          populationSocioChart('population?area3Code=' + myJson.area3_code);
        });
        level4.setAttribute('class', 'dropdown-item');
        const newLine = document.createElement('br');
        level4.innerHTML = myJson.area3_name;
        dropDownContent4.appendChild(level4);
        dropDownContent4.appendChild(newLine);
      });
    });
}

function fillCompareWith(param) {
  const compareUrl = `http://localhost:5000/api/v1/maps/${param}`;
  fetch(compareUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      myJson.forEach(function (myJson) {
        const compareData = document.createElement('a');
        compareData.addEventListener('click', function () {
          console.log(myJson);
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
const compareWithText = document.getElementById('compareWithText');
const compareWith = document.getElementById('compareWithDropdown');
//FUNKAR INTE RIKTIGT -- behöver tweeka det lite
compareWith.addEventListener('click', function () {
  compareWithDropContent.innerHTML = '';
  compareWith.classList.toggle('is-active');
});
