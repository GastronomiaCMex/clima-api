const express = require('express');
const router = express.Router();
const climaController = require('../controllers/climaController');

router.get('/clima', climaController.climaActual);
router.get('/pronostico', climaController.pronostico);
router.get('/coordenadas', climaController.coordenadas);

module.exports = router;