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
