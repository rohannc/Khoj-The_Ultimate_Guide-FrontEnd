import axios from 'axios';

export const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL ||
  'https://khoj-the-ultimate-guide.onrender.com'
).replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// 1. Request interceptor: Attach access token & proactive expiry refresh
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const url = config.url || '';
  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');

  // If token is expired and we have a refreshToken, proactively refresh before sending
  if (!isAuthEndpoint && refreshToken) {
    const { isTokenExpired } = await import('@/utils/jwt');
    if (!accessToken || isTokenExpired(accessToken)) {
      try {
        const refreshRes = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshRes.data;
        if (newAccessToken) {
          accessToken = newAccessToken;
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('authToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          try {
            const { useAuthStore } = await import('@/stores/auth');
            const authStore = useAuthStore();
            authStore.token = newAccessToken;
          } catch { /* ignore */ }
        }
      } catch (err) {
        console.warn('Proactive token refresh attempt failed:', err);
        // If refresh token was rejected (e.g. 401/400) or failed, force clean logout to login page
        handleClientLogout();
        return Promise.reject(err);
      }
    }
  }

  if (accessToken) {
    config.headers = config.headers || {};
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
    const url = originalRequest.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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
        const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('authToken', newAccessToken); // backward compatibility
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        try {
          const { useAuthStore } = await import('@/stores/auth');
          const authStore = useAuthStore();
          authStore.token = newAccessToken;
        } catch { /* ignore */ }

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
  let role = 'patient';
  try {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const parsed = JSON.parse(authUser);
      if (parsed?.role) {
        role = parsed.role.toLowerCase();
      }
    }
  } catch { /* ignore parse error */ }

  if (!role || role === 'patient') {
    const userType = localStorage.getItem('userType')?.toLowerCase();
    if (userType) {
      role = userType;
    } else if (window.location.pathname.includes('/doctor')) {
      role = 'doctor';
    } else if (window.location.pathname.includes('/clinic')) {
      role = 'clinic';
    }
  }

  // Clear storage and cookies
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });

  // Navigate to corresponding login page
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
