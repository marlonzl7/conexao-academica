var express = require("express");
var router = express.Router();
var path = require("path");
var indexController = require("../controllers/indexController");

router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../../public/pages/index.html"));
});

router.post("/contact", function (req, res) {
    indexController.contact(req, res);
});

module.exports = router;