<template>
  <div class="dashboard-page">
    <nav class="navbar">
      <div class="navbar-container">
        <a href="#" class="navbar-brand">
          <img src="https://img.icons8.com/?size=100&id=JNzjznWAq3J5&format=png&color=000000" class="logo"
            alt="Khoj Logo" />
          <span class="brand-name">Khoj</span>
        </a>
        <div class="navbar-menu-right">
          <button type="button" class="btn-book-appointment">
            <img src="https://img.icons8.com/?size=100&id=din51tUld11B&format=png&color=FFFFFF" class="book-button-icon"
              alt="Book Logo" />
            Request an Affiliation
          </button>

          <div class="profile-dropdown-wrapper" ref="profileDropdownRef">
            <button @click="toggleUserDropdown" type="button" class="profile-button">
              <span class="sr-only">Open user menu</span>
              <img class="profile-image" src="https://img.icons8.com/fluency/48/user-male-circle.png" alt="user photo">
            </button>
            <div :class="{ 'hidden': !isUserDropdownOpen }" class="profile-dropdown">
              <div class="dropdown-header">
                <span class="block text-sm">Dr. {{ doctor.lastName }}</span>
                <span class="block text-sm truncate">{{ authStore.user?.username || 'doctor@example.com' }}</span>
              </div>
              <ul class="dropdown-list">
                <li><a href="/profile" class="dropdown-item">Profile</a></li>
                <li><a href="#" class="dropdown-item">Dashboard</a></li>
                <li><a @click.prevent="logout" href="#" class="dropdown-item">Sign out</a></li>
              </ul>
            </div>
          </div>
          <button @click="toggleMobileMenu" type="button" class="mobile-menu-button">
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div :class="{ 'hidden': !isMobileMenuOpen }" class="navbar-links-container">
          <ul class="navbar-links">
            <li>
              <a href="#" class="nav-link active" aria-current="page">Request for Affiliate</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div v-if="isAlertVisible" class="alert-banner">
      <div class="alert-header">
        <svg class="alert-svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
          viewBox="0 0 20 20">
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <h3 class="alert-title">Verify Your Email Address</h3>
      </div>
      <div class="alert-body">
        Please check your inbox for a verification link. Verifying your email is important for account security and to
        receive important notifications.
      </div>
      <div class="alert-actions">
        <button @click="resendVerificationEmail" type="button" class="alert-button-primary">
          Resend Verification Link
        </button>
        <button @click="isAlertVisible = false" type="button" class="alert-button-secondary">
          Dismiss
        </button>
      </div>
    </div>

    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome, Dr. {{ doctor.lastName }}!</h1>
        <p>Here's what your day looks like.</p>
      </header>
      <div class="dashboard-grid">

        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.schedule" alt="schedule icon" class="card-icon">
            <h2>Today's Schedule</h2>
          </div>
          <div class="card-body">
            <div class="schedule-summary">
              <p class="schedule-count">{{ scheduleSummary.totalAppointments }}</p>
              <p>Total Appointments</p>
            </div>
            <div class="schedule-details">
              <span>Next Patient: <strong>{{ scheduleSummary.nextPatient }}</strong></span>
              <span>{{ scheduleSummary.nextTime }}</span>
            </div>
            <button class="card-button">View Full Schedule</button>
          </div>
        </div>

        <div class="widget-card grid-span-2">
          <div class="card-header">
            <img :src="icons.queue" alt="patient queue icon" class="card-icon">
            <h2>Patient Queue</h2>
          </div>
          <div class="card-body">
            <ul class="patient-queue-list">
              <li v-for="patient in patientQueue" :key="patient.id">
                <div class="patient-info">
                  <span class="patient-name">{{ patient.name }}</span>
                  <span class="patient-reason">{{ patient.reason }}</span>
                </div>
                <span class="patient-status">{{ patient.status }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.messages" alt="messages icon" class="card-icon">
            <h2>Messages</h2>
          </div>
          <div class="card-body">
            <div class="message-summary">
              <p class="message-count">{{ messages.unread }}</p>
              <p>Unread Messages</p>
              <a href="#" class="card-link">Go to Inbox</a>
            </div>
          </div>
        </div>

        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.actions" alt="actions icon" class="card-icon">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-body action-buttons">
            <button class="card-button">Manage Patients</button>
            <button class="card-button">Start a New Chart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isUserDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isAlertVisible = ref(true);
const profileDropdownRef = ref(null);

const toggleUserDropdown = () => isUserDropdownOpen.value = !isUserDropdownOpen.value;
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;

const logout = () => {
  authStore.logout();
  router.push('/login/doctor');
};

const resendVerificationEmail = () => {
  console.log('Resending verification email...');
  isAlertVisible.value = false;
};

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isUserDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const icons = ref({
  schedule: 'https://img.icons8.com/ios-glyphs/60/1a75ff/overtime.png',
  queue: 'https://img.icons8.com/ios-glyphs/60/1a75ff/user-group-man-man.png',
  messages: 'https://img.icons8.com/ios-glyphs/60/1a75ff/chat.png',
  actions: 'https://img.icons8.com/ios-glyphs/60/1a75ff/hand-cursor.png',
});

const doctor = ref({
  firstName: 'Alan',
  lastName: 'Turing',
});

const scheduleSummary = ref({
  totalAppointments: 14,
  nextPatient: 'Rohan Chakraborty',
  nextTime: '01:45 PM',
});

const patientQueue = ref([
  { id: 1, name: 'Rohan C.', reason: 'Follow-up', status: 'Waiting' },
  { id: 2, name: 'Ada L.', reason: 'New Patient Visit', status: 'Waiting' },
  { id: 3, name: 'Grace H.', reason: 'Annual Physical', status: 'Waiting' },
  { id: 4, name: 'Charles B.', reason: 'Consultation', status: 'Room 3' },
]);

const messages = ref({
  unread: 5,
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Righteous&display=swap');

/* Basic CSS Fallbacks */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.hidden {
  display: none;
}

.block {
  display: block;
}

/* Navbar Styles */
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  font-family: 'Poppins', sans-serif;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo {
  height: 2.5rem;
  width: 2.5rem;
}

.brand-name {
  font-family: 'Righteous', cursive;
  font-size: 1.75rem;
  font-weight: 400;
  color: #111827;
}

.navbar-menu-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* UPDATED: Style for the book appointment button */
.btn-book-appointment {
  display: inline-flex;
  align-items: center;
  text-align: center;
  color: #fff;
  background-color: #2557D6;
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0.625rem 1.25rem;
  margin-right: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 2.5rem;
}

.btn-book-appointment:hover {
  background-color: rgba(37, 87, 214, 0.9);
}

.btn-book-appointment:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(37, 87, 214, 0.5);
}

.book-button-icon {
  width: 25px;
  margin-right: 0.5rem;
}

.profile-dropdown-wrapper {
  position: relative;
}

.profile-button {
  cursor: pointer;
  border: none;
  background: none;
}

.profile-image {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 1.25rem;
  z-index: 50;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border: 1px solid #f3f4f6;
  min-width: 200px;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  text-align: right;
  border-bottom: 1px solid #f3f4f6;
}

.text-sm {
  font-size: 0.875rem;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-list {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.mobile-menu-button {
  display: none;
}

.navbar-links-container {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: inline-flex;
  }

  .btn-book-appointment {
    display: none;
    /* Hide on mobile to avoid clutter */
  }
}

/* UPDATED: Alert Banner Styles to match Patient's view */
.alert-banner {
  margin: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fefce8;
  border: 1px solid #fef08a;
  color: #854d0e;
  font-family: 'Poppins', sans-serif;
}

.alert-header {
  display: flex;
  align-items: center;
}

.alert-svg-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.alert-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.alert-body {
  margin: 0.5rem 0 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.alert-button-primary {
  display: inline-flex;
  align-items: center;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  background-color: #854d0e;
  color: white;
}

.alert-button-primary:hover {
  background-color: #713f12;
}

.alert-button-secondary {
  background-color: transparent;
  border: 1px solid #854d0e;
  color: #854d0e;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.alert-button-secondary:hover {
  background-color: #854d0e;
  color: white;
}


/* Dashboard Styles */
.dashboard-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.dashboard-container {
  font-family: 'Poppins', sans-serif;
  padding: 1.5rem;
  line-height: 1.6;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.widget-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.widget-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}

.grid-span-2 {
  grid-column: span 2;
}

@media (max-width: 1024px) {
  .grid-span-2 {
    grid-column: span 1;
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.card-icon {
  width: 32px;
  height: 32px;
  margin-right: 1rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
}

/* Schedule Card */
.schedule-summary {
  text-align: center;
  flex-grow: 1;
}

.schedule-count {
  font-size: 3rem;
  font-weight: 700;
  color: #1a75ff;
}

.schedule-details {
  display: flex;
  justify-content: space-between;
  background-color: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1.5rem 0 1rem 0;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Patient Queue Card */
.patient-queue-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.patient-queue-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 0.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.patient-queue-list li:last-child {
  border-bottom: none;
}

.patient-info {
  display: flex;
  flex-direction: column;
}

.patient-name {
  font-weight: 600;
  color: #1e293b;
}

.patient-reason {
  color: #64748b;
  font-size: 0.9rem;
}

.patient-status {
  background-color: #e0eafc;
  color: #1a75ff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Messages Card */
.message-summary {
  text-align: center;
  margin: auto 0;
}

.message-count {
  font-size: 3rem;
  font-weight: 700;
  color: #1a75ff;
}

/* Common Card Elements */
.card-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1a75ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: auto;
}

.card-button:hover {
  background-color: #0059b3;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  flex-grow: 1;
}

.card-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #1a75ff;
  text-decoration: none;
  font-weight: 600;
}
</style>
