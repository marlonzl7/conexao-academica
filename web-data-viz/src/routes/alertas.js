const express = require("express");
const router = express.Router();

const alertaController = require("../controllers/alertasController.js");

router.get("/regras/:idInstituicao", alertaController.listarRegras);

module.exports = router;
