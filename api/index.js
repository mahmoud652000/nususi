const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/api/auth", require("../routes/auth"));
app.use("/api/books", require("../routes/books"));
app.use("/api/upload", require("../routes/upload"));
app.use("/api/dashboard", require("../routes/dashboard"));

module.exports = serverless(app);