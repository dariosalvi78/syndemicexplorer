// this function takes the data from this page: https://experience.arcgis.com/experience/a6d20c1544f34d33b60026f45b786230
// and adds it to the database
// data come on a weekly basis, so, when updating it, insert them on Sunday of that week

// for each area you find:
// KnNamn: kommun name, adm_area_2
// Stadsdel: stadsdel (when present) is adm_area_3
// inc: new cases per 100k inhabitants
// fall: new cases of that week
// cuminc: cumulative cases per 100k inhabitants
// cumfreq: cumulative cases <-- this one goes into epidemiology as "confirmed"

// you get the data from the API
// for each data point, you query the DB to see if there is an adm_area with that name and get the GID, and all codes and names of areas above that
// if there is NOT -> print it because it may have a slightly different name! (so we can fix it later in code)
// once you have the codes for all the areas you need, you insert the data

// give that the statistics are provided per week, you need to find the sunday of that week and use that as the date

// we know that we have stads del (adm_area_3) statistics only for Malmö, Göteborg and Stockholm
// for those, we can sum up all the cases for each stadsdel and also add the overall statistics for adm_area_2
import axios from 'axios'
import {
  Pool,
  upsertTimeseries
} from '../db.js'
import csv from '../../csv files/read_csv_files.js'

let millisecondsPerDay = 24 * 60 * 60 * 1000;

//from https://stackoverflow.com/questions/7580824/how-to-convert-a-week-number-to-a-date-in-javascript
function firstDayOfWeek(week, year) {
  var date = firstWeekOfYear(year),
    weekTime = weeksToMilliseconds(week),
    targetTime = date.getTime() + weekTime;

  date.setTime(targetTime);
  date = date.toISOString();
  date = date.substring(0, date.indexOf('T'));

  return date;
}

function weeksToMilliseconds(weeks) {
  return millisecondsPerDay * 7 * (weeks - 1) + millisecondsPerDay;
}

function firstWeekOfYear(year) {
  var date = new Date(year, 0, 1, 0, 0, 0, 0); //First week of the year
  date = firstWeekday(date);
  return date;
}

/**
 * Sets the given date as the first day of week of the first week of year.
 */
function firstWeekday(firstOfJanuaryDate) {
  // 0 correspond au dimanche et 6 correspond au samedi.
  var FIRST_DAY_OF_WEEK = 1; // Monday, according to iso8601
  var WEEK_LENGTH = 7; // 7 days per week
  var day = firstOfJanuaryDate.getDay();
  day = (day === 0) ? 7 : day; // make the days monday-sunday equals to 1-7 instead of 0-6
  var dayOffset = -day + FIRST_DAY_OF_WEEK; // dayOffset will correct the date in order to get a Monday
  if (WEEK_LENGTH - day + 1 < 4) {
    // the current week has not the minimum 4 days required by iso 8601 => add one week
    dayOffset += WEEK_LENGTH;
  }
  return new Date(firstOfJanuaryDate.getTime() + dayOffset * millisecondsPerDay);
}

function currentOrLastWeek() {
  //define a date object variable that will take the current system date  
  let todaydate = new Date();

  //find the year of the current date  
  var oneJan = new Date(todaydate.getFullYear(), 0, 1);
  // calculating number of days in given year before a given date   
  var numberOfDays = Math.floor((todaydate - oneJan) / millisecondsPerDay);
  // adding 1 since to current date and returns value starting from 0   

  let currentWeek = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7) - 1;

  if (todaydate.getDay() != 0)
    currentWeek -= 1;

  return currentWeek;
}

