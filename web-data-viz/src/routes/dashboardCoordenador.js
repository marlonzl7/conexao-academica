var express = require("express");
var router = express.Router();

var dashboardCoordenadorController = require("../controllers/dashboardCoordenadorController");
var validarPeriodo = require("../validadores/periodoValidador");

router.get("/kpis", validarPeriodo, function(req, res) {
    dashboardCoordenadorController.listarKPIs(req, res);
});

router.get("/graficos/taxa-evasao-anual", validarPeriodo, function (req, res) {
    dashboardCoordenadorController.listarTaxaEvasaoAnual(req, res);
});

router.get("/graficos/situacao-alunos", validarPeriodo, function (req, res) {
    dashboardCoordenadorController.listarSituacaoAlunos(req, res);
});

router.get("/anos", function(req, res) {
    dashboardCoordenadorController.listarPeriodos(req, res);
})

module.exports = router;