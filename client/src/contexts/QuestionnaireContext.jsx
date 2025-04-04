// src/contexts/QuestionnaireContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as api from "../services/api";

const QuestionnaireContext = createContext();

const initialState = {
  sessionId: null,
  currentQuestion: null,
  answers: [],
  recommendations: [],
  isComplete: false,
  loading: false,
  error: null,
};

function questionnaireReducer(state, action) {
  switch (action.type) {
    case "SET_SESSION":
      return { ...state, sessionId: action.payload };
    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestion: action.payload };
    case "ADD_ANSWER":
      return {
        ...state,
        answers: [
          ...state.answers.filter(
            (a) => a.questionId !== action.payload.questionId
          ),
          action.payload,
        ],
      };
    case "SET_RECOMMENDATIONS":
      return { ...state, recommendations: action.payload };
    case "SET_COMPLETE":
      return { ...state, isComplete: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function QuestionnaireProvider({ children }) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);

  // Initialize session and fetch first question
  useEffect(() => {
    async function initializeQuestionnaire() {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const sessionResponse = await api.createSession();
        dispatch({ type: "SET_SESSION", payload: sessionResponse.sessionId });

        const firstQuestion = await api.getFirstQuestion();
        dispatch({ type: "SET_CURRENT_QUESTION", payload: firstQuestion });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }

    initializeQuestionnaire();
  }, []);

  // Submit answer and get next question
  const submitAnswer = async (questionId, answer) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Update local state first for UI responsiveness
      dispatch({ type: "ADD_ANSWER", payload: { questionId, answer } });

      // Submit to API and get next question
      const response = await api.submitAnswer(
        state.sessionId,
        questionId,
        answer
      );

      if (response.isComplete) {
        dispatch({ type: "SET_COMPLETE", payload: true });
        fetchRecommendations();
      } else {
        dispatch({
          type: "SET_CURRENT_QUESTION",
          payload: response.nextQuestion,
        });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Edit a previous answer
  const editAnswer = async (questionId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const question = await api.getQuestion(questionId);
      dispatch({ type: "SET_CURRENT_QUESTION", payload: question });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const recommendationsData = await api.getRecommendations(state.sessionId);
      dispatch({
        type: "SET_RECOMMENDATIONS",
        payload: recommendationsData.recommendations,
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        state,
        submitAnswer,
        editAnswer,
        fetchRecommendations,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  return useContext(QuestionnaireContext);
}
