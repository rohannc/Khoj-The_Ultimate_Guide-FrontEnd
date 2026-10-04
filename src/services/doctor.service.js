import api from './api';

export const DoctorService = {
  /**
   * Fetch complete aggregated doctor dashboard
   * @param {string} doctorId 
   */
  async getDoctorDashboard(doctorId) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.get(`/doctors/${doctorId}/dashboard`);
    return response.data;
  },

  /**
   * Fetch doctor by username
   * @param {string} username
   */
  async getDoctorByUsername(username) {
    if (!username) throw new Error('Username is required');
    const response = await api.get('/doctors/search/by-username', {
      params: { username }
    });
    return response.data;
  },

  /**
   * Fetch doctor profile by ID
   * @param {string} doctorId 
   */
  async getDoctorById(doctorId) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  /**
   * Fetch doctor's patients
   * @param {string} doctorId 
   */
  async getDoctorPatients(doctorId) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.get(`/doctors/${doctorId}/patients`);
    return response.data;
  },

  /**
   * Fetch doctor appointments
   * @param {string} doctorId 
   */
  async getDoctorAppointments(doctorId) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },

  /**
   * Fetch doctor appointments for a specific date (YYYY-MM-DD)
   * @param {string} doctorId 
   * @param {string} date 
   */
  async getDoctorAppointmentsOnDate(doctorId, date) {
    if (!doctorId || !date) throw new Error('Doctor ID and Date are required');
    const response = await api.get(`/appointments/doctor/${doctorId}/date`, {
      params: { date }
    });
    return response.data;
  },

  /**
   * Fetch doctor affiliations
   * @param {string} doctorId 
   * @param {string} [status] - Optional filter: PENDING, APPROVED, REJECTED
   */
  async getDoctorAffiliations(doctorId, status = null) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const params = {};
    if (status) params.status = status;
    const response = await api.get(`/affiliations/doctor/${doctorId}`, { params });
    return response.data;
  },

  /**
   * Fetch doctor issued prescriptions
   * @param {string} doctorId 
   */
  async getDoctorPrescriptions(doctorId) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.get(`/prescriptions/doctor/${doctorId}`);
    return response.data;
  },

  /**
   * Fetch patient prescriptions
   * @param {string} patientId 
   */
  async getPatientPrescriptions(patientId) {
    if (!patientId) throw new Error('Patient ID is required');
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  },

  /**
   * Add an individual medication for a patient
   * @param {object} payload - { patientId, medicationName, dosage, frequency, startedAt, durationValue, durationUnit, instructions, isActive }
   */
  async addPrescription(payload) {
    const response = await api.post('/prescriptions', payload);
    return response.data;
  },

  /**
   * Update an individual medication
   * @param {string} prescriptionId 
   * @param {object} payload - { medicationName, dosage, frequency, startedAt, durationValue, durationUnit, instructions, isActive }
   */
  async updatePrescription(prescriptionId, payload) {
    if (!prescriptionId) throw new Error('Prescription ID is required');
    const response = await api.put(`/prescriptions/${prescriptionId}`, payload);
    return response.data;
  },

  /**
   * Delete an individual medication
   * @param {string} prescriptionId 
   */
  async deletePrescription(prescriptionId) {
    if (!prescriptionId) throw new Error('Prescription ID is required');
    const response = await api.delete(`/prescriptions/${prescriptionId}`);
    return response.data;
  },

  /**
   * Discontinue an individual medication
   * @param {string} prescriptionId 
   * @param {string} reason 
   */
  async discontinuePrescription(prescriptionId, reason = '') {
    if (!prescriptionId) throw new Error('Prescription ID is required');
    const response = await api.patch(`/prescriptions/${prescriptionId}/discontinue`, { reason });
    return response.data;
  },

  /**
   * Update doctor profile details
   * @param {string} doctorId 
   * @param {object} payload 
   */
  async updateDoctorProfile(doctorId, payload) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.put(`/doctors/${doctorId}`, payload);
    return response.data;
  },

  /**
   * Update doctor password
   * @param {string} doctorId 
   * @param {object} payload - { currentPassword, newPassword }
   */
  async updateDoctorPassword(doctorId, payload) {
    if (!doctorId) throw new Error('Doctor ID is required');
    const response = await api.patch(`/doctors/${doctorId}/password`, payload);
    return response.data;
  },

  /**
   * Respond to or update affiliation
   * @param {object} payload - { affiliationId, statusAction, charge, joiningDate, ... }
   */
  async updateAffiliation(payload) {
    const response = await api.put('/affiliations/update', payload);
    return response.data;
  },

  /**
   * Update appointment status or details
   * @param {string} appointmentId 
   * @param {object} payload 
   */
  async updateAppointment(appointmentId, payload) {
    if (!appointmentId) throw new Error('Appointment ID is required');
    const response = await api.put(`/appointments/${appointmentId}`, payload);
    return response.data;
  },

  /**
   * Send new affiliation request
   * @param {object} payload - { targetId, joiningDate, shiftDetails, charge, patientLimits }
   */
  async createAffiliationRequest(payload) {
    const response = await api.post('/affiliations/request', payload);
    return response.data;
  }
};
