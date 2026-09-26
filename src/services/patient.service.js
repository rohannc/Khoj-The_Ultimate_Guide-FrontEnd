import { apiFetch } from './api';

export const PatientService = {
  _resolvedPatientId: null,

  /**
   * Helper to resolve the correct patient ID (caching across calls)
   */
  async resolvePatientId(patientId, username = null) {
    if (this._resolvedPatientId) return this._resolvedPatientId;
    if (!patientId && !username) return null;

    // Test if provided patientId works directly
    if (patientId) {
      try {
        const testRes = await apiFetch(`/patients/${patientId}`);
        if (testRes?.data?.id) {
          this._resolvedPatientId = testRes.data.id;
          return this._resolvedPatientId;
        }
      } catch (err) {
        // If 404 or 403, proceed to search by username
        const isIgnorable = err.status === 404 || err.status === 403 || (err.message && err.message.toLowerCase().includes('not found'));
        if (!isIgnorable) {
          this._resolvedPatientId = patientId;
          return patientId;
        }
      }
    }

    // Resolve via username if 404/403 or missing
    if (username) {
      try {
        const searchRes = await apiFetch(`/patients/search/by-username?username=${encodeURIComponent(username)}`);
        if (searchRes?.data?.id) {
          this._resolvedPatientId = searchRes.data.id;
          return this._resolvedPatientId;
        }
      } catch (searchErr) {
        console.warn('Patient resolution via username failed:', searchErr);
      }
    }

    this._resolvedPatientId = patientId;
    return patientId;
  },

  /**
   * Fetch health records for the current patient
   */
  async getHealthRecords(patientId, username = null) {
    const id = await this.resolvePatientId(patientId, username);
    if (!id) return [];
    try {
      const res = await apiFetch(`/health-records/patient/${id}`);
      const rawRecords = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      return this.transformHealthRecords(rawRecords);
    } catch (err) {
      console.warn('Failed to fetch health records directly:', err);
      // Fallback seamlessly to dashboard data if direct endpoint returns 403 or 404
      if (err.status === 403 || err.status === 404) {
        const dash = await this.getDashboardData(id, username);
        return dash.healthRecords || [];
      }
      throw err;
    }
  },

  /**
   * Fetch appointments for the current patient
   */
  async getAppointments(patientId, username = null) {
    const id = await this.resolvePatientId(patientId, username);
    if (!id) return [];
    try {
      const res = await apiFetch(`/appointments/patient/${id}`);
      const rawList = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      return this.transformAppointments(null, rawList);
    } catch (err) {
      console.warn('Failed to fetch appointments directly:', err);
      // Fallback seamlessly to dashboard data if direct endpoint returns 403 or 404
      if (err.status === 403 || err.status === 404) {
        const dash = await this.getDashboardData(id, username);
        return dash.upcomingAppointments || [];
      }
      throw err;
    }
  },

  /**
   * Fetch prescriptions for the current patient
   */
  async getPrescriptions(patientId, username = null) {
    const id = await this.resolvePatientId(patientId, username);
    if (!id) return [];
    try {
      const res = await apiFetch(`/prescriptions/patient/${id}`);
      const rawList = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      return this.transformPrescriptions(rawList);
    } catch (err) {
      console.warn('Failed to fetch prescriptions directly:', err);
      // Fallback seamlessly to dashboard data if direct endpoint returns 403 or 404
      if (err.status === 403 || err.status === 404) {
        const dash = await this.getDashboardData(id, username);
        return dash.activePrescriptions || [];
      }
      throw err;
    }
  },

  /**
   * Fetch notifications for a user
   * GET /api/notifications/user/{userId}
   */
  async getNotifications(userId, username = null) {
    const id = await this.resolvePatientId(userId, username);
    if (!id) return [];
    try {
      const res = await apiFetch(`/notifications/user/${id}`);
      const rawList = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      return rawList.map(n => ({
        id: n.id,
        title: n.title || 'Notification',
        message: n.message || '',
        type: n.type || 'INFO',
        isRead: Boolean(n.isRead),
        createdAt: n.createdAt,
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'
      }));
    } catch (err) {
      console.warn('Failed to fetch notifications directly:', err);
      if (err.status === 403 || err.status === 404) {
        const dash = await this.getDashboardData(id, username);
        return (dash.notifications || []).map(n => ({
          ...n,
          isRead: Boolean(n.isRead),
          time: n.createdAt ? new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'
        }));
      }
      return [];
    }
  },

  /**
   * Mark a notification as read
   * PUT /api/notifications/{id}/read
   */
  async markNotificationAsRead(notificationId) {
    if (!notificationId) return false;
    try {
      await apiFetch(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      return true;
    } catch (err) {
      console.warn(`Failed to mark notification ${notificationId} as read:`, err);
      // Also try direct fetch fallback with bearer token
      try {
        const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        const res = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        return res.ok;
      } catch (directErr) {
        console.warn('Direct fetch markAsRead error:', directErr);
      }
      return false;
    }
  },

  /**
   * Transform backend VitalDTO list to the format expected by VitalsWidget
   */
  transformVitals(recentVitals = []) {
    if (!recentVitals || recentVitals.length === 0) return [];
    
    // Take the most recent vital entry (they are ordered chronologically descending)
    const latest = recentVitals[0];
    const vitalsList = [];

    if (latest.systolicBp && latest.diastolicBp) {
      vitalsList.push({
        type: 'bp',
        label: 'Blood Pressure',
        value: `${latest.systolicBp}/${latest.diastolicBp}`,
        unit: 'mmHg',
        trend: 'stable'
      });
    }

    if (latest.heartRate != null) {
      vitalsList.push({
        type: 'hr',
        label: 'Heart Rate',
        value: `${latest.heartRate}`,
        unit: 'bpm',
        trend: 'stable'
      });
    }

    if (latest.temperature != null) {
      vitalsList.push({
        type: 'temp',
        label: 'Temperature',
        value: `${latest.temperature}`,
        unit: '°F',
        trend: 'stable'
      });
    }

    if (latest.weight != null) {
      vitalsList.push({
        type: 'weight',
        label: 'Weight',
        value: `${latest.weight}`,
        unit: 'kg',
        trend: 'stable'
      });
    }

    if (latest.heightCm != null) {
      vitalsList.push({
        type: 'height',
        label: 'Height',
        value: `${latest.heightCm}`,
        unit: 'cm',
        trend: 'stable'
      });
    }

    if (latest.bmi != null) {
      vitalsList.push({
        type: 'bmi',
        label: 'BMI',
        value: `${latest.bmi}`,
        unit: 'kg/m²',
        trend: 'stable'
      });
    }

    return vitalsList;
  },

  /**
   * Transform immediateAppointment (object) or upcomingAppointments (array) into the widget format
   */
  transformAppointments(immediateAppointment, upcomingAppointments = null) {
    const formatTime = (time) => {
      if (!time || time === 'N/A' || time === 'null') return 'Unassigned';
      return time;
    };

    const formatToken = (token) => {
      if (token == null || token === '' || token === 'null') return 'Unallocated';
      // Strip any existing '#' prefixes if present, and return the clean token value
      const cleanToken = String(token).trim().replace(/^#+/, '');
      return cleanToken || 'Unallocated';
    };

    if (Array.isArray(upcomingAppointments) && upcomingAppointments.length > 0) {
      return upcomingAppointments.map(apt => {
        const specialty = Array.isArray(apt.doctorSpecialization)
          ? apt.doctorSpecialization.join(', ')
          : (apt.doctorSpecialization || 'General Physician');
        return {
          id: apt.id,
          doctorName: apt.doctorFullName || apt.doctorName || 'Doctor',
          specialty: specialty,
          clinicName: apt.clinicName || '',
          date: apt.appointmentDate || 'N/A',
          time: formatTime(apt.appointmentTime),
          tokenNumber: formatToken(apt.tokenNumber ?? apt.token ?? apt.queueNumber),
          reason: apt.reason || '',
          status: apt.status || 'SCHEDULED'
        };
      });
    }

    if (!immediateAppointment) return [];

    const specialty = Array.isArray(immediateAppointment.doctorSpecialization)
      ? immediateAppointment.doctorSpecialization.join(', ')
      : (immediateAppointment.doctorSpecialization || 'General Physician');

    return [
      {
        id: immediateAppointment.id,
        doctorName: immediateAppointment.doctorFullName || immediateAppointment.doctorName || 'Doctor',
        specialty: specialty,
        clinicName: immediateAppointment.clinicName || '',
        date: immediateAppointment.appointmentDate || 'N/A',
        time: formatTime(immediateAppointment.appointmentTime),
        tokenNumber: formatToken(immediateAppointment.tokenNumber ?? immediateAppointment.token ?? immediateAppointment.queueNumber),
        reason: immediateAppointment.reason || '',
        status: immediateAppointment.status || 'SCHEDULED'
      }
    ];
  },

  /**
   * Transform activePrescriptions
   */
  transformPrescriptions(activePrescriptions = []) {
    return (activePrescriptions || []).map(p => ({
      id: p.id,
      name: p.medicationName || p.name || 'Medication',
      dosage: p.dosage || '',
      frequency: p.frequency || '',
      durationDays: p.durationDays,
      durationValue: p.durationValue ?? p.duration ?? p.durationDays ?? null,
      durationUnit: p.durationUnit ?? (p.durationDays ? 'DAY' : null),
      startedAt: p.startedAt ?? null,
      endDate: p.endDate ?? null,
      doctorName: p.doctorName || '',
      issuedAt: p.issuedAt
    }));
  },

  /**
   * Log or update medication start date
   * PATCH /api/prescriptions/:id/start-date
   * Body: { startedAt: YYYY-MM-DD }
   * Returns: updated prescription or object containing recomputed endDate
   */
  async logPrescriptionStartDate(prescriptionId, startDate) {
    if (!prescriptionId || !startDate) return null;
    
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('authToken');

    // 1. Primary: Direct fetch to /api/prescriptions/${prescription.id}/start-date
    try {
      const response = await fetch(`http://localhost:8080/api/prescriptions/${prescriptionId}/start-date`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startedAt: startDate })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.warn('Direct fetch to start-date failed, trying apiFetch wrapper:', err);
    }

    // 2. Secondary fallback via apiFetch wrapper (in case baseURL or interceptors differ)
    try {
      const res = await apiFetch(`/prescriptions/${prescriptionId}/start-date`, {
        method: 'PATCH',
        body: { startedAt: startDate }
      });
      if (res?.data) return res.data;
    } catch (err) {
      console.warn(`apiFetch PATCH /prescriptions/${prescriptionId}/start-date failed:`, err);
    }

    return { id: prescriptionId, startedAt: startDate };
  },

  /**
   * Transform recentHealthRecords
   */
  transformHealthRecords(recentHealthRecords = []) {
    return (recentHealthRecords || []).map(r => ({
      id: r.id,
      documentTitle: r.documentTitle || 'Health Record',
      documentType: r.documentType || 'Document',
      documentUrl: r.documentUrl || '',
      testDate: r.testDate || 'N/A',
      uploadedAt: r.uploadedAt
    }));
  },
  
  /**
   * Fetch all dashboard data in a single API call with automatic ID resolution
   */
  async getDashboardData(patientId, username = null) {
    if (!patientId && !username) throw new Error("No patient ID or username provided");
    
    let resolvedPatientId = await this.resolvePatientId(patientId, username);

    try {
      let dashboardRes = await apiFetch(`/patients/${resolvedPatientId}/dashboard`);

      const data = dashboardRes?.data || {};

      return {
        // Patient Personal Info
        patientId: data.patientId,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        primaryMobile: data.primaryMobile || '',
        emailId: data.emailId || '',

        // Widgets
        vitals: this.transformVitals(data.recentVitals),
        upcomingAppointments: this.transformAppointments(data.immediateAppointment, data.upcomingAppointments),
        activePrescriptions: this.transformPrescriptions(data.activePrescriptions),
        healthRecords: this.transformHealthRecords(data.recentHealthRecords),
        notifications: data.unreadNotifications || [],
        pendingActions: [] // Kept empty as requested
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};
