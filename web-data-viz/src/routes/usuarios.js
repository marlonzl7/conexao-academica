var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");
var { validarCadastroUsuario } = require("../validadores/usuarioValidador");

router.post("/diretor", validarCadastroUsuario, function (req, res) {
    usuarioController.cadastrarUsuarioDiretor(req, res);
});

router.post("/login", function(req, res) {
    usuarioController.login(req, res);
})

module.exports = router;