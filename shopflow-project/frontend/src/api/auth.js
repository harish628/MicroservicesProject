// src/api/auth.js — All API calls related to authentication

import apiClient from './client';

export const authApi = {
  register: (data) =>
    apiClient.post('/auth/register', data).then(res => res.data),

  login: (data) =>
    apiClient.post('/auth/login', data).then(res => res.data),

  getProfile: () =>
    apiClient.get('/auth/profile').then(res => res.data),
};
