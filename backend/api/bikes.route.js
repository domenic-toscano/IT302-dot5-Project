// Domenic Toscano
// 10/5/25
// IT302-451
// Project Phase 2
// dot5@njit.edu

const express = require("express");
const BikesCtrl = require("./bikes.controller");

const router = express.Router();

router.get("/bikes", BikesCtrl.apiGetBikes);
router.get("/bikes/:id", BikesCtrl.apiGetBikeById);

module.exports = router;
