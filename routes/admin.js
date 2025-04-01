// routes/admin.js
const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Plan = require("../models/plan");
const authMiddleware = require("../middleware/auth");

// Use authentication middleware for all admin routes
router.use(authMiddleware);

// Get entire question tree
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a question
router.put("/questions/:questionId", async (req, res) => {
  try {
    const updatedQuestion = await Question.findOneAndUpdate(
      { id: req.params.questionId },
      req.body,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new insurance plan
router.post("/plans", async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
