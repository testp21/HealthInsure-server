// routes/questions.js
const express = require("express");
const router = express.Router();
const Question = require("../models/question");

// Get first question
router.get("/first", async (req, res) => {
  try {
    const question = await Question.findOne({ id: "q1" });

    if (!question) {
      return res.status(404).json({ error: "First question not found" });
    }

    // Return only relevant question data (hide the next paths)
    res.json({
      id: question.id,
      question: question.question,
      explanation: question.explanation,
      options: question.options.map((opt) => ({ answer: opt.answer })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific question by ID
router.get("/:questionId", async (req, res) => {
  try {
    const question = await Question.findOne({ id: req.params.questionId });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Return only relevant question data (hide the next paths)
    res.json({
      id: question.id,
      question: question.question,
      explanation: question.explanation,
      options: question.options.map((opt) => ({ answer: opt.answer })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