export default function () {
  //https://sdb.socialstyrelsen.se/api/v1/sv/dodsorsaker/diagnos/text/Covid

  let currentYear = new Date().getFullYear();
  let startYear = 2020; //Grab data from 2020 til now

  var config = {
    method: 'get',
    url: "",
    headers: {
      'origin': 'https://fohm.maps.arcgis.com',
      'referer': 'https://fohm.maps.arcgis.com/apps/opsdashboard/index.html'
    }
  }

  for (let selectedYear = startYear; selectedYear <= currentYear; selectedYear++) {
    let thisWeekNbr = (selectedYear == currentYear) ? currentOrLastWeek() : 52;

    for (let selectedWeek = thisWeekNbr; selectedWeek > 0; selectedWeek--) {
      let weekStr = selectedWeek.toString();
      if (selectedWeek < 10)
        weekStr = 0 + weekStr;

      config.url = 'https://utility.arcgis.com/usrsvcs/servers/63de09e702d142eb9ddd865838f80bd5/rest/services/FOHM_Covid_19_kommun_FME_20201228/FeatureServer/0/query?f=json&where=veckonr_txt%3D%27' + selectedYear + '-' + weekStr + '%27&returnGeometry=false&outFields=*&outSR=4326&cacheHint=true';

      axios(config)
        .then(async function (response) {
          for (var i = 0; i < response.data.features.length; i++) {
            let featureAttribute = response.data.features[i].attributes;

            if (featureAttribute.KnNamn == "Upplands Väsby")
              featureAttribute.KnNamn = "Upplands-Väsby"; //# Fix naming difference between FHM and OxCOVID19 database

            let data = await getAdmArea(featureAttribute.KnNamn, featureAttribute.Stadsdel);

            if (data == undefined) //Happens if authentication fails or the table doesn't exist
              continue;

            data = data.rows[0];

            let veckoNr = featureAttribute.veckonr;

            if (data == undefined) {
              console.error("Data is null on: " + featureAttribute.KnNamn);
              continue;
            }

            let area2_code = data.area2_code; //municipality
            let area3_code = data.area3_code;
            let gid = (area3_code != null) ? area3_code : area2_code;
            let cumulative_cases = featureAttribute.cumfreq;

            let epidemiology_data = {
              table: "epidemiology",
              source: "Folkhälsomyndigheten",
              date: firstDayOfWeek(veckoNr, selectedYear),
              country_code: "SWE",
              area1_code: data.area1_code,
              area2_code: area2_code,
              area3_code: area3_code,
              gid: gid,
              confirmed: cumulative_cases
            }

            await upsertTimeseries(epidemiology_data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}

async function getAdmArea(kommunNamn, stadsdel) {
  if (!kommunNamn) {
    console.log("Missing kommunNamn!")
  } else {
    let query = "SELECT area1_code, area2_code, area3_code FROM admin_areas WHERE country_code = 'SWE' AND area2_name = $1"
    let parameters = [kommunNamn];

    if (stadsdel != null && stadsdel != undefined) {
      stadsdel = " " + stadsdel
      query += " AND area3_name = $2";
      parameters.push(stadsdel);
    }

    try {
      return await Pool.query(query, parameters);
    } catch (error) {
      console.log(error)
    }
  }
}

function readCSVFileWithUrl(url) {
  var config = {
      method: 'get',
      url: url
  }

  axios(config)
      .then(async function (response) {
          const data = response.data
          const dataArray = csv(data);

          for (let i = 0; i < dataArray.length; i++) {
            let KnNamn = dataArray[i][0].replace(/"/g, '')
            let deaths = dataArray[i][1]

            if (KnNamn !== "Upplands-Väsby" && KnNamn.includes("Upplands") && KnNamn.includes("Väsby"))
              KnNamn = "Upplands-Väsby"; //# Fix naming difference between FHM and OxCOVID19 database

            if (deaths == undefined || deaths.length == 1)
              return;

            deaths = Math.round(deaths); //Database takes integer not float

            let adm_area = await getAdmArea(KnNamn);

            if (adm_area == undefined) //Happens if authentication fails or the table doesn't exist
              continue;

            adm_area = adm_area.rows[0];

            if (adm_area == undefined) {
              console.error("Found no data with getAdmArea function in readCSVFileWithURL, input was: " + KnNamn);
              continue;
            }

            let area2_code = adm_area.area2_code; //municipality
            let area3_code = adm_area.area3_code;
            let gid = (area3_code != null) ? area3_code : area2_code;

            let epidemiology_data = {
              table: "epidemiology",
              source: "Folkhälsomyndigheten", //Maybe source is incorrect, not sure where it's from
              date: firstDayOfWeek(currentOrLastWeek(), new Date().getFullYear()),
              country_code: "SWE",
              area1_code: adm_area.area1_code,
              area2_code: area2_code,
              area3_code: area3_code,
              gid: gid,
              dead: deaths
            }

            // console.log("Inserting deaths for " + KnNamn)
            await upsertTimeseries(epidemiology_data)
          }
  })
}

readCSVFileWithUrl('https://datawrapper.dwcdn.net/liNlg/81/dataset.csv');