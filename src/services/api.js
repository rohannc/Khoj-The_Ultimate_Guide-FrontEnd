import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 1. Request interceptor: Attach access token
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (accessToken && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// 2. Response interceptor: Catch 401 and refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // No refresh token: force logout
        handleClientLogout();
        return Promise.reject(error);
      }

      try {
        // Call backend refresh endpoint
        const res = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken,
        });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('authToken', newAccessToken); // backward compatibility
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        handleClientLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export function handleClientLogout() {
  const role = localStorage.getItem('userType')?.toLowerCase() || 'patient';
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = `/login/${role}`;
}

/**
 * apiFetch bridge to ensure 100% backward compatibility with all services
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : endpoint;
  const method = (options.method || 'GET').toLowerCase();
  
  let data = undefined;
  if (options.body) {
    try {
      data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    } catch {
      data = options.body;
    }
  }

  try {
    const response = await api({
      url,
      method,
      data,
      headers: options.headers,
    });
    return { response, data: response.data };
  } catch (error) {
    const status = error.response?.status;
    let msg = error.response?.data?.message;

    if (!msg) {
      if (status === 403) {
        msg = 'Access denied (403): You do not have permission to access this resource or your session has expired.';
      } else if (status === 401) {
        msg = 'Unauthorized (401): Please log in again to continue.';
      } else if (status === 404) {
        msg = error.message || 'Resource not found.';
      } else {
        msg = error.message || 'An unknown error occurred.';
      }
    }

    const err = new Error(msg);
    err.status = status;
    err.response = error.response;
    throw err;
  }
}

export default api;
