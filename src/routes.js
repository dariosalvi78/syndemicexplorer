import express from 'express';
import mapsCtrl from './controllers/maps.js';
import epidemiologyCtrl from './controllers/epidemiology.js';
import socioEconomicsCtrl from './controllers/socio_economics.js';
import heatmapCtrl from './controllers/heatmap.js';

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
// startDate and endDate can be specified as optional query parameters
router.get('/epidemiology', epidemiologyCtrl.getEpidemiologyIndicators);

// endpoint for confirmed cases of a municipality
// area2Code has to be specified as query parameter
// startDate and endDate can be specified as optional query parameters
router.get('/epidemiology/admareas2', epidemiologyCtrl.getAdmArea2Indicator);

// endpoint for confirmed cases of a region
// area1Code has to be specified as query parameter
// startDate and endDate can be specified as optional query parameters
router.get('/epidemiology/admareas1', epidemiologyCtrl.getAdmArea1Indicator);

// enpoint for confirmed cases of a district
// area3Code has to be specified as query parameter
// startDate and endDate can be specified as optional query parameters
router.get('/epidemiology/admareas3', epidemiologyCtrl.getAdmArea3Indicator);

// endpoint for the population of a district (amount of inhabitants)
// area3Code has to be specified as query parameter
// year can be specified as an optional query parameter. If not specified, returns the latest year available (2020)
router.get('/socio_economics/population', socioEconomicsCtrl.getPopulation);

// endpoint for the population with foreign background of a district (amount of inhabitants)
// area3Code has to be specified as query parameter
// year can be specified as an optional query parameter. If not specified, returns the latest year available (2020)
router.get('/socio_economics/foreignbackground', socioEconomicsCtrl.getPopulationForeignBackground);

// endpoint for all the data in the table
// no query parameters required
router.get('/socio_economics/socioeconomics', socioEconomicsCtrl.getSocioEconomicIndicators);

router.get('/heatmapdata', heatmapCtrl)

export default router;
