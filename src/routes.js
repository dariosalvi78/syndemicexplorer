import express from 'express'
import mapsCtrl from './controllers/maps.js'

const router = express.Router()

router.get('/maps/countryNames', mapsCtrl.getCountryNames)

export default router