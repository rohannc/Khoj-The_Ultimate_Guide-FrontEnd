<template>
  <div class="landing-container">
    <div class="welcome-box">
      <h1 class="title">Welcome to Our Health Care Management System</h1>
      <p class="subtitle">Please select your role to continue</p>

      <div class="role-selector">
        <div class="role-card" @click="navigateToRole('patient')">
          <div class="card-icon">🩺</div>
          <h2 class="card-title">I am a Patient</h2>
          <p class="card-description">Book appointments and view your medical history.</p>
        </div>

        <div class="role-card" @click="navigateToRole('doctor')">
          <div class="card-icon">👨‍⚕️</div>
          <h2 class="card-title">I am a Doctor</h2>
          <p class="card-description">Manage patients and clinic affiliations.</p>
        </div>

        <div class="role-card" @click="navigateToRole('clinic')">
          <div class="card-icon">🏥</div>
          <h2 class="card-title">I am a Clinic</h2>
          <p class="card-description">Administer doctors and manage facility details.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Initialize the router instance
const router = useRouter();

/**
 * Navigates to the login page for the selected role.
 * @param {string} role - The user role ('patient', 'doctor', or 'clinic').
 */
const navigateToRole = (role) => {
  // Use the router to push to a dynamic route based on the role
  router.push(`/login/${role}`);
  // You could also navigate to a named route, e.g., router.push({ name: 'Login', params: { role: role } })
};
</script>

<style scoped>
/* Scoped styles ensure they only apply to this component */
.landing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f8;
  /* Light blue-gray background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
}

.welcome-box {
  background: white;
  padding: 3rem 4rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 1000px;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #718096;
  margin-bottom: 3rem;
}

.role-selector {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  flex-wrap: wrap;
  /* Allows cards to wrap on smaller screens */
}

.role-card {
  flex: 1;
  min-width: 250px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.role-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 91, 187, 0.15);
  border-color: #3182ce;
  /* A nice blue to highlight */
}

.card-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .welcome-box {
    padding: 2rem;
  }

  .title {
    font-size: 2rem;
  }

  .role-selector {
    flex-direction: column;
  }
}
</style>
