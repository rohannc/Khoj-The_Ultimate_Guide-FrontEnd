<template>
  <div class="dashboard-page">
    <nav class="navbar">
      <div class="navbar-container">
        <a href="#" class="navbar-brand">
          <img src="https://img.icons8.com/?size=100&id=JNzjznWAq3J5&format=png&color=000000" class="logo"
            alt="Khoj Health Logo" />
          <span class="brand-name">Khoj</span>
        </a>
        <div class="navbar-menu-right">
          <button type="button" class="btn-book-appointment">
            <img src="https://img.icons8.com/?size=100&id=din51tUld11B&format=png&color=000000" class="book-button"
              alt="Book Logo" width="25px" />
            Book an Appointment
          </button>
          <div class="profile-dropdown-wrapper" ref="profileDropdownRef">
            <button @click="toggleUserDropdown" type="button" class="profile-button" id="user-menu-button">
              <span class="sr-only">Open user menu</span>
              <img class="profile-image" src="https://img.icons8.com/fluency/48/user-male-circle.png" alt="user photo">
            </button>
            <div :class="{ 'hidden': !isUserDropdownOpen }" class="profile-dropdown">
              <div class="dropdown-header">
                <span class="block text-sm">{{ patient.firstName }} {{ patient.lastName }}</span>
                <span class="block text-sm truncate">patient@example.com</span>
              </div>
              <ul class="dropdown-list">
                <li>
                  <router-link to="/profile" class="dropdown-item">Profile</router-link>
                </li>
                <li>
                  <router-link to="#" class="dropdown-item">Dashboard</router-link>
                </li>
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
              <a href="#" class="nav-link active" aria-current="page">Book an Appointment</a>
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
        <h3 class="alert-title">Verify Your Account</h3>
      </div>
      <div class="alert-body">
        Please verify your email address to get full access to your health records and notifications. A verification
        link has been sent to your inbox.
      </div>
      <div class="alert-actions">
        <button @click="verifyEmail" type="button" class="alert-button-primary">
          <svg class="button-svg-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 14">
            <path
              d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
          </svg>
          Resend Verification Email
        </button>
        <button @click="isAlertVisible = false" type="button" class="alert-button-secondary">
          Dismiss
        </button>
      </div>
    </div>


    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome, {{ patient.firstName }}!</h1>
        <p>Here's your health summary at a glance.</p>
      </header>
      <div class="dashboard-grid">
        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.calendar" alt="calendar icon" class="card-icon">
            <h2>Upcoming Appointment</h2>
          </div>
          <div class="card-body">
            <div v-if="upcomingAppointment">
              <p class="appointment-doctor"><strong>Dr. {{ upcomingAppointment.doctorName }}</strong></p>
              <p class="appointment-specialty">{{ upcomingAppointment.specialty }}</p>
              <div class="appointment-details">
                <span>{{ upcomingAppointment.date }}</span>
                <span>{{ upcomingAppointment.time }}</span>
              </div>
              <button class="card-button">View Details</button>
            </div>
            <div v-else>
              <p>No upcoming appointments.</p>
            </div>
          </div>
        </div>

        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.vitals" alt="vitals icon" class="card-icon">
            <h2>Recent Vitals</h2>
          </div>
          <div class="card-body">
            <ul class="vitals-list">
              <li>
                <span>Blood Pressure</span>
                <span class="vital-value">{{ vitals.bloodPressure }}</span>
              </li>
              <li>
                <span>Heart Rate</span>
                <span class="vital-value">{{ vitals.heartRate }} bpm</span>
              </li>
              <li>
                <span>Temperature</span>
                <span class="vital-value">{{ vitals.temperature }} °F</span>
              </li>
            </ul>
            <a href="#" class="card-link">View History</a>
          </div>
        </div>

        <div class="widget-card grid-span-2">
          <div class="card-header">
            <img :src="icons.prescription" alt="prescription icon" class="card-icon">
            <h2>My Prescriptions</h2>
          </div>
          <div class="card-body">
            <ul class="prescription-list">
              <li v-for="rx in prescriptions" :key="rx.name">
                <span class="rx-name">{{ rx.name }}</span>
                <span class="rx-dosage">{{ rx.dosage }}</span>
                <span class="rx-refills">Refills left: {{ rx.refills }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.actions" alt="actions icon" class="card-icon">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-body action-buttons">
            <button class="card-button">Find a Doctor</button>
            <button class="card-button">View Health Records</button>
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
const verifyEmail = () => alert('A new verification email has been sent!');

const logout = () => {
  authStore.logout();
  router.push('/login/patient');
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
  calendar: 'https://img.icons8.com/ios-glyphs/60/1a75ff/calendar.png',
  vitals: 'https://img.icons8.com/ios-glyphs/60/1a75ff/heart-with-pulse.png',
  prescription: 'https://img.icons8.com/ios-glyphs/60/1a75ff/pill.png',
  actions: 'https://img.icons8.com/ios-glyphs/60/1a75ff/hand-cursor.png',
  messages: 'https://img.icons8.com/ios-glyphs/60/1a75ff/chat.png',
});

