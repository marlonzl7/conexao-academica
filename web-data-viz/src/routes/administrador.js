var express = require("express");
var router = express.Router();
var administradorController = require("../controllers/administradorController");

router.get("/getInstituicoes", function (req, res) {
    administradorController.listar(req, res);
});

module.exports = router;