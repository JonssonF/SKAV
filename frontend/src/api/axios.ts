import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:7103/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR — körs innan varje request skickas
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR — körs när ett svar kommer tillbaka
apiClient.interceptors.response.use(
  // Lyckade svar (2xx) — skicka vidare som vanligt
  (response) => response,

  // Fel — fånga och hantera centralt
  (error) => {
    if (error.response?.status === 401) {
      // Token ogiltig eller utgången — rensa och skicka till login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;