const patient = ref({
  firstName: 'Rohan',
  lastName: 'Chakraborty',
});

const upcomingAppointment = ref({
  doctorName: 'Alan Turing',
  specialty: 'Cardiology',
  date: 'September 15, 2025',
  time: '10:30 AM',
});

const vitals = ref({
  bloodPressure: '120/80',
  heartRate: '72',
  temperature: '98.6',
});

const prescriptions = ref([
  { name: 'Metformin', dosage: '500mg', refills: 2 },
  { name: 'Lisinopril', dosage: '10mg', refills: 1 },
]);

const messages = ref({
  unread: 3,
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Righteous&display=swap');

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

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.w-full {
  width: 100%;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

/* Navbar Styles */
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  font-family: 'Inter', sans-serif;
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
  letter-spacing: -0.5px;
}

.navbar-menu-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.profile-dropdown-wrapper {
  position: relative;
}

.profile-button {
  cursor: pointer;
  border: none;
  background: none;
  display: flex;
  align-items: center;
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

.text-gray-900 {
  color: #111827;
  font-weight: 600;
}

.text-gray-500 {
  color: #6b7280;
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

.btn-book-svg {
  width: 2.5rem;
  height: 0.75rem;
  margin-right: 0.5rem;
  margin-left: -0.25rem;
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: inline-flex;
  }

  .btn-book-appointment {
    display: none;
  }
}

/* Alert Banner Styles */
.alert-banner {
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fefce8;
  border: 1px solid #fef08a;
  color: #854d0e;
  font-family: 'Inter', sans-serif;
}

.alert-header {
  display: flex;
  align-items: center;
}

.alert-svg-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
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
}

.alert-button-primary {
  display: inline-flex;
  align-items: center;
  text-align: center;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  background-color: #854d0e;
  color: white;
  margin-right: 0.5rem;
}

.alert-button-primary:hover {
  background-color: #713f12;
}

.button-svg-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.5rem;
}

.alert-button-secondary {
  background-color: transparent;
  border: 1px solid #854d0e;
  color: #854d0e;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
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
  font-family: 'Inter', sans-serif;
  padding: 2rem;
  line-height: 1.6;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.8px;
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
}

.widget-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}

.grid-span-2 {
  grid-column: span 2;
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

.appointment-doctor {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1e293b;
}

.appointment-specialty {
  color: #64748b;
  margin-bottom: 1rem;
}

.appointment-details {
  display: flex;
  justify-content: space-between;
  background-color: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.vitals-list,
.prescription-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.vitals-list li,
.prescription-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.vitals-list li:last-child,
.prescription-list li:last-child {
  border-bottom: none;
}

.vital-value {
  font-weight: 600;
  color: #0059b3;
}

.rx-name {
  font-weight: 500;
}

.rx-dosage {
  color: #475569;
}

.rx-refills {
  background-color: #e0eafc;
  color: #1a75ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

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
}

.card-button:hover {
  background-color: #0059b3;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-link {
  display: block;
  text-align: right;
  margin-top: 1rem;
  color: #1a75ff;
  text-decoration: none;
  font-weight: 500;
}

.message-summary {
  text-align: center;
}

.message-count {
  font-size: 3rem;
  font-weight: 700;
  color: #1a75ff;
}

.book-button {
  margin-right: 15px;
}
</style>
