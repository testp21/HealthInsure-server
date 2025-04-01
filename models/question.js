// models/question.js
const mongoose = require("mongoose");

// Options Schema - for question answers
const OptionSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },
  next: {
    type: mongoose.Schema.Types.Mixed, // Can be either a questionId string or a nested question object
    default: null,
  },
});

// Question Schema
const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  question: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  options: [OptionSchema],
});

module.exports = mongoose.model("Question", QuestionSchema);

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

// models/plan.js
const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  premium: {
    type: mongoose.Schema.Types.Mixed, // Can be a number or object with age ranges
    required: true,
  },
  deductible: Number,
  copay: Number,
  coverage: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  features: [String],
  suitableFor: [String],
  matchCriteria: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
});

module.exports = mongoose.model("Plan", PlanSchema);
