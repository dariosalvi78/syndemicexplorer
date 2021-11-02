// extract info from this page: https://experience.arcgis.com/experience/a6d20c1544f34d33b60026f45b786230
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


// we know that we have stads del (adm_area_3) statistics only for Malmö Göteborg and Stockholm
// for those, we can sum up all the cases for each stadsdel and also add the overall statistics for adm_area_2
import axios from 'axios';
import { Pool } from '../db.js'

//from https://stackoverflow.com/questions/7580824/how-to-convert-a-week-number-to-a-date-in-javascript
function firstDayOfWeek(week) { 
  var date       = firstWeekOfYear(),
      weekTime   = weeksToMilliseconds(week),
      targetTime = date.getTime() + weekTime;

  date.setTime(targetTime);
  date = date.toISOString();
  date = date.substring(0, date.indexOf('T'));

  return date; 
}

function weeksToMilliseconds(weeks) {
  return 1000 * 60 * 60 * 24 * 7 * (weeks - 1);
}

function firstWeekOfYear() {
  var date = new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0); //First week of the year
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
  var dayOffset=-day+FIRST_DAY_OF_WEEK; // dayOffset will correct the date in order to get a Monday
  if (WEEK_LENGTH-day+1<4) {
      // the current week has not the minimum 4 days required by iso 8601 => add one week
      dayOffset += WEEK_LENGTH;
  }
  return new Date(firstOfJanuaryDate.getTime()+dayOffset*24*60*60*1000);
}


export default function () {
  var config = {
    method: 'get',
    url: 'https://utility.arcgis.com/usrsvcs/servers/63de09e702d142eb9ddd865838f80bd5/rest/services/FOHM_Covid_19_kommun_FME_20201228/FeatureServer/0/query?f=json&where=veckonr_txt%3D%272021-15%27&returnGeometry=false&outFields=*&outSR=4326&cacheHint=true',
    headers: {
      'origin': 'https://fohm.maps.arcgis.com',
      'referer': 'https://fohm.maps.arcgis.com/apps/opsdashboard/index.html'
    }
  }

  console.clear();

  // Accumulate data for three kommuner (adm_area_2) since
  // data only exists for stadsdelar (adm_area_3) within them
  let malmo_count = 0
  let goteborg_count = 0
  let stockholm_count = 0

  //How do i extract the data from this .then function?
  axios(config)
    .then(async function (response) {
      for (var i = 0; i < response.data.features.length; i++) {
        let featureAttribute = response.data.features[i].attributes;

        if (featureAttribute.KnNamn == "Upplands Väsby")
          featureAttribute.KnNamn = "Upplands-Väsby"; //# Fix naming difference between FHM and OxCOVID19 database

        let data = await getAdmArea(featureAttribute.KnNamn);

        if (data == undefined) //Happens if authentication fails or the table doesn't exist
          continue;

        data = data.rows[0];

        let veckoNr = featureAttribute.veckonr;

        if (data == undefined) {
          console.error("Data is null on: " + featureAttribute.KnNamn);
          continue;
        }
        
        let table = "epidemiology";
        let source = "Folkhälsomyndigheten";
        let date = firstDayOfWeek(veckoNr); //Converts veckoNr to date
        let country_code = "SWE";
        let area1_code = data.area1_code; //region
        let area2_code = data.area2_code; //municipality
        let area3_code = data.area3_code;
        let gid = (area3_code != null) ? area3_code : area2_code;
        let confirmed_cumulative = featureAttribute.cumfreq;

        //TODO use these counts for cities
        if (featureAttribute.KnNamn == "Malmö")
          // Add to the total for adm_area_2 = Malmö
          malmo_count += confirmed_cumulative;
        else if (featureAttribute.KnNamn == "Göteborg")
          // Add to the total for adm_area_2 = Göteborg
          goteborg_count += confirmed_cumulative;
        else if (featureAttribute.KnNamn == "Stockholm") {
          // Add to the total for adm_area_2 = Stockholm
          stockholm_count += confirmed_cumulative;
        }
        
        //TODO verify that the hardcoded source is the correct source
        let demographic_data = [ 'table: ' + table + 'source: ' + source + 'date: ' + date, 'country_code: ' + country_code, 'area1_code: ' + area1_code, 'area2_code: ' + area2_code, 'gid: ' + gid, 'confirmed: ' + confirmed_cumulative]

        if (typeof(area3_code) != 'undefined' && area3_code != null) {
          demographic_data.splice(4, 0, 'area3_code: ' + area3_code);
        }

        Pool.upsertTimeseries(demographic_data)
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  // write the data into the database

}

// TODO test this code when i have tables again
// async function HandleResponseData(index, response) {
//   let featureAttribute = response.data.features[index].attributes;

//   if (featureAttribute.KnNamn == "Upplands Väsby")
//     featureAttribute.KnNamn = "Upplands-Väsby"; //# Fix naming difference between FHM and OxCOVID19 database

//   let data = await getAdmArea(featureAttribute.KnNamn);

//   return data.rows[0];
// }

function ConvertArrayToQueryValues(array) {
  let query = "(";

  for (var i = 0; i < array.length; i++) {
    query += "'" + array[i] + "'";
    if (i != array.length - 1)
      query += ", ";
  }

  return query + ")";
}

async function getAdmArea(req) {
  let kommunNamn = req[0];
  let stadsdel = req[1];
  if (!kommunNamn) {
    console.log("Missing kommunNamn!")
  } else {
    let query = "SELECT area1_code, area2_code, area3_code FROM admin_areas WHERE country_code = 'SWE' AND area2_name = $1"
    let parameters = [kommunNamn];

    if (stadsdel != null) {
      query += " AND area3_name = $2";
      parameters.push(" " + stadsdel); //TODO remove this space when database is fixed
    }
    try {
      return await Pool.query(query, parameters);
    } catch (error) {
      console.log(error.message)
    }
  }
}