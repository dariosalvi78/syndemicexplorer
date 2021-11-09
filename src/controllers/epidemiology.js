import { Pool } from '../db.js';


export default {
    async getEpidemiologyIndicators(req, res) {
        let query = `select * from epidemiology`
        try {
            let data = await Pool.query(query)
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea3ConfirmedCases(req, res) {
        
        let area3Code = req.query.area3Code
        if (!area3Code) {
          res.sendStatus(400)
        }
        let query = `select date, area3_code, confirmed from epidemiology where area3_code = $1 order by date`
        try {
            let data = await Pool.query(query, [area3Code])
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea2ConfirmedCases(req, res) {
        
        let area2Code = req.query.area2Code
        if (!area2Code) {
          res.sendStatus(400)
        }
        let query = `select date, area2_code, confirmed from epidemiology where area2_code = $1 order by date`
        try {
            let data = await Pool.query(query, [area2Code])
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea1ConfirmedCases(req, res) {
        let area1Code = req.query.area1Code
        if(!area1Code) {
            res.sendStatus(400)
        }
        let query = `select date, area1_code, sum(confirmed) as confirmed from epidemiology where area1_code = $1 group by area1_code, date order by date`
        try {
            let data = await Pool.query(query, [area1Code])
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
}