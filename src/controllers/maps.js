import {Pool} from '../db.js'
import {queryStringToArray, getQuery} from'../utils.js'


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
            res.sendStatus(400)
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
    },
    // get the admin area1 (region) codes, names and geometry for a specific country
    // country code must be specified as query param
    async getAdmAreas1 (req, res) {
        let countryCode = req.query.countryCode
        if(!countryCode) {
            res.sendStatus(400)
        } else {
            let query = getQuery("area1") +
            `where country_code = $1`
            try {
                let data = await Pool.query(query, [countryCode])
                for(let i in data.rows) {
                    data.rows[i]['bounding_box'] = queryStringToArray(data.rows[i]['bounding_box'])
                }
                res.send(data.rows)
            } catch (error) {
                console.log(error.message)
                res.sendStatus(500)
            }
        }
    },
    // get the admin area2 (municipality) names, codes and geometry for a specific region
    // area code1 must be specified as query param
    async getAdmAreas2 (req, res) {
        let area1Code = req.query.area1Code
        if(!area1Code) {
            res.sendStatus(400)
        } else {
            let query = getQuery("area2") +
            `where area1_code = $1`
            try {
                let data = await Pool.query(query, [area1Code])
                for(let i in data.rows) {
                    data.rows[i]['bounding_box'] = queryStringToArray(data.rows[i]['bounding_box'])
                }
                res.send(data.rows)
            } catch (error) {
                console.log(error.message)
                res.sendStatus(500)
            }
        }
    },
    // get the admin area3 (district) names, codes and geometry for a specific municipality.
    // area code2 must be specified as query param
    async getAdmAreas3 (req, res) {
        let area2Code = req.query.area2Code
        if(!area2Code) {
            res.sendStatus(400)
        } else {
            let query = getQuery("area3") + 
            `where area2_name in 
                (select area2_name 
                from admin_areas
                where area2_code = $1)`
            try {
                let data = await Pool.query(query, [area2Code])
                for(let i in data.rows) {
                    data.rows[i]['bounding_box'] = queryStringToArray(data.rows[i]['bounding_box'])
                }
                res.send(data.rows)
            } catch (error) {
                console.log(error.message)
                res.sendStatus(500)
            }
        }
    }
}

