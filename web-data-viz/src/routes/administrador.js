var express = require("express");
var router = express.Router();
var administradorController = require("../controllers/administradorController");

router.get("/", administradorController.listar);
router.get("/search", administradorController.pesquisarInstituicoes);
router.patch("/:idInstituicao/usuarios/:idUsuario/status", administradorController.alterarStatusUsuario);
router.post("/cadastrarDiretor", administradorController.cadastrarDiretor);
router.post("/cadastrarAdministrador", administradorController.cadastrarAdministrador);
router.post("/cadastrarCoordenador", administradorController.cadastrarCoordenador);
router.get("/instituicao/kpis/:idInstituicao", administradorController.buscarKPIs);
router.get("/:id", administradorController.buscarPorId);



module.exports = router;