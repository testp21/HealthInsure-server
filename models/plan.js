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
