var express = require("express");
var router = express.Router();

var instituicaoController = require("../controllers/instituicaoController");

router.get("/", function (req, res) {
    instituicaoController.listar(req, res);
});

module.exports = router;