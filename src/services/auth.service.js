import { apiFetch } from './api';

export const AuthService = {
  login(payload) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerPatient(payload) {
    return apiFetch('/auth/register/patient', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerDoctor(payload) {
    return apiFetch('/auth/register/doctor', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  registerClinic(payload) {
    return apiFetch('/auth/register/clinic', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
