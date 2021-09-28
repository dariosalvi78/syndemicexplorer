import {Pool} from '../db.js'


export default {
    async getCountryNames (req, res) {
        let query = `select distinct country_name from admin_areas`
        try {
            let data = await Pool.query(query)
            res.send(data.rows)
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    },
    async getAdmArea_1_Names (req, res) {
        let countryCode = req.query.countryCode
        if (!countryCode) {
            res.sendStatus(404)
        } else {
            let query = `select distinct area1_name from admin_areas where country_code = $1`
            try {
                let data = await Pool.query(query, [countryCode])
                res.send(data.rows)
            } catch (e) {
                console.error(e)
                res.sendStatus(500)
            }
        }
    }
}