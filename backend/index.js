// Domenic Toscano
// 10/5/25
// IT302-451
// Project Phase 2
// dot5@njit.edu

require("dotenv").config();
const { MongoClient } = require("mongodb");
const app = require("./server");

const BikesDAO = require("./dao/bikesDAO");
const FeedbackDAO = require("./dao/feedbackDAO"); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "it302";
const BIKE_COLLECTION = process.env.BIKE_COLLECTION || "CitiBikes_dot5";
const FEEDBACK_COLLECTION = process.env.FEEDBACK_COLLECTION || "feedback_dot5";

const client = new MongoClient(MONGO_URI, {});

async function start() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    await BikesDAO.injectDB(client, DB_NAME, BIKE_COLLECTION);
    await FeedbackDAO.injectDB(client, DB_NAME, FEEDBACK_COLLECTION);

    console.log("DAOs initialized");

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
