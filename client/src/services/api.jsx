// src/services/api.js
import axios from "axios";

const BASE_URL = "/api";

export const createSession = async () => {
  const response = await axios.post(`${BASE_URL}/sessions`);
  return response.data;
};

export const getFirstQuestion = async () => {
  const response = await axios.get(`${BASE_URL}/questions/first`);
  return response.data;
};

export const getQuestion = async (questionId) => {
  const response = await axios.get(`${BASE_URL}/questions/${questionId}`);
  return response.data;
};

export const submitAnswer = async (sessionId, questionId, answer) => {
  const response = await axios.post(
    `${BASE_URL}/sessions/${sessionId}/answers`,
    {
      questionId,
      answer,
    }
  );
  return response.data;
};

export const getRecommendations = async (sessionId) => {
  const response = await axios.get(
    `${BASE_URL}/sessions/${sessionId}/recommendations`
  );
  return response.data;
};
