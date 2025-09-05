// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LandingPageView from '../views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import DoctorSignUpView from '@/views/DoctorSignUpView.vue';
import PatientSignUpView from '@/views/PatientSignUpView.vue';
import ClinicSignUpView from '@/views/ClinicSignUpView.vue';
import PatientDashboard from '@/views/PatientDashboard.vue';
import DoctorDashBoard from '@/views/DoctorDashBoard.vue';
import ClinicDashBoard from '@/views/ClinicDashBoard.vue';

const routes = [
  {
    path: '/',
    name: 'Landing Page',
    component: LandingPageView,
  },
  {
    path: '/login/:role',
    name: 'Login', // NOTE: Changed to uppercase 'L' for consistency
    component: LoginView,
    meta: { isGuest: true }, // Mark this as a "guest only" route
  },
  {
    path: '/signup/doctor',
    name: 'Doctor Sign Up',
    component: DoctorSignUpView,
    meta: { isGuest: true },
  },
  {
    path: '/signup/patient',
    name: 'Patient Sign Up',
    component: PatientSignUpView,
    meta: { isGuest: true },
  },
  {
    path: '/signup/clinic',
    name: 'Clinic Sign Up',
    component: ClinicSignUpView,
    meta: { isGuest: true },
  },
  {
    path: '/dashboard/patient',
    name: 'PatientDashboard',
    component: PatientDashboard,
    meta: { requiresAuth: true, role: 'patient' },
  },
  {
    path: '/dashboard/doctor',
    name: 'DoctorDashboard',
    component: DoctorDashBoard,
    meta: { requiresAuth: true, role: 'doctor' },
  },
  {
    path: '/dashboard/clinic',
    name: 'ClinicDashboard',
    component: ClinicDashBoard,
    meta: { requiresAuth: true, role: 'clinic' },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// UPDATED Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.isGuest;
  const requiredRole = to.meta.role;

  if (requiresAuth && !authStore.isLoggedIn) {
    // Case 1: User is not logged in but tries to access a protected page.
    // Redirect them to a default login page.
    next({ name: 'Login', params: { role: 'patient' } });
  } else if (isGuest && authStore.isLoggedIn) {
    // Case 2: User is already logged in but tries to access a guest page (like login/signup).
    // Redirect them to their own dashboard.
    const dashboardPath = `/dashboard/${authStore.userRole}`;
    next(dashboardPath);
  } else if (requiresAuth && authStore.isLoggedIn && requiredRole !== authStore.userRole) {
    // Case 3: User is logged in but tries to access a dashboard of another role.
    // Redirect them to their own dashboard.
    const dashboardPath = `/dashboard/${authStore.userRole}`;
    next(dashboardPath);
  }
  else {
    // Case 4: Access is allowed.
    next();
  }
});

export default router;
