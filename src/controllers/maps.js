import {Pool} from '../db.js'


export default {
    // get country names and codes available in the maps
    async getCountryNames (req, res) {
        let query = `select distinct country_name, country_code from admin_areas`
        try {
            let data = await Pool.query(query)
            res.send(data.rows)
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    },
    // get adm area 1 names and codes for one country
    // country code must be specified as query param
    async getAdmArea_1_Names (req, res) {
        let countryCode = req.query.countryCode
        if (!countryCode) {
            res.sendStatus(404)
        } else {
            let query = `select distinct area1_name, area1_code from admin_areas where country_code = $1`
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