import { Pool } from '../db.js';

    export default async function getHeatmapGeoJSON(req, res) {
    let countryCode = req.query.countryCode;
    let level = req.query.level;
    let indicator = req.query.indicator;
    let areaCode1 = req.query.area1Code;
    let areaCode2 = req.query.area2Code;
    let areaCode3 = req.query.area3Code;
    let date = req.query.date;
    let query = ``;

    try {
      let data;

      if(!countryCode && !indicator && !level && !date) {
        res.sendStatus(400)
      } else {
        query = 
        `SELECT ${indicator}, ST_AsGeoJSON(ST_Centroid(geometry)) as geometry
         FROM epidemiology
         JOIN admin_areas `

        switch (level) {
          case '1':
            query += 
            `ON epidemiology.area1_code = admin_areas.area1_code
            AND epidemiology.area2_code IS NULL
            AND admin_areas.area2_code IS NULL `
            break;
          case '2':
            query += 
            `ON epidemiology.area2_code = admin_areas.area2_code
            AND epidemiology.area3_code IS NULL
            AND admin_areas.area3_code IS NULL `
            break;
          case '3':
            query += 
            `ON epidemiology.area3_code = admin_areas.area3_code `
            break;
          default:
            res.sendStatus(400);
            return;
        }

        query += 
        `WHERE epidemiology.country_code = $1
        AND date = $2 `

        if(areaCode1) {
          query += `AND epidemiology.area1_code = $3 AND admin_areas.level = $4`
          data = await Pool.query(query, [indicator, countryCode, date, areaCode1, level]);
        } else if(areaCode2) {
          query += `AND epidemiology.area2_code = $3 AND admin_areas.level = $4`
          data = await Pool.query(query, [indicator, countryCode, date, areaCode2, level]);
        } else if(areaCode3) {
          query += `AND epidemiology.area3_code = $3 AND admin_areas.level = $4`
          data = await Pool.query(query, [indicator, countryCode, date, areaCode3, level]);
        } else {
          data = await Pool.query(query, [countryCode, date]);
        }
      }

      let features = [];
      for(let i in data.rows) {
          var obj = JSON.parse(data.rows[i].geometry)
          features[i] = {
              "type": "Feature",
              "properties" : {
                  [indicator]: data.rows[i][indicator]
              },
              "geometry": {
                  "type": "Point",
                  "coordinates": obj.coordinates
              }
          }
      }
      var obj = {
          "type": "FeatureCollection",
          "features" : features
      }
      res.send(obj)
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
}