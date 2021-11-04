import { Pool } from '../db.js';


export default {
    /**
     * Retrieves the data about epidemiology
     * @param {Object} req must contain 3 query params: startdate, enddate, indicators
     * @param {Object} res 
     */
    async getEpidemiologyIndicators(req, res) {
        // /api/epidemiology?startdate=2020-01-01&enddate=2020-12-31&indicators=deaths,confirmed

        let query = `select * from epidemiology`
        try {
            let data = await Pool.query(query)
            res.send(data.rows)
        } catch (e) {
            console.log(e)
            res.sendStatus(500)
        }
    }
}