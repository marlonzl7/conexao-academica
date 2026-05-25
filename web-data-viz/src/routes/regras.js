var express = require("express");
var router = express.Router();

var regraController = require("../controllers/regraController");
var { validarLimitesRegra } = require("../validadores/regraValidador");

router.get("/", function (req, res) {
    regraController.listarRegras(req, res);
});

router.post("/cadastrar", validarLimitesRegra, function(req, res) {
    regraController.cadastrarRegra(req, res);
});

router.put("/editar/:id", validarLimitesRegra, function(req, res) {
    regraController.atualizarRegra(req, res);
});

router.delete("/deletar/:id", function(req, res) {
    regraController.deletarRegra(req, res);
});

module.exports = router;