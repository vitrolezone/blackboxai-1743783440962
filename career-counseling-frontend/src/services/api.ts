import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add request interceptor to include JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // TODO: Implement token refresh logic
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  localStorage.setItem('access_token', response.data.access_token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const getQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const submitTest = async (answers: Array<{question_id: number, option_id: number}>) => {
  const response = await api.post('/submit-test', { answers });
  return response.data;
};

export const getRecommendations = async (userId: number) => {
  const response = await api.get(`/recommendations/${userId}`);
  return response.data;
};

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await api.post('/register', {
    username,
    email,
    password
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/protected');
  return response.data;
};
