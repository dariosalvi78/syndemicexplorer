import { Pool } from '../db.js';

export default {
  async getEpidemiologyIndicators(req, res) {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let query = `select * from epidemiology`;

    try {
      let data;
      if (startDate && endDate) {
        query += ` where date between $1 and $2`;
        data = await Pool.query(query, startDate, endDate);
      } else {
        data = await Pool.query(query);
      }
      res.send(data.rows);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
  async getAdmArea3Indicator(req, res) {
    let area3Code = req.query.area3Code;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let indicator = req.query.indicator;
    let query;

    if (!area3Code) {
      res.sendStatus(400);
    }
    try {
      let data;
      if (startDate && endDate) {
        query = getQuery(3, indicator, 'AND date BETWEEN $2 AND $3');
        data = await Pool.query(query, [area3Code, startDate, endDate]);
      } else {
        query = getQuery(3, indicator);
        data = await Pool.query(query, [area3Code]);
      }
      res.send(data.rows);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
  async getAdmArea2Indicator(req, res) {
    let area2Code = req.query.area2Code;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let indicator = req.query.indicator;
    let query;

    if (!area2Code) {
      res.sendStatus(400);
    }
    try {
      let data;
      if (startDate && endDate) {
        query = getQuery(2, indicator, 'AND date BETWEEN $2 AND $3');
        data = await Pool.query(query, [area2Code, startDate, endDate]);
      } else {
        query = getQuery(2, indicator);
        data = await Pool.query(query, [area2Code]);
      }
      res.send(data.rows);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
  async getAdmArea1Indicator(req, res) {
    let area1Code = req.query.area1Code;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let indicator = req.query.indicator;
    let query;

    if (!area1Code) {
      res.sendStatus(400);
    }
    try {
      let data;
      if (startDate && endDate) {
        query = getQuery(1, indicator, `AND date BETWEEN $2 AND $3`)
        data = await Pool.query(query, [area1Code, startDate, endDate]);
      } else {
        query = getQuery(1, indicator);
        data = await Pool.query(query, [area1Code]);
      }
      res.send(data.rows);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
};

function getQuery(level, indicator = 'confirmed', filter = ' ') {
  // When the area code level is less than three the confirmed cases need to be summed or we'll get multiple rows for every subset of that area
  indicator = (level < 3) ? `SUM(${indicator}) AS ${indicator}` : `${indicator}`;
  let groupBy = (level < 3) ? `GROUP BY epidemiology.area${level}_code, admin_areas.area${level}_name, date` : ' '
  return (
    `SELECT to_char(date, 'YYYY-MM-DD') AS date, epidemiology.area${level}_code, admin_areas.area${level}_name, ${indicator} 
    FROM epidemiology
    JOIN admin_areas 
    ON epidemiology.gid = admin_areas.gid
    WHERE epidemiology.area${level}_code = $1 ${filter}
    ${groupBy}
    ORDER BY date`
  );
}
