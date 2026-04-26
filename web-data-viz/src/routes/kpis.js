var express = require("express");
var router = express.Router();

var kpiController = require("../controllers/kpiController");

router.get("/", function(req, res) {
    kpiController.listarKpis(req, res);
});

router.get("/:id", function (req, res) {
    kpiController.buscarKpi(req, res);
});

module.exports = router;