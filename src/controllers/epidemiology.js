import { Pool } from '../db.js';


export default {
    async getEpidemiologyIndicators(req, res) {
        let startDate = req.query.startDate
        let endDate = req.query.endDate

        let query = `select * from epidemiology`

        try {
            let data
            if(startDate && endDate) {
                query += ` where date between $1 and $2`
                data = await Pool.query(query, startDate, endDate)
            } else {
                data = await Pool.query(query)
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea3ConfirmedCases(req, res) {
        
        let area3Code = req.query.area3Code
        let startDate = req.query.startDate
        let endDate = req.query.endDate
        let query = `select date, epidemiology.area3_code, area3_name, confirmed 
        from epidemiology 
        join admin_areas
        on epidemiology.area3_code = admin_areas.area3_code
        where epidemiology.area3_code = $1`

        if (!area3Code) {
          res.sendStatus(400)
        }
        try {
            let data
            if(startDate && endDate) {
                query += `and date between $2 and $3 order by date`
                data = await Pool.query(query, [area3Code, startDate, endDate])
            } else {
                query += `order by date`
                data = await Pool.query(query, [area3Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea2ConfirmedCases(req, res) {
        
        let area2Code = req.query.area2Code
        let startDate = req.query.startDate
        let endDate = req.query.endDate
        let query = `select date, area2_code, confirmed from epidemiology where area2_code = $1`;

        if (!area2Code) {
          res.sendStatus(400)
        }
        try {
            let data
            if(startDate && endDate) {
                query += `and date between $2 and $3 order by date`
                data = await Pool.query(query, [area2Code, startDate, endDate])
            } else {
                query += `order by date`
                data = await Pool.query(query, [area2Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea1ConfirmedCases(req, res) {
        let area1Code = req.query.area1Code
        let startDate = req.query.startDate
        let endDate = req.query.endDate
        let query = `select date, area1_code, sum(confirmed) as confirmed from epidemiology where area1_code = $1`

        if(!area1Code) {
            res.sendStatus(400)
        }
        try {
            let data
            if(startDate && endDate) {
                query += `and date between $2 and $3 group by area1_code, date order by date`
                data = await Pool.query(query, [area1Code, startDate, endDate])
            } else {
                query += `group by area1_code, date order by date`
                data = await Pool.query(query, [area1Code])
            }
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
}