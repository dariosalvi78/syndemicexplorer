import { Pool } from '../db.js';

    export default async function getHeatmapGeoJSON(req, res) {
    let countryCode = req.query.countryCode;
    let indicator = req.query.indicator;
    let area1Code = req.query.area1Code;
    let gid = req.query.gid;
    let query = ``;

    try {
      let data;

      if(!countryCode && !indicator && !area1Code && !gid) {
        indicator = 'confirmed';
        query = getQuery(indicator, ' ');
        data = await Pool.query(query);
      } else if (!countryCode || !indicator || !area1Code || !gid) {
          res.sendStatus(400);
          return;
      }
      else {
        query = getQuery(indicator, 'where epidemiology.country_code = $1 and epidemiology.area1_code = $2 and epidemiology.gid = $3')
        data = await Pool.query(query, [countryCode, area1Code, gid])
      }
      let features = [];
      for(let i in data.rows) {
          var obj = JSON.parse(data.rows[i].geometry)
          features[i] = {
              "type": "Feature",
              "properties" : {
                  [indicator]: data.rows[i].confirmed
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

function getQuery(indicator, filter) {
    return (
    `select distinct on (epidemiology.area2_code, epidemiology.area3_code) ${indicator}, st_asgeojson(st_centroid(geometry)) as geometry from epidemiology
    inner join admin_areas on epidemiology.area2_code = admin_areas.area2_code
    ${filter}
    order by epidemiology.area2_code, epidemiology.area3_code, confirmed desc`
    )
  }