// src/stores/auth.js
import { defineStore } from 'pinia';
import { isTokenExpired } from '@/utils/jwt';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Initial state is always null
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => {
      return !!state.token && !!state.user && !isTokenExpired(state.token);
    },
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    login(userData, authToken, refreshToken = null) {
      this.user = userData;
      this.token = authToken;
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('accessToken', authToken);
      localStorage.setItem('authToken', authToken); // backward compatibility
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      if (userData?.userId) {
        localStorage.setItem('userId', userData.userId);
      }
      if (userData?.role) {
        localStorage.setItem('userType', userData.role.toUpperCase());
      }
    },

    updateUser(partialData) {
      this.user = { ...(this.user || {}), ...partialData };
      localStorage.setItem('authUser', JSON.stringify(this.user));
    },

    async logout() {
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        if (refreshToken) {
          const { default: api } = await import('@/services/api');
          await api.post('/auth/logout', { refreshToken });
        }
      } catch (err) {
        console.warn('Backend logout notification error:', err);
      } finally {
        // Clear Pinia state
        this.user = null;
        this.token = null;

        // Wipe all localStorage keys
        localStorage.clear();

        // Wipe sessionStorage too
        sessionStorage.clear();

        // Clear any cookies set for this domain
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }
    },

    /**
     * Check for a persisted session on app load.
     */
    checkAuth() {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      const userString = localStorage.getItem('authUser');

      if (token && userString && !isTokenExpired(token)) {
        this.token = token;
        this.user = JSON.parse(userString);
      } else if (localStorage.getItem('refreshToken')) {
        // If access token is expired but refresh token exists, restore user and let Axios interceptor refresh on next request
        if (userString) {
          this.user = JSON.parse(userString);
          this.token = token;
        }
      } else {
        // No valid token or refresh token
        this.logout();
      }
    },
  },
});
