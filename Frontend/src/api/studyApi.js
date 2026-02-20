import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const studyApi = {
  createUser: () => api.post('/users'),
  createGoal: (goalData) => api.post('/goals', goalData),
  getGoal: (goalId) => api.get(`/goals/${goalId}`),
  getUserGoals: (userId) => api.get(`/goals/user/${userId}`),
  deleteGoal: (goalId) => api.delete(`/goals/${goalId}`),
  generatePlan: (goalId) => api.post(`/plans/goal/${goalId}`),
  getPlan: (planId) => api.get(`/plans/${planId}`),
  getLatestPlan: (goalId) => api.get(`/plans/goal/${goalId}/latest`),
};

export default studyApi;
