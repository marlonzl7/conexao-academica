const express = require("express");
const router = express.Router();

const dashboardDiretorController = require('../controllers/dashboardDiretor.js');

// Kpis
router.get("/kpis", dashboardDiretorController.getKPIs);

// Anos disponíveis para filtro
router.get("/anos-disponiveis", dashboardDiretorController.getAnosDisponiveis);

// Top 3 Maior evasao - Graficos
router.get("/graficos/top-3-maior-evasao", dashboardDiretorController.getGraficoEvasao);

// Taxa de evasão anual - Graficos
// router.get("/graficos/taxa-evasao-anual", dashboardDiretorController.getTaxaEvasaoAnual);

module.exports = router;