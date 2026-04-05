var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");
var { validarCadastroUsuario } = require("../validadores/usuarioValidador");

router.post("/diretor", validarCadastroUsuario, function (req, res) {
    usuarioController.cadastrarUsuarioDiretor(req, res);
});

//info da conta
router.get("/:id", function (req, res) {
    usuarioController.buscarDadosConta(req, res);
});

router.put("/:id/senha", function (req, res) {
    usuarioController.atualizarSenha(req, res);
});

module.exports = router;