// src/components/AnswersSummary.js
import React from "react";
import { useQuestionnaire } from "../contexts/QuestionnaireContext";

const AnswersSummary = () => {
  const { state, editAnswer } = useQuestionnaire();
  const { answers } = state;

  if (answers.length === 0) return null;

  return (
    <div className="answers-summary">
      <h3>Your Information</h3>
      <div className="answers-list">
        {answers.map((item, index) => (
          <div key={index} className="answer-item">
            <div className="answer-content">
              <span className="question-id">{item.questionId}</span>
              <span className="answer-value">{item.answer}</span>
            </div>
            <button
              className="edit-button"
              onClick={() => editAnswer(item.questionId)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswersSummary;
