import express from 'express';
import mapsCtrl from './controllers/maps.js';
import epidemiologyCtrl from './controllers/epidemiology.js';

const router = express.Router();

// endpoint for listing the country names in the database
router.get('/maps/countrynames', mapsCtrl.getCountryNames);

// endpoint for listing the names of the regions of a country
// countryCode has to be specified as query parameter
router.get('/maps/admarea1names', mapsCtrl.getAdmArea_1_Names);

// endpoint for regional data of a country 
// countryCode has to be specified as query parameter
router.get('/maps/admareas1', mapsCtrl.getAdmAreas1);

// endpoint for municipal data of a region
// area1Code has to be specified as query parameter
router.get('/maps/admareas2', mapsCtrl.getAdmAreas2);

// endpoint for city district data of a municipality
// area2Code has to be specified as query parameter
router.get('/maps/admareas3', mapsCtrl.getAdmAreas3);

// endpoint for epidemiology data
router.get('/epidemiology', epidemiologyCtrl.getEpidemiologyIndicators)

export default router;
