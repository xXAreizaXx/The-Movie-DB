import { ENV } from '@core/config/env';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: ENV.TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ENV.TMDB_API_TOKEN}`,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }
    return Promise.reject(error);
  },
);
