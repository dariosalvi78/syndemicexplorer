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


export default function () {
  // var axios = require('axios')

  var config = {
    method: 'get',
    url: 'https://utility.arcgis.com/usrsvcs/servers/63de09e702d142eb9ddd865838f80bd5/rest/services/FOHM_Covid_19_kommun_FME_20201228/FeatureServer/0/query?f=json&where=veckonr_txt%3D%272021-15%27&returnGeometry=false&outFields=*&outSR=4326&cacheHint=true',
    headers: { 
      'origin': 'https://fohm.maps.arcgis.com', 
      'referer': 'https://fohm.maps.arcgis.com/apps/opsdashboard/index.html'
    }
  }
  
  console.clear();

  //How do i extract the data from this .then function?
  axios(config)
  .then(function (response) {
    // console.log(JSON.stringify(response.data));

    // console.log(response.data);
    // console.log(response.data.features);
    
    for (var i = 0; i < response.data.features.length; i++) {
      let featureAttribute = response.data.features[i].attributes;

      let country_code = "SWE";
      let area1_code = "";
      let area2_code = "";
      let area3_code = "";
      let gid = "";

      let confirmed_cumulative = featureAttribute.cumfreq;
      //featureAttribute.KnNamn
      //featureAttribute.fall
      //
      //featureAttribute.cuminc
      console.log(featureAttribute);
    }
  })
  .catch(function (error) {
    console.log(error);
  });

  let data = "Test";

  axios(config)
  .then(function (response) {
    data = JSON.stringify(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

  // write the data into the database

}

async getAdmArea (req, res) {
  let admLevel = req.query.adm_level;
  if(!admLevel) {
      res.sendStatus(400)
  } else {
      let query = "SELECT adm_area_$1, gid FROM covid19_schema.administrative_division WHERE country = 'Sweden' AND adm_level = '$1'"
      try {
          let data = await Pool.query(query, [admLevel])
          res.send(data.rows)
      } catch (error) {
          console.log(error.message)
          res.sendStatus(500)
      }
  }
}