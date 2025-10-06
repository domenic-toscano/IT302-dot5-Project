require("dotenv").config();
const { MongoClient } = require("mongodb");
const app = require("./server");
const BikesDAO = require("./dao/bikesDAO");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "it302";
const COLLECTION_NAME = process.env.COLLECTION_NAME || "citiBikes_dot5";

const client = new MongoClient(MONGO_URI, {});

async function start() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    await BikesDAO.injectDB(client, DB_NAME, COLLECTION_NAME);
    console.log("BikesDAO initialized");

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
