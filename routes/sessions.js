// routes/sessions.js
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Session = require("../models/session");
const Question = require("../models/question");
const RecommendationService = require("../services/recommendationService");

// Create a new session
router.post("/", async (req, res) => {
  try {
    // Get first question
    const firstQuestion = await Question.findOne({ id: "q1" });
    if (!firstQuestion) {
      return res.status(404).json({ error: "First question not found" });
    }

    // Create session with 1 hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const session = new Session({
      sessionId: uuidv4(),
      currentQuestionId: firstQuestion.id,
      answers: [],
      expiresAt,
    });

    await session.save();

    res.status(201).json({
      sessionId: session.sessionId,
      startTime: session.startTime,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session info
router.get("/:sessionId", async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      return res.status(400).json({ error: "Session expired" });
    }

    res.json({
      sessionId: session.sessionId,
      currentQuestionId: session.currentQuestionId,
      answers: session.answers,
      progress: calculateProgress(session.answers.length),
      isComplete: session.isComplete,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit answer and get next question
router.post("/:sessionId/answers", async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const session = await Session.findOne({ sessionId: req.params.sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Validate session is not expired
    if (new Date() > session.expiresAt) {
      return res.status(400).json({ error: "Session expired" });
    }

    // Find current question
    const currentQuestion = await Question.findOne({ id: questionId });
    if (!currentQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Find the selected option
    const selectedOption = currentQuestion.options.find(
      (option) => option.answer === answer
    );

    if (!selectedOption) {
      return res.status(400).json({ error: "Invalid answer option" });
    }

    // Add answer to session
    session.answers.push({ questionId, answer });

    // Determine next question
    let nextQuestion = null;
    let isComplete = false;

    if (selectedOption.next) {
      // If next is a string (ID), fetch the question
      if (typeof selectedOption.next === "string") {
        nextQuestion = await Question.findOne({ id: selectedOption.next });
      }
      // If next is an object (nested question), use it directly
      else if (typeof selectedOption.next === "object") {
        nextQuestion = selectedOption.next;
      }

      session.currentQuestionId = nextQuestion.id;
    } else {
      // End of questions reached
      isComplete = true;
      session.isComplete = true;
    }

    await session.save();

    // Prepare response
    const response = {
      progress: calculateProgress(session.answers.length),
      isComplete,
    };

    if (nextQuestion) {
      response.nextQuestion = {
        id: nextQuestion.id,
        question: nextQuestion.question,
        explanation: nextQuestion.explanation,
        options: nextQuestion.options.map((opt) => ({ answer: opt.answer })),
      };
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recommendations based on answers
router.get("/:sessionId/recommendations", async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Get recommendations
    const recommendationService = new RecommendationService();
    const recommendations = await recommendationService.getRecommendations(
      session.answers
    );

    res.json({
      recommendations,
      isComplete: session.isComplete,
      answeredQuestions: session.answers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate progress (approx % of tree completed)
function calculateProgress(answersCount) {
  // Assuming average path length is 6 questions
  return Math.min(Math.round((answersCount / 6) * 100) / 100, 1);
}

module.exports = router;
