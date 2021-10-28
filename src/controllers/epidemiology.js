import { Pool } from '../db.js';


export default {
    /**
     * Retrieves the data about epidemiology
     * @param {Object} req must contain 3 query params: startdate, enddate, indicators
     * @param {Object} res 
     */
    async getEpidemiologyIndicators(req, res) {
        // /api/epidemiology?startdate=2020-01-01&enddate=2020-12-31&indicators=deaths,confirmed

        let startdate = req.params.startdate
        let enddate = req.params.enddate
        let indicatorsList = req.params.indicators
        let indicators = indicatorsList.split(',')

        // TODO: never ever include user input inside the query without sanitizing it !!!
        let query = `select ` + indicators[0] + ` from epidemiology where `;
        try {
            let data = await Pool.query(query);
            res.send(data.rows);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
}