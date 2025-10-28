// Domenic Toscano
// 10/5/25
// IT302-451
// Project Phase 2
// dot5@njit.edu

const express = require("express");
const cors = require("cors");

const bikesRouter = require("./api/bikes.route");
const feedback = require("./api/feedback.route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/dot5", bikesRouter);
app.use("/api/v1/dot5/feedback", feedback);

app.get("/", (_req, res) => res.send("Backend is running."));

module.exports = app;

