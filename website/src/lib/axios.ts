// src/lib/axios.ts
import axios from 'axios';

// Create a pre-configured axios instance
export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // change this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: add interceptors for requests/responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
