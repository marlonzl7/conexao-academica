var express = require("express");
var router = express.Router();
var administradorController = require("../controllers/administradorController");

router.get("/instituicoes", administradorController.listar);

module.exports = router;