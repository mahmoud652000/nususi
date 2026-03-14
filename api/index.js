const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB connection */

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const db = await mongoose.connect(process.env.MONGODB_URI);

  isConnected = db.connections[0].readyState;
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

/* Routes */

app.use("/api/auth", require("../backend/routes/auth"));
app.use("/api/books", require("../backend/routes/books"));
app.use("/api/upload", require("../backend/routes/upload"));
app.use("/api/dashboard", require("../backend/routes/dashboard"));

/* Test */

app.get("/api", (req, res) => {
  res.json({ message: "API Working 🚀" });
});

/* favicon fix */

app.get("/favicon.ico", (req, res) => res.status(204).end());

module.exports.handler = serverless(app);