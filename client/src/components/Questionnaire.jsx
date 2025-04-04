// src/components/Questionnaire.js
import React from "react";
import { useQuestionnaire } from "../contexts/QuestionnaireContext";
import Question from "./question";
import AnswersSummary from "./AnswersSummary";
import Recommendations from "./Recommendations";

const Questionnaire = () => {
  const { state } = useQuestionnaire();
  const { loading, error } = state;

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h1>Health Insurance Finder</h1>
        <p>
          Answer a few questions to find the best health insurance plan for you
        </p>
      </div>

      <AnswersSummary />
      <Question />
      <Recommendations />

      {loading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
};

export default Questionnaire;
