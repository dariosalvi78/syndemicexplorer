import express from 'express'
import mapsCtrl from './controllers/maps.js'

const router = express.Router()

router.get('/maps/countrynames', mapsCtrl.getCountryNames)
router.get('/maps/admarea1names', mapsCtrl.getAdmArea_1_Names)

export default router