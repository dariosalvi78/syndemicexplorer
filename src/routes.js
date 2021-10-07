import express from 'express'
import mapsCtrl from './controllers/maps.js'

const router = express.Router()

router.get('/maps/countrynames', mapsCtrl.getCountryNames)
router.get('/maps/admarea1names', mapsCtrl.getAdmArea_1_Names)

// router.get('/maps/admareas1', mapsCtrl.getCountryNames) // needs to provide country code as query param
// returns an array of objects with: area1 name, area1 code, geojson for the area1, geojson of the bounding box

// router.get('/maps/admareas2', mapsCtrl.getCountryNames) // needs to provide area 1 code as query param
// router.get('/maps/admareas3', mapsCtrl.getCountryNames) // needs to provide area 2 code as query param


export default router