import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getQuestions = async () => {
  const response = await axios.get(`${API_BASE_URL}/questions`);
  return response.data;
};

export const submitTest = async (userId: number, answers: Array<{question_id: number, option_id: number}>) => {
  const response = await axios.post(`${API_BASE_URL}/submit-test`, {
    user_id: userId,
    answers
  });
  return response.data;
};

export const getRecommendations = async (userId: number) => {
  const response = await axios.get(`${API_BASE_URL}/recommendations/${userId}`);
  return response.data;
};

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    email,
    password
  });
  return response.data;
};