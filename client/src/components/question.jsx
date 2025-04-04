// src/components/Question.js
import React from "react";
import { useQuestionnaire } from "../contexts/QuestionnaireContext";

const Question = () => {
  const { state, submitAnswer } = useQuestionnaire();
  const { currentQuestion } = state;

  if (!currentQuestion) return null;

  return (
    <div className="question-container">
      <h2 className="question-title">{currentQuestion.question}</h2>

      <div className="question-explanation">
        <p>{currentQuestion.explanation}</p>
      </div>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => submitAnswer(currentQuestion.id, option.answer)}
          >
            {option.answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
