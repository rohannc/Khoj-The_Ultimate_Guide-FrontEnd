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
                <li><a href="#" class="dropdown-item">Profile</a></li>
                <li><a href="/dashboard/patient" class="dropdown-item">Dashboard</a>
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
          <h1>My Profile</h1>
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
              Delete Profile
            </button>
          </div>
        </header>

        <div class="profile-grid">
          <div class="profile-sidebar">
            <div class="profile-picture-wrapper">
              <img src="https://img.icons8.com/fluency/96/user-male-circle.png" alt="Patient Profile Picture"
                class="profile-picture">
            </div>
            <h2 class="profile-name">{{ patient.firstName }} {{ patient.lastName }}</h2>
            <p class="profile-meta">Member since {{ patient.memberSince }}</p>
            <div class="profile-basic-info">
              <div class="info-item">
                <span>Age</span>
                <strong>{{ patient.age }} Years</strong>
              </div>
              <div class="info-item">
                <span>Gender</span>
                <strong>{{ patient.gender }}</strong>
              </div>
              <div class="info-item">
                <span>Blood Group</span>
                <strong class="blood-group">{{ patient.medicalInfo.bloodGroup }}</strong>
              </div>
            </div>
          </div>

          <div class="profile-content">
            <div class="tab-navigation">
              <button :class="{ active: activeTab === 'personal' }" @click="activeTab = 'personal'">Personal
                Info</button>
              <button :class="{ active: activeTab === 'medical' }" @click="activeTab = 'medical'">Medical
                Details</button>
              <button :class="{ active: activeTab === 'emergency' }" @click="activeTab = 'emergency'">Emergency
                Contact</button>
            </div>

            <div class="tab-content">
              <div v-if="activeTab === 'personal'" class="info-section">
                <h3>Contact Information</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Phone Number</label>
                    <span>{{ patient.contact.phone }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Email Address</label>
                    <span>{{ patient.contact.email }}</span>
                  </div>
                </div>
                <h3>Address</h3>
                <div class="detail-item">
                  <label>Street Address</label>
                  <span>{{ patient.address.street }}, {{ patient.address.city }}, {{ patient.address.state }} - {{
                    patient.address.pincode }}</span>
                </div>
              </div>

              <div v-if="activeTab === 'medical'" class="info-section">
                <h3>Allergies</h3>
                <ul class="tag-list">
                  <li v-for="allergy in patient.medicalInfo.allergies" :key="allergy" class="tag">{{ allergy }}</li>
                </ul>
                <h3>Chronic Conditions</h3>
                <ul class="tag-list">
                  <li v-for="condition in patient.medicalInfo.chronicConditions" :key="condition" class="tag">{{
                    condition
                    }}</li>
                </ul>
              </div>

              <div v-if="activeTab === 'emergency'" class="info-section">
                <h3>Contact Person Details</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Full Name</label>
                    <span>{{ patient.emergencyContact.name }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Relationship</label>
                    <span>{{ patient.emergencyContact.relation }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Phone Number</label>
                    <span>{{ patient.emergencyContact.phone }}</span>
                  </div>
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

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
// --- End Navbar Logic ---


// --- Profile Page Logic ---
const activeTab = ref('personal');

const patient = ref({
  firstName: 'Rohan',
  lastName: 'Chakraborty',
  age: 34,
  gender: 'Male',
  memberSince: 'Aug 2022',
  contact: { phone: '+91 98765 43210', email: 'rohan.c@example.com' },
  address: { street: '123, Netaji Subhash Road', city: 'Kanchrapara', state: 'West Bengal', pincode: '743145' },
  medicalInfo: { bloodGroup: 'O+', allergies: ['Pollen', 'Dust Mites'], chronicConditions: ['Hypertension'] },
  emergencyContact: { name: 'Anjali Chakraborty', relation: 'Spouse', phone: '+91 98765 43211' },
});

const editProfile = () => alert('Navigating to the profile edit page...');
const changePassword = () => alert('Opening change password modal...');
const deleteProfile = () => {
  if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
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

.btn-primary:hover {
  background-color: #0059b3;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #334155;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn img {
  width: 16px;
  height: 16px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
}

.profile-sidebar {
  padding: 2rem;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #e0eafc;
  margin-bottom: 1rem;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.profile-meta {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.profile-basic-info {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.blood-group {
  color: #dc2626 !important;
  font-weight: 700 !important;
}

.profile-content {
  padding: 2rem;
}

.tab-navigation {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.tab-navigation button {
  background: none;
  border: none;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
}

.tab-navigation button.active {
  color: #1a75ff;
  border-bottom-color: #1a75ff;
}

.info-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item label {
  display: block;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.tag {
  background-color: #eef2ff;
  color: #4338ca;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

@media (max-width: 992px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
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

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
