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
          <button type="button" class="btn-onboard-doctor">
            <img src="https://img.icons8.com/?size=100&id=Y5wXK2rZQJnJ&format=png&color=000000"
              alt="Onboard Doctor Icon" />
            <span>Onboard New Doctor</span>
          </button>
          <div class="profile-dropdown-wrapper" ref="profileDropdownRef">
            <button @click="toggleUserDropdown" type="button" class="profile-button">
              <span class="sr-only">Open user menu</span>
              <img class="profile-image" src="https://img.icons8.com/fluency/48/user-male-circle.png" alt="user photo">
            </button>
            <div :class="{ 'hidden': !isUserDropdownOpen }" class="profile-dropdown">
              <div class="dropdown-header">
                <span class="block text-sm">{{ clinic.name }}</span>
                <span class="block text-sm truncate">{{ authStore.user?.username || 'admin@clinic.com' }}</span>
              </div>
              <ul class="dropdown-list">
                <li><a href="#" class="dropdown-item">Profile</a></li>
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
        <h3 class="alert-title">Verify Your Clinic's Email</h3>
      </div>
      <div class="alert-body">
        Please verify your email address to ensure seamless communication and to receive important administrative
        notifications.
      </div>
      <div class="alert-actions">
        <button @click="verifyEmail" type="button" class="alert-button-primary">
          Resend Verification Email
        </button>
        <button @click="isAlertVisible = false" type="button" class="alert-button-secondary">
          Dismiss
        </button>
      </div>
    </div>

    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>{{ clinic.name }} Dashboard</h1>
        <p>Today's operational overview for Saturday, 6 September 2025.</p>
      </header>
      <div class="dashboard-grid">
        <div class="widget-card stat-card">
          <div class="card-header">
            <img :src="icons.patients" class="card-icon" />
            <h2>Total Patients</h2>
          </div>
          <div class="stat-body">
            <p class="stat-number">{{ stats.totalPatients }}</p>
          </div>
        </div>
        <div class="widget-card stat-card">
          <div class="card-header">
            <img :src="icons.doctors" class="card-icon" />
            <h2>Affiliated Doctors</h2>
          </div>
          <div class="stat-body">
            <p class="stat-number">{{ stats.affiliatedDoctors }}</p>
          </div>
        </div>
        <div class="widget-card stat-card">
          <div class="card-header">
            <img :src="icons.appointments" class="card-icon" />
            <h2>Today's Appointments</h2>
          </div>
          <div class="stat-body">
            <p class="stat-number">{{ stats.todaysAppointments }}</p>
          </div>
        </div>

        <div class="widget-card grid-span-2">
          <div class="card-header">
            <img :src="icons.pending" class="card-icon" />
            <h2>Pending Affiliation Requests</h2>
          </div>
          <ul class="request-list">
            <li v-for="request in pendingRequests" :key="request.id">
              <div class="request-info">
                <span class="request-name">Dr. {{ request.name }}</span>
                <span class="request-specialty">{{ request.specialty }}</span>
              </div>
              <div class="request-actions">
                <button class="btn-approve">Approve</button>
                <button class="btn-reject">Reject</button>
              </div>
            </li>
          </ul>
        </div>

        <div class="widget-card">
          <div class="card-header">
            <img :src="icons.actions" class="card-icon" />
            <h2>Quick Actions</h2>
          </div>
          <div class="action-buttons">
            <button class="card-button">Manage Staff</button>
            <button class="card-button">View Financials</button>
            <button class="card-button">Generate Reports</button>
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
const profileDropdownRef = ref(null); // Ref for the dropdown element

const toggleUserDropdown = () => isUserDropdownOpen.value = !isUserDropdownOpen.value;
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
const verifyEmail = () => {
  alert('A new verification email has been sent!');
  isAlertVisible.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/login/clinic');
};

// NEW: Handle clicking outside the dropdown to close it
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

// --- MOCK DATA FOR THE DASHBOARD ---
const clinic = ref({
  name: 'Kanchrapara Health Clinic',
});

const icons = ref({
  patients: 'https://img.icons8.com/ios-glyphs/60/1a75ff/user-group-man-man.png',
  doctors: 'https://img.icons8.com/ios-glyphs/60/1a75ff/doctor-male.png',
  appointments: 'https://img.icons8.com/ios-glyphs/60/1a75ff/overtime.png',
  pending: 'https://img.icons8.com/ios-glyphs/60/1a75ff/time-machine.png',
  actions: 'https://img.icons8.com/ios-glyphs/60/1a75ff/hand-cursor.png',
});

const stats = ref({
  totalPatients: 1254,
  affiliatedDoctors: 18,
  todaysAppointments: 42,
});

const pendingRequests = ref([
  { id: 1, name: 'S. Gupta', specialty: 'Cardiology' },
  { id: 2, name: 'A. Banerjee', specialty: 'Pediatrics' },
  { id: 3, name: 'M. Das', specialty: 'Dermatology' },
]);

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.dashboard-page {
  background-color: #f0f4f8;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

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
  gap: 0.75rem;
  text-decoration: none;
}

.logo {
  height: 2.5rem;
  width: 2.5rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.navbar-menu-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-onboard-doctor {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1a75ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-onboard-doctor:hover {
  background-color: #0059b3;
}

.btn-onboard-doctor img {
  width: 20px;
  height: 20px;
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

  .btn-onboard-doctor {
    display: none;
  }
}

/* Alert Banner Styles */
.alert-banner {
  margin: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #fefce8;
  border: 1px solid #fef08a;
  color: #854d0e;
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
.dashboard-container {
  padding: 2rem;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

/* Stat Card Specifics */
.stat-card .stat-body {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1a75ff;
}

/* Request List Specifics */
.request-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.request-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 0.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.request-list li:last-child {
  border-bottom: none;
}

.request-info {
  display: flex;
  flex-direction: column;
}

.request-name {
  font-weight: 600;
  color: #1e293b;
}

.request-specialty {
  color: #64748b;
  font-size: 0.9rem;
}

.request-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-approve,
.btn-reject {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-approve {
  background-color: #dcfce7;
  color: #166534;
}

.btn-approve:hover {
  background-color: #bbf7d0;
}

.btn-reject {
  background-color: #fee2e2;
  color: #991b1b;
}

.btn-reject:hover {
  background-color: #fecaca;
}


/* Quick Actions Specifics */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  justify-content: center;
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
</style>
