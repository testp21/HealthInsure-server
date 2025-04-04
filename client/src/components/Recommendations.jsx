// src/components/Recommendations.js
import React from "react";
import { useQuestionnaire } from "../contexts/QuestionnaireContext";

const Recommendations = () => {
  const { state } = useQuestionnaire();
  const { recommendations, isComplete } = state;

  if (!isComplete) return null;

  return (
    <div className="recommendations-container">
      <h2>Recommended Health Insurance Plans</h2>

      <div className="recommendations-list">
        {recommendations.map((plan, index) => (
          <div key={index} className="plan-card">
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <span className="provider">{plan.provider}</span>
              <span className="match-score">{plan.matchScore}% Match</span>
            </div>

            <div className="plan-details">
              <p className="premium">
                <strong>Monthly Premium:</strong> ${plan.premium}
              </p>

              <div className="coverage-details">
                <h4>Coverage</h4>
                <ul>
                  <li>Outpatient: {plan.coverage.outpatient}</li>
                  <li>Inpatient: {plan.coverage.inpatient}</li>
                  <li>Preventive: {plan.coverage.preventive}</li>
                </ul>
              </div>

              <div className="plan-highlights">
                <h4>Highlights</h4>
                <ul>
                  {plan.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div className="best-for">
                <span>{plan.bestFor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
