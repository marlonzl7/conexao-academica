const express = require("express");
const router = express.Router();

const cargoController = require("../controllers/cargoController.js");

router.get("/", cargoController.getAllRoles);

router.delete("/:id", cargoController.deleteRole);

router.put("/:id", cargoController.updateRole);

router.post("/", cargoController.createRole);

module.exports = router;