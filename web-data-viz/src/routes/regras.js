var express = require("express");
var router = express.Router();

var regraController = require("../controllers/regraController");;
var { validarCadastroRegra } = require("../validadores/regraValidador");

router.get("/", function (req, res) {
    regraController.listarRegra(req, res);
});

router.post("/cadastrar", validarCadastroRegra ,function(req, res) {
    regraController.cadastrarRegra(req, res);
});

router.put("/editar/:id", function(req, res) {
    regraController.editarRegra(req, res);
});

router.delete("/deletar/:id", function(req, res) {
    regraController.deletarRegra(req, res);
});

module.exports = router;