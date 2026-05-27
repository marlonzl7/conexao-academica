const express = require("express");
const router = express.Router();

const dashboardDiretorController = require('../controllers/dashboardDiretor.js');

router.get("/kpis", dashboardDiretorController.getKPIs);
router.get("/anos-disponiveis", dashboardDiretorController.getAnosDisponiveis);
router.get("/graficos/top-3-maior-evasao", dashboardDiretorController.getGraficoEvasao);
router.get("/graficos/taxa-evasao-anual", dashboardDiretorController.getTaxaEvasaoAnual);

module.exports = router;