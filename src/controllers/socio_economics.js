import { Pool } from '../db.js';

// TODO: add endpoint for overcrowdness
export default {
  async getSocioEconomicIndicators(req, res) {
    let query = `select * from socio_economic`;
    try {
      let data = await Pool.query(query);
      res.send(data.rows);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
    },

    async getOvercrowdednessData(req, res) {
        let area3Code = req.query.area3Code;
        let year = req.query.year;
        let query = `SELECT year, gid, indicator, value FROM socio_economic 
        WHERE indicator LIKE 'overcrowdedness_%' AND area3_code = $1 AND year = `;

        if (!area3Code) {
            res.sendStatus(400);
        }

        try {
            let data
            if (year) {
                query += `$2`
                data = await Pool.query(query, [area3Code, year])
            } else {
                query += `2020`
                data = await Pool.query(query, [area3Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },

  //Jag ändrade lite här för att få med alla indicators för den area coden ------  where indicator = 'demographics_age_total_all' and
  async getPopulation(req, res) {
    let area3Code = req.query.area3Code;
    let year = req.query.year;
    let query = `SELECT year, gid, indicator, value FROM socio_economic 
        WHERE indicator LIKE 'demographics_%' AND area3_code = $1 AND year = `;

    if (!area3Code) {
      res.sendStatus(400);
    }

    try {
      let data;
      if (year) {
        query += `$2`;
        data = await Pool.query(query, [area3Code, year]);
      } else {
        query += `2020`;
        data = await Pool.query(query, [area3Code]);
      }
      res.send(data.rows);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
  async getPopulationForeignBackground(req, res) {
    let area3Code = req.query.area3Code;
    let year = req.query.year;
    let query = `SELECT year, gid, indicator, value FROM socio_economic 
        WHERE indicator LIKE 'foreign-background_%' AND area3_code = $1 AND year = `;

    if (!area3Code) {
      res.sendStatus(400);
    }

        try {
            let data
            if(year) {
                query += `$2`
                data = await Pool.query(query, [area3Code, year])
            } else {
                query += `2020`
                data = await Pool.query(query, [area3Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getEducationalLevel(req, res) {
        let area3Code = req.query.area3Code
        let year = req.query.year
        let query = `SELECT year, gid, indicator, value FROM socio_economic 
        WHERE indicator LIKE 'educational-level_%' AND area3_code = $1 AND year = `

        if(!area3Code) {
            res.sendStatus(400)
        }

        try {
            let data
            if(year) {
                query += `$2`
                data = await Pool.query(query, [area3Code, year])
            } else {
                query += `2019`
                data = await Pool.query(query, [area3Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getDisposableIncome(req, res) {
        let area3Code = req.query.area3Code
        let year = req.query.year
        let query = `SELECT year, gid, indicator, value FROM socio_economic 
        WHERE indicator LIKE 'disposable-income_%' AND area3_code = $1 AND year = `

        if(!area3Code) {
            res.sendStatus(400)
        }

        try {
            let data
            if(year) {
                query += `$2`
                data = await Pool.query(query, [area3Code, year])
            } else {
                query += `2019`
                data = await Pool.query(query, [area3Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
};
