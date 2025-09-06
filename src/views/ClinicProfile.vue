<template>
  <div class="profile-page-wrapper">
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
                <li><a href="/profile" class="dropdown-item">Profile</a></li>
                <li><a href="/dashboard/clinic" class="dropdown-item">Dashboard</a>
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
            <li><a href="#" class="nav-link active" aria-current="page">Book an Appointment</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="profile-page">
      <div class="profile-container">
        <header class="profile-header">
          <h1>Clinic Profile</h1>
          <div class="header-actions">
            <button class="btn btn-primary" @click="editProfile">
              <img src="https://img.icons8.com/ios-glyphs/30/ffffff/edit--v1.png" alt="Edit Icon" />
              Edit Profile
            </button>
            <button class="btn btn-secondary" @click="changePassword">
              <img src="https://img.icons8.com/ios-glyphs/30/000000/lock--v1.png" alt="Lock Icon" />
              Change Password
            </button>
            <button class="btn btn-danger" @click="deleteProfile">
              <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash--v1.png" alt="Delete Icon" />
              Delete Account
            </button>
          </div>
        </header>

        <div class="profile-content-full">
          <div class="info-section">
            <h2>{{ clinic.name }}</h2>
            <p class="clinic-reg">Reg. No: {{ clinic.registrationNumber }}</p>
            <p class="clinic-bio">{{ clinic.description }}</p>
          </div>

          <div class="details-grid">
            <div class="info-section">
              <h3>Contact & Location</h3>
              <div class="contact-item">
                <label>Address</label>
                <span>{{ clinic.address.street }}, {{ clinic.address.city }}, {{ clinic.address.state }} - {{
                  clinic.address.pincode }}</span>
              </div>
              <div class="contact-item">
                <label>Phone</label>
                <span>{{ clinic.contact.phone }}</span>
              </div>
              <div class="contact-item">
                <label>Email</label>
                <span>{{ clinic.contact.email }}</span>
              </div>
            </div>
            <div class="info-section">
              <h3>Operating Hours</h3>
              <div class="working-hours">
                <div v-for="(time, day) in clinic.operatingHours" :key="day" class="hour-item">
                  <label>{{ day }}</label>
                  <span>{{ time }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Services Offered</h3>
            <ul class="tag-list">
              <li v-for="service in clinic.services" :key="service" class="tag">{{ service }}</li>
            </ul>
          </div>

          <div class="info-section">
            <h3>Our Doctors</h3>
            <div class="doctor-grid">
              <div v-for="doctor in clinic.affiliatedDoctors" :key="doctor.id" class="doctor-card">
                <img src="https://img.icons8.com/fluency/48/doctor-male.png" alt="Doctor Icon" />
                <div class="doctor-info">
                  <span class="doctor-name">Dr. {{ doctor.name }}</span>
                  <span class="doctor-specialty">{{ doctor.specialty }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- Navbar Logic ---
const isUserDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const profileDropdownRef = ref(null);

const toggleUserDropdown = () => isUserDropdownOpen.value = !isUserDropdownOpen.value;
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;

const logout = () => alert('Signing out...');

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isUserDropdownOpen.value = false;
  }
};
// Logged-in user for the navbar dropdown
const patient = ref({
  firstName: 'Rohan',
  lastName: 'Chakraborty',
});

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
// --- End Navbar Logic ---


// --- Profile Page Logic ---
const clinic = ref({
  name: 'Kanchrapara Health Clinic',
  registrationNumber: 'WB/CL/2020/8812',
  description: 'A leading multi-specialty health clinic in Kanchrapara, providing comprehensive and compassionate healthcare services to the community since 2020. Our facility is equipped with modern technology and staffed by experienced medical professionals.',
  address: { street: '45, K.G.R Path', city: 'Kanchrapara', state: 'West Bengal', pincode: '743145' },
  contact: { phone: '033-2585-1234', email: 'contact@kanchraparahealth.in' },
  operatingHours: {
    'Monday - Saturday': '08:00 AM - 09:00 PM',
    'Sunday': '10:00 AM - 02:00 PM (Emergency Only)',
  },
  services: ['General Consultation', 'Cardiology', 'Pediatrics', 'Dermatology', 'Pathology Lab', 'Pharmacy', 'Minor Surgeries'],
  affiliatedDoctors: [
    { id: 1, name: 'Alan Turing', specialty: 'Cardiology' },
    { id: 2, name: 'S. Gupta', specialty: 'General Physician' },
    { id: 3, name: 'A. Banerjee', specialty: 'Pediatrics' },
    { id: 4, name: 'M. Das', specialty: 'Dermatology' },
    { id: 5, name: 'R. Sen', specialty: 'Gynecology' },
  ],
});

const editProfile = () => alert('Navigating to the clinic profile edit page...');
const changePassword = () => alert('Opening change password modal...');
const deleteProfile = () => {
  if (confirm('Are you sure you want to delete this clinic profile? This action cannot be undone.')) {
    alert('Deleting profile...');
  }
};
// --- End Profile Page Logic ---
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Righteous&display=swap');

.profile-page-wrapper {
  background-color: #f0f4f8;
}

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

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  border-bottom: 1px solid #f3f4f6;
}

.text-sm {
  font-size: 0.875rem;
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

.btn-book-appointment {
  display: inline-flex;
  align-items: center;
  color: #fff;
  background-color: #2557D6;
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0.625rem 1.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-book-appointment:hover {
  background-color: rgba(37, 87, 214, 0.9);
}

.book-button {
  margin-right: 15px;
}

@media (max-width: 768px) {
  .mobile-menu-button {
    display: inline-flex;
  }

  .btn-book-appointment {
    display: none;
  }
}

/* End Navbar Styles */

/* Profile Page Styles */
.profile-page {
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.profile-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #1a75ff;
  color: white;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #334155;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn img {
  width: 16px;
  height: 16px;
}

.profile-content-full {
  padding: 2rem;
}

.info-section {
  margin-bottom: 2.5rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
}

.info-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1.5rem;
}

.clinic-reg {
  color: #64748b;
  margin-bottom: 1rem;
}

.clinic-bio {
  color: #475569;
  line-height: 1.7;
  max-width: 800px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.contact-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.contact-item label {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.working-hours {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 8px;
}

.hour-item:nth-child(odd) {
  background-color: #f8fafc;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
}

.tag {
  background-color: #e0eafc;
  color: #1a75ff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.doctor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.doctor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.doctor-info {
  display: flex;
  flex-direction: column;
}

.doctor-name {
  font-weight: 600;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
