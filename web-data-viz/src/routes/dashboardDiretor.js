const express = require("express");
const router = express.Router();

const dashboardDiretorController = require('../controllers/dashboardDiretor.js');

// Kpis
router.get("/kpis", dashboardDiretorController.getKPIs);

// Top 3 Maior evasao - Graficos
// router.get("/graficos/top-3-maior-evasao", dashboardDiretorController.getTop3MaioresEvasoes);

// Taxa de evasão anual - Graficos
// router.get("/graficos/taxa-evasao-anual", dashboardDiretorController.getTaxaEvasaoAnual);

module.exports = router;