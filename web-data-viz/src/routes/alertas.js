const express = require("express");
const router = express.Router();

const alertaController = require("../controllers/alertasController.js");

router.get("/regras/:idInstituicao", alertaController.listarRegras);
router.get("/kpis/:idInstituicao", alertaController.listarKpisDisponiveis); 
router.get("/buscarKpi/:idInstituicao", alertaController.buscarKpi);
router.get("/filtrar/:idInstituicao", alertaController.filtrarAlertas);
router.get("/:idInstituicao", alertaController.listarAlertas);
router.post("/cadastrar", alertaController.cadastrarAlerta);
router.put("/atualizar/:idAlerta", alertaController.atualizarAlerta);
router.delete("/deletar/:idAlerta", alertaController.deletarAlerta);

module.exports = router;