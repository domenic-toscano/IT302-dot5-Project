const express = require("express");
const BikesCtrl = require("./bikes.controller");

const router = express.Router();

router.get("/bikes", BikesCtrl.apiGetBikes);

module.exports = router;
