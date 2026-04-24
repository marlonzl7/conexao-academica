var express = require("express");
var router = express.Router();

router.get("/kpi/:id", function (req, res) {
    kpiController.buscarKpi(req, res);
});

module.exports = router;