const express = require('express');
const router = express.Router();

const alertaController = require('../controllers/alertaController.js');

router.get('/allAlerts', alertaController.getAllAlerts);

router.post('/create', alertaController.createAlert);

router.delete('/:id', alertaController.deleteAlert);

router.get('/alertFiltered', alertaController.getAlertsByFilter);

module.exports = router;
