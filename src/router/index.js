// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LandingPageView from '../views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import DoctorSignUpView from '@/views/DoctorSignUpView.vue';
import PatientSignUpView from '@/views/PatientSignUpView.vue';
import ClinicSignUpView from '@/views/ClinicSignUpView.vue';
// You'll need to create this login component as well

const routes = [
  {
    path: '/',
    name: 'Landing Page',
    component: LandingPageView
  },
  {
    path: '/login/:role',
    name: 'login',
    component: LoginView,
    // It's good practice to validate the role parameter
    beforeEnter: (to, from, next) => {
      const validRoles = ['doctor', 'patient', 'clinic'];
      if (validRoles.includes(to.params.role)) {
        next();
      } else {
        // Redirect to a default or error page if the role is invalid
        next('/login/patient');
      }
    }
  },
  {
    path: '/signup/doctor',
    name: 'Doctor Sign Up',
    component: DoctorSignUpView,
  },
  {
    path: '/signup/patient',
    name: 'Patient Sign Up',
    component: PatientSignUpView,
  },
  {
    path: '/signup/clinic',
    name: 'Clinic Sign Up',
    component: ClinicSignUpView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
