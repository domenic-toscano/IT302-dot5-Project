const express = require("express");
const cors = require("cors");

const bikesRouter = require("./api/bikes.route");

const app = express();
app.use(cors());
app.use(express.json());

// Mount all routes under your UCID root
app.use("/api/v1/dot5", bikesRouter);

// Optional quick health check
app.get("/", (_req, res) => res.send("Backend is running."));

module.exports = app;

