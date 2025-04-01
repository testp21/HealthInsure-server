// services/recommendationService.js
const Plan = require("../models/plan");

class RecommendationService {
  async getRecommendations(answers) {
    // Extract key information from answers
    const userProfile = this.buildUserProfile(answers);

    // Fetch all plans
    const allPlans = await Plan.find({});

    // Score each plan based on user profile
    const scoredPlans = allPlans.map((plan) => {
      const score = this.calculateMatchScore(plan, userProfile);
      return {
        planId: plan.planId,
        name: plan.name,
        provider: plan.provider,
        premium: this.getPremiumForUser(plan, userProfile),
        coverage: plan.coverage,
        matchScore: score,
        highlights: this.getHighlights(plan, userProfile),
        bestFor: this.determineBestFeature(plan, userProfile),
      };
    });

    // Sort by match score (descending)
    scoredPlans.sort((a, b) => b.matchScore - a.matchScore);

    // Return top 3 recommendations
    return scoredPlans.slice(0, 3);
  }

  buildUserProfile(answers) {
    // Initialize with defaults
    const profile = {
      maritalStatus: null,
      ageRange: null,
      occupation: null,
      hasExistingPolicy: false,
      expectation: null,
      hasPreExistingConditions: false,
    };

    // Process each answer to build profile
    answers.forEach(({ questionId, answer }) => {
      if (questionId === "q1") {
        profile.maritalStatus = answer;
      } else if (questionId.includes("q2_")) {
        profile.ageRange = answer;
      } else if (questionId.includes("q3_")) {
        profile.occupation = answer;
      } else if (questionId.includes("q4_")) {
        profile.hasExistingPolicy = answer === "Yes";
      } else if (questionId.includes("q5_")) {
        profile.expectation = answer;
      } else if (questionId.includes("q6_")) {
        profile.hasPreExistingConditions = answer === "Yes";
      }
    });

    return profile;
  }

  calculateMatchScore(plan, userProfile) {
    let score = 0;
    const { matchCriteria } = plan;

    // Base score is 50
    score = 50;

    // Add points for matching criteria
    if (matchCriteria) {
      // Marital status match
      if (matchCriteria.maritalStatus === userProfile.maritalStatus) {
        score += 10;
      }

      // Age range match
      if (
        matchCriteria.ageRange &&
        matchCriteria.ageRange.includes(userProfile.ageRange)
      ) {
        score += 10;
      }

      // Occupation match
      if (
        matchCriteria.occupation &&
        matchCriteria.occupation.includes(userProfile.occupation)
      ) {
        score += 10;
      }

      // Expectation match (value, protection, balanced)
      if (matchCriteria.expectation === userProfile.expectation) {
        score += 15;
      }

      // Pre-existing conditions compatibility
      if (
        userProfile.hasPreExistingConditions &&
        matchCriteria.coversPreExisting
      ) {
        score += 15;
      }
    }

    // Adjust for plan suitability
    if (plan.suitableFor) {
      if (
        userProfile.occupation === "Student" &&
        plan.suitableFor.includes("students")
      ) {
        score += 10;
      }

      if (
        userProfile.expectation === "Value for Money" &&
        plan.suitableFor.includes("budget-conscious")
      ) {
        score += 10;
      }

      if (
        userProfile.expectation === "Best Protection" &&
        plan.suitableFor.includes("comprehensive-coverage")
      ) {
        score += 10;
      }
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  getPremiumForUser(plan, userProfile) {
    // If premium is a simple number, return it
    if (typeof plan.premium === "number") {
      return plan.premium;
    }

    // If premium varies by age range
    if (typeof plan.premium === "object") {
      // For single users
      if (userProfile.maritalStatus === "Single") {
        switch (userProfile.ageRange) {
          case "Below 30":
            return plan.premium.young || plan.premium.default;
          default:
            return plan.premium.default;
        }
      }
      // For married users
      else if (userProfile.maritalStatus === "Married") {
        switch (userProfile.ageRange) {
          case "30-35":
            return plan.premium.family || plan.premium.default;
          default:
            return plan.premium.default;
        }
      }
    }

    // Default fallback
    return plan.premium.default || 0;
  }

  getHighlights(plan, userProfile) {
    const highlights = [];

    // Add plan features as highlights
    if (plan.features && plan.features.length > 0) {
      highlights.push(...plan.features.slice(0, 2));
    }

    // Add user-specific highlights
    if (
      userProfile.occupation === "Student" &&
      plan.suitableFor.includes("students")
    ) {
      highlights.push("Designed for students");
    }

    if (
      userProfile.hasPreExistingConditions &&
      plan.matchCriteria.coversPreExisting
    ) {
      highlights.push("Covers pre-existing conditions");
    }

    if (
      userProfile.expectation === "Value for Money" &&
      plan.suitableFor.includes("budget-conscious")
    ) {
      highlights.push("Great value for money");
    }

    if (
      userProfile.expectation === "Best Protection" &&
      plan.coverage.preventive === "100%"
    ) {
      highlights.push("100% preventive care coverage");
    }

    return highlights.slice(0, 3); // Limit to 3 highlights
  }

  determineBestFeature(plan, userProfile) {
    // Determine the standout feature based on user preference
    if (
      userProfile.expectation === "Value for Money" &&
      plan.suitableFor.includes("budget-conscious")
    ) {
      return "Value for Money";
    }

    if (
      userProfile.expectation === "Best Protection" &&
      plan.suitableFor.includes("comprehensive-coverage")
    ) {
      return "Comprehensive Protection";
    }

    if (userProfile.expectation === "Balanced") {
      return "Balanced Coverage";
    }

    // Default to generic best feature
    if (plan.suitableFor && plan.suitableFor.length > 0) {
      return `Best for ${plan.suitableFor[0].replace("-", " ")}`;
    }

    return "General Coverage";
  }
}

module.exports = RecommendationService;
