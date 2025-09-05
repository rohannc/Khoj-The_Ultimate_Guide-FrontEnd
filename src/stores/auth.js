// src/stores/auth.js
import { defineStore } from 'pinia';

// Helper function to parse JWT and check expiration
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decodedPayload = JSON.parse(decodedJson);
    const expirationTime = decodedPayload.exp * 1000;
    return Date.now() > expirationTime;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return true;
  }
}

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
    login(userData, authToken) {
      this.user = userData;
      this.token = authToken;
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', authToken);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      // IMPORTANT: The component that calls logout is responsible for redirection.
    },

    /**
     * NEW and CRITICAL action to check for a persisted session on app load.
     * Call this once in your main.js file.
     */
    checkAuth() {
      const token = localStorage.getItem('authToken');
      const userString = localStorage.getItem('authUser');

      if (token && userString && !isTokenExpired(token)) {
        this.token = token;
        this.user = JSON.parse(userString);
      } else {
        // If the token is invalid or expired, ensure everything is cleared.
        this.logout();
      }
    },
  },
});
