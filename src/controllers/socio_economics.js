import { Pool } from '../db.js';

// TODO: add more indicators
export default {
    async getSocioEconomicIndicators(req, res) {
        let query = `select * from socio_economic`
        try {
            let data = await Pool.query(query)
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getPopulation(req, res) {
        let area3Code = req.query.area3Code
        let year = req.query.year
        let query = `select year, gid, indicator, value from socio_economic 
        where indicator = 'demographics_age_total_all' and area3_code = $1 and year = `

        if (!area3Code) {
            res.sendStatus(400)
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
    async getPopulationForeignBackground(req, res) {
        let area3Code = req.query.area3Code
        let year = req.query.year
        let query = `select year, gid, indicator, value from socio_economic 
        where indicator = 'foreign-background_total_all' and area3_code = $1 and year = `

        if (!area3Code) {
            res.sendStatus(400)
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
        let query = `select year, gid, indicator, value from socio_economic 
        where indicator = 'educational-level_eftergymnasial_all' and area3_code = $1 and year = `

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
        let query = `select year, gid, indicator, value from socio_economic 
        where indicator = 'disposable-income_all' and area3_code = $1 and year = `

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
}