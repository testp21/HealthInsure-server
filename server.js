// server.js - Main entry point for the application

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost/insurance-recommender"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// // Models
// const Session = require("./models/session");
// const Question = require("./models/question");
// const Plan = require("./models/plan");

// Routes
// app.use("/api/sessions", require("./routes/sessions"));
// app.use("/api/questions", require("./routes/questions"));
// app.use("/api/admin", require("./routes/admin"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
