var express = require("express");
var router = express.Router();
var administradorController = require("../controllers/administradorController");

router.get("/getInstituicoes", function (req, res) {
    administradorController.listar(req, res);
});

router.get("/getInstituicaoPorId", function (req, res) {
    administradorController.buscarPorId(req, res);
});

router.get("/pesquisarInstituicoes", function (req, res) {
    administradorController.pesquisarInstituicoes(req, res);
});

module.exports = router;