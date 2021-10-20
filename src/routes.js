import express from 'express';
import mapsCtrl from './controllers/maps.js';

const router = express.Router();

router.get('/maps/countrynames', mapsCtrl.getCountryNames);
router.get('/maps/admarea1names', mapsCtrl.getAdmArea_1_Names);
router.get('/maps/admareas1', mapsCtrl.getAdmAreas1);
router.get('/maps/admareas2', mapsCtrl.getAdmAreas2);
router.get('/maps/admareas3', mapsCtrl.getAdmAreas3);
//router.get('/maps/boundingboxes', mapsCtrl.getBoundingBoxes);

export default router;
