// scripts/initDb.js
const mongoose = require("mongoose");
const Question = require("../models/question");
const Plan = require("../models/plan");
require("dotenv").config();

// Sample question tree data
const questionTree = {
  id: "q1",
  question: "What is your marital status?",
  explanation:
    "Determining your marital status helps us decide whether to recommend an individual or a family plan.",
  options: [
    {
      answer: "Single",
      next: {
        id: "q2_single",
        question: "What is your age range?",
        explanation:
          "Your age affects premium rates and eligibility for various plans.",
        options: [
          {
            answer: "Below 30",
            next: {
              id: "q3_single",
              question: "What is your occupation?",
              // This would continue with the full tree...
              // Truncated for brevity
            },
          },
        ],
      },
    },
    {
      answer: "Married",
      next: {
        id: "q2_married",
        question: "What is your age range?",
        // This would continue with the full tree...
        // Truncated for brevity
      },
    },
  ],
};

// Sample plans data
const samplePlans = [
  {
    planId: "basic-single-student",
    name: "Student Basic Health Plan",
    provider: "HealthCo",
    premium: {
      young: 199,
      default: 249,
    },
    deductible: 1000,
    copay: 20,
    coverage: {
      outpatient: "80%",
      inpatient: "90%",
      preventive: "100%",
    },
    features: ["Telemedicine", "Wellness programs"],
    suitableFor: ["students", "budget-conscious", "young-adults"],
    matchCriteria: {
      maritalStatus: "Single",
      ageRange: ["Below 30"],
      occupation: ["Student"],
      expectation: "Value for Money",
      coversPreExisting: false,
    },
  },
  {
    planId: "premium-single-professional",
    name: "Professional Premium Health Plan",
    provider: "MediPlus",
    premium: {
      young: 299,
      default: 349,
    },
    deductible: 500,
    copay: 15,
    coverage: {
      outpatient: "90%",
      inpatient: "95%",
      preventive: "100%",
      dental: "70%",
      vision: "70%",
    },
    features: ["Comprehensive specialist network", "Low deductible"],
    suitableFor: ["working-professionals", "comprehensive-coverage"],
    matchCriteria: {
      maritalStatus: "Single",
      ageRange: ["Below 30"],
      occupation: ["Working Professional"],
      expectation: "Best Protection",
      coversPreExisting: true,
    },
  },
  {
    planId: "family-basic",
    name: "Family Essential Plan",
    provider: "FamilyCare",
    premium: {
      family: 499,
      default: 599,
    },
    deductible: 1500,
    copay: 25,
    coverage: {
      outpatient: "85%",
      inpatient: "90%",
      preventive: "100%",
      maternity: "80%",
    },
    features: ["Family coverage", "Maternity benefits"],
    suitableFor: ["families", "balanced-coverage"],
    matchCriteria: {
      maritalStatus: "Married",
      ageRange: ["30-35"],
      expectation: "Balanced",
      coversPreExisting: false,
    },
  },
];

// Function to flatten the nested question tree
function flattenQuestionTree(question) {
  const questions = [];

  // Add current question
  questions.push({
    id: question.id,
    question: question.question,
    explanation: question.explanation,
    options: question.options.map((option) => {
      // Create a new option object
      const newOption = {
        answer: option.answer,
      };

      // If next is an object (nested question), extract its ID
      if (option.next && typeof option.next === "object") {
        const nestedQuestions = flattenQuestionTree(option.next);
        questions.push(...nestedQuestions);
        newOption.next = option.next.id;
      } else {
        newOption.next = option.next;
      }

      return newOption;
    }),
  });

  return questions;
}

// Connect to database and initialize
async function initDb() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost/insurance-recommender"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Question.deleteMany({});
    await Plan.deleteMany({});

    // Flatten question tree
    const flattenedQuestions = flattenQuestionTree(questionTree);

    // Insert questions
    await Question.insertMany(flattenedQuestions);
    console.log(`Inserted ${flattenedQuestions.length} questions`);

    // Insert plans
    await Plan.insertMany(samplePlans);
    console.log(`Inserted ${samplePlans.length} plans`);

    console.log("Database initialization complete");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

initDb();
