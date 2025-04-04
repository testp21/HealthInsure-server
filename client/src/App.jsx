// src/App.js
import React from "react";
import { QuestionnaireProvider } from "./contexts/QuestionnaireContext";
import Questionnaire from "./components/Questionnaire";
import "./App.css";

function App() {
  return (
    <QuestionnaireProvider>
      <div className="app">
        <Questionnaire />
      </div>
    </QuestionnaireProvider>
  );
}

export default App;
