'use strict';
const dropdown1 = document.getElementById('level1');
const buttonLevel1 = document.getElementById('level1Text');
const buttonLevel2 = document.getElementById('level2Text');

dropdown1.addEventListener('click', function () {
  dropDownContent1.innerHTML = '';
  fillDropDown1();
  dropdown1.classList.toggle('is-active');
});

const dropdown1Sweden = document.getElementById('sweden');
dropdown1Sweden.addEventListener('click', function (event) {
  swedenLocation();
  buttonLevel1.innerText = 'Sweden';
});

const dropdown2 = document.getElementById('level2');
dropdown2.addEventListener('click', function (event) {
  dropdown2.classList.toggle('is-active');
});

const dropDown2Skåne = document.getElementById('skåne');
dropDown2Skåne.addEventListener('click', function (event) {
  stockholmLocation();
  buttonLevel2.innerText = 'Skåne';
});

const dropdown3 = document.getElementById('level3');
dropdown3.addEventListener('click', function (event) {
  dropdown3.classList.toggle('is-active');
});
const dropdown4 = document.getElementById('level4');
dropdown4.addEventListener('click', function (event) {
  dropdown4.classList.toggle('is-active');
});

const dropDownContent1 = document.querySelector('.dropContent1');
const urlCountry = 'http://localhost:5000/api/v1/maps/countrynames';
function fillDropDown1() {
  fetch(urlCountry)
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
