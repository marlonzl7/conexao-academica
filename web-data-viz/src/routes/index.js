var express = require("express");
var router = express.Router();
var indexController = require("../controllers/indexController");

router.get("/", function (req, res) {
    res.render("index");
});

router.post("/contact", function (req, res) {
    indexController.contact(req, res);
});


module.exports = router;