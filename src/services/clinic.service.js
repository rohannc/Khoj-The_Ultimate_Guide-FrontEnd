import api from './api';

export const ClinicService = {
  /**
   * Fetch complete aggregated clinic dashboard
   * @param {string} clinicId 
   */
  async getClinicDashboard(clinicId) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.get(`/clinics/${clinicId}/dashboard`);
    return response.data;
  },

  /**
   * Fetch all registered clinics
   */
  async getAllClinics() {
    const response = await api.get('/clinics');
    return response.data;
  },

  /**
   * Fetch clinic by ID
   * @param {string} clinicId 
   */
  async getClinicById(clinicId) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.get(`/clinics/${clinicId}`);
    return response.data;
  },

  /**
   * Fetch clinic by Name
   * @param {string} name 
   */
  async getClinicByName(name) {
    if (!name) throw new Error('Clinic Name is required');
    const response = await api.get('/clinics/search/by-name', {
      params: { name }
    });
    return response.data;
  },

  /**
   * Fetch clinic by Email
   * @param {string} email 
   */
  async getClinicByEmail(email) {
    if (!email) throw new Error('Clinic Email is required');
    const response = await api.get('/clinics/search/by-email', {
      params: { email }
    });
    return response.data;
  },

  /**
   * Update clinic profile
   * @param {string} clinicId 
   * @param {object} payload 
   */
  async updateClinic(clinicId, payload) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.put(`/clinics/${clinicId}`, payload);
    return response.data;
  },

  /**
   * Update clinic password
   * @param {string} clinicId 
   * @param {string} newPassword 
   */
  async updatePassword(clinicId, newPassword) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.patch(`/clinics/${clinicId}/password`, null, {
      params: { newPassword }
    });
    return response.data;
  },

  /**
   * Fetch clinic registered patients
   * @param {string} clinicId 
   */
  async getClinicPatients(clinicId) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.get(`/clinics/${clinicId}/patients`);
    return response.data;
  },

  /**
   * Fetch clinic appointments
   * @param {string} clinicId 
   */
  async getClinicAppointments(clinicId) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.get(`/appointments/clinic/${clinicId}`);
    return response.data;
  },

  /**
   * Fetch clinic appointments for a specific date (YYYY-MM-DD)
   * @param {string} clinicId 
   * @param {string} date 
   */
  async getClinicAppointmentsOnDate(clinicId, date) {
    if (!clinicId || !date) throw new Error('Clinic ID and date are required');
    const response = await api.get(`/appointments/clinic/${clinicId}/date`, {
      params: { date }
    });
    return response.data;
  },

  /**
   * Update appointment status or token
   * @param {string} appointmentId 
   * @param {object} payload - { status, tokenNumber, reason, appointmentDate, appointmentTime }
   */
  async updateAppointment(appointmentId, payload) {
    if (!appointmentId) throw new Error('Appointment ID is required');
    const response = await api.put(`/appointments/${appointmentId}`, payload);
    return response.data;
  },

  /**
   * Fetch affiliations for this clinic
   * @param {string} clinicId 
   */
  async getClinicAffiliations(clinicId) {
    if (!clinicId) throw new Error('Clinic ID is required');
    const response = await api.get(`/affiliations/clinic/${clinicId}`);
    return response.data;
  },

  /**
   * Update affiliation (approve/reject/update terms)
   * @param {object} payload - { affiliationId, statusAction, charge, joiningDate, shiftDetails, patientLimits }
   */
  async updateAffiliation(payload) {
    const response = await api.put('/affiliations/update', payload);
    return response.data;
  },

  /**
   * Request affiliation with a doctor
   * @param {object} payload - { targetId, charge, patientLimits, shiftDetails, joiningDate }
   */
  async createAffiliationRequest(payload) {
    const response = await api.post('/affiliations/request', payload);
    return response.data;
  }
};

export default ClinicService;
