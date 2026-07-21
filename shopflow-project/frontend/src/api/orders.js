// src/api/orders.js — All API calls related to orders and payments

import apiClient from './client';

export const ordersApi = {
  create: (data) =>
    apiClient.post('/orders', data).then(res => res.data),

  getMyOrders: () =>
    apiClient.get('/orders/my-orders').then(res => res.data),

  getById: (id) =>
    apiClient.get(`/orders/${id}`).then(res => res.data),

  cancel: (id) =>
    apiClient.put(`/orders/${id}/cancel`).then(res => res.data),
};

export const paymentsApi = {
  process: (data) =>
    apiClient.post('/payments', data).then(res => res.data),
};
