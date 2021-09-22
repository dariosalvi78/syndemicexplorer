import {Pool} from '../dbPool.js'


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
    }
}