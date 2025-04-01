// models/session.js
const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  currentQuestionId: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionId: String,
      answer: String,
    },
  ],
  startTime: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
