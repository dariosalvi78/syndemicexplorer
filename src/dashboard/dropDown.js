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
  dropdown4.classList.toggle('is-active');
  fillDropDown4();
});

const dropDownContent1 = document.querySelector('.dropContent1');
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
        dropDownContent1.appendChild(level1);
      });
    });
}

const dropDownContent2 = document.querySelector('.dropContent2');
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
        const newLine = document.createElement('br');
        level2.innerHTML = myJson.area1_name;
        dropDownContent2.appendChild(level2);
        dropDownContent2.appendChild(newLine);
      });
    });
}

const dropDownContent3 = document.querySelector('.dropContent3');
const urlLevel3 =
  'http://localhost:5000/api/v1/maps/admareas2?area1Code=SWE.13_1';
function fillDropDown3() {
  fetch(urlLevel3)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      myJson.forEach(function (myJson) {
        const level3 = document.createElement('a');
        const newLine = document.createElement('br');
        level3.innerHTML = myJson.area2_name;
        dropDownContent3.appendChild(level3);
        dropDownContent3.appendChild(newLine);
      });
    });
}

const dropDownContent4 = document.querySelector('.dropContent4');
const urlLevel4 =
  'http://localhost:5000/api/v1/maps/admareas3?area2Code=SWE.13.19_1';

function fillDropDown4() {
  fetch(urlLevel4)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      myJson.forEach(function (myJson) {
        const level4 = document.createElement('a');
        const newLine = document.createElement('br');
        level4.innerHTML = myJson.area3_name;
        dropDownContent4.appendChild(level4);
        dropDownContent4.appendChild(newLine);
      });
    });
}
