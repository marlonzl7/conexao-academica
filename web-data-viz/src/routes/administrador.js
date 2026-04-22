var express = require("express");
var router = express.Router();
var administradorController = require("../controllers/administradorController");

router.get("/", administradorController.listar);
router.get("/search", administradorController.pesquisarInstituicoes);
router.get("/:id", administradorController.buscarPorId);

module.exports = router;