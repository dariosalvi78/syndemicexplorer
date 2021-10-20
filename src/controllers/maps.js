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
            let query = `select distinct area1_name, area1_code, ST_AsGeoJSON(ST_Envelope(geometry)) as boundingBox, ST_AsGeoJSON(geometry) as geometry 
            from admin_areas where country_code = $1`
            try {
                let data = await Pool.query(query, [countryCode])
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
            let query = `select distinct area2_name, area2_code, ST_AsGeoJSON(ST_Envelope(geometry)), ST_AsGeoJSON(geometry) as geometry from admin_areas where area1_code = $1`
            try {
                let data = await Pool.query(query, [area1Code])
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
            let query = `select distinct area3_name, area3_code, ST_AsGeoJSON(ST_Envelope(geometry)), ST_AsGeoJSON(geometry) as geometry 
            from admin_areas 
            where area2_name in 
                (select area2_name 
                from admin_areas
                where area2_code = $1)`
            try {
                let data = await Pool.query(query, [area2Code])
                res.send(data.rows)
            } catch (error) {
                console.log(error.message)
                res.sendStatus(500)
            }
        }
    }
}
/*
async function fetchBoundingBox(queryParam) {
    let boundingbox;
    console.log(queryParam)
    let query = `select st_xmin(st_union(st_envelope(geometry))), st_ymin(st_union(st_envelope(geometry))), 
            st_xmax(st_union(st_envelope(geometry))), st_ymax(st_union(st_envelope(geometry))) from admin_areas where ${queryParam}`
    try {
        let data = await Pool.query(query)
        console.log(data)
        let boundingbox = ['boundingbox', {'minLat': data.rows[0].st_xmin, 'minLong':data.rows[0].st_ymin},
                          {'maxLat': data.rows[0].st_xmax, 'maxLong': data.rows[0].st_ymax}]
    } catch (error) {
        console.log(error.message)
    }
    return boundingbox;
} 
*/