import axios from 'axios';

// Get the backend URL from environment variables, with a fallback for local development
const API_URL = import.meta.env.VUE_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startInterview = (data) => {
  return apiClient.post('/api/v1/interview/start', data);
};

export const nextQuestion = (data) => {
  return apiClient.post('/api/v1/interview/next', data);
};

export const endInterview = (data) => {
    return apiClient.post('/api/v1/interview/end', data);
};

// 增强版面试API
export const enhancedStartInterview = (data) => {
  return apiClient.post('/api/v1/interview/enhanced-start', data);
};

export const enhancedNextQuestion = (data) => {
  return apiClient.post('/api/v1/interview/enhanced-next', data);
};

// 高级AI面试官API
export const advancedStartInterview = (data) => {
  return apiClient.post('/api/v1/interview/advanced-start', data);
};

export const advancedNextQuestion = (data) => {
  return apiClient.post('/api/v1/interview/advanced-next', data);
};