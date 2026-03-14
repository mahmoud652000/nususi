const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
const path = require("path");

dotenv.config();

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* MongoDB */
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

/* API Routes */
app.use("/api/auth", require("../backend/auth"));
app.use("/api/books", require("../backend/books"));
app.use("/api/upload", require("../backend/upload"));
app.use("/api/dashboard", require("../backend/dashboard"));

/* favicon fix */
app.get("/favicon.ico", (req, res) => res.status(204).end());

/* Export */
module.exports = serverless(app);