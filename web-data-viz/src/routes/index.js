var express = require("express");
var router = express.Router();
var indexController = require("../controllers/indexController");

const path = require("path");

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../public/pages/index.html"));
});

router.post("/contact", function (req, res) {
    indexController.contact(req, res);
});


module.exports = router;