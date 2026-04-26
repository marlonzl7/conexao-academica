var express = require("express");
var router = express.Router();
var administradorController = require("../controllers/administradorController");

router.get("/", administradorController.listar);
router.get("/search", administradorController.pesquisarInstituicoes);
router.patch("/:idInstituicao/usuarios/:idUsuario/status", administradorController.alterarStatusUsuario);
router.post("/cadastrar", administradorController.cadastrarAdministrador);
router.get("/kpis/:idInstituicao", administradorController.buscarKPIs);
router.get("/:id", administradorController.buscarPorId);



module.exports = router;