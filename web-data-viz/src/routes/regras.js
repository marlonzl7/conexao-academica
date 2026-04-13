var express = require("express");
var router = express.Router();

var regraController = require("../controllers/regraController");;
var { validarCadastroRegra } = require("../validadores/regraValidador");

router.post("/cadastrar", validarCadastroRegra ,function(req, res) {
    regraController.cadastrarRegra(req, res);
});

module.exports = router;