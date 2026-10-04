// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

// Views
import LandingPageView from '../views/LandingPageView.vue';
import LoginView from '@/views/LoginView.vue';
import DoctorSignUpView from '@/views/DoctorSignUpView.vue';
import PatientSignUpView from '@/views/PatientSignUpView.vue';
import ClinicSignUpView from '@/views/ClinicSignUpView.vue';
import PatientDashboard from '@/views/PatientDashboard.vue';
import DoctorDashBoard from '@/views/DoctorDashBoard.vue';
import ClinicDashBoard from '@/views/ClinicDashBoard.vue';
import PatientAppointmentsView from '@/views/patient/PatientAppointmentsView.vue';
import PatientHealthRecordsView from '@/views/patient/PatientHealthRecordsView.vue';
import PatientPrescriptionsView from '@/views/patient/PatientPrescriptionsView.vue';
import PatientNotificationsView from '@/views/patient/PatientNotificationsView.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Landing Page',
        component: LandingPageView,
      },
      {
        path: 'search',
        name: 'Search Directory',
        component: () => import('@/views/search/SearchDirectoryView.vue'),
      }
    ]
  },
  {
    path: '/login',
    redirect: '/'
  },
  {
    path: '/signup',
    redirect: '/'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login/:role',
        name: 'Login',
        component: LoginView,
        meta: { isGuest: true },
      },
      {
        path: 'signup/doctor',
        name: 'Doctor Sign Up',
        component: DoctorSignUpView,
        meta: { isGuest: true },
      },
      {
        path: 'signup/patient',
        name: 'Patient Sign Up',
        component: PatientSignUpView,
        meta: { isGuest: true },
      },
      {
        path: 'signup/clinic',
        name: 'Clinic Sign Up',
        component: ClinicSignUpView,
        meta: { isGuest: true },
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'patient',
        name: 'PatientDashboard',
        component: PatientDashboard,
        meta: { role: 'patient' },
      },
      {
        path: 'patient/appointments',
        name: 'PatientAppointments',
        component: PatientAppointmentsView,
        meta: { role: 'patient' },
      },
      {
        path: 'patient/records',
        name: 'PatientHealthRecords',
        component: PatientHealthRecordsView,
        meta: { role: 'patient' },
      },
      {
        path: 'patient/notifications',
        name: 'PatientNotifications',
        component: PatientNotificationsView,
        meta: { role: 'patient', hideNavbar: true },
      },
      {
        path: 'patient/prescriptions',
        name: 'PatientPrescriptions',
        component: PatientPrescriptionsView,
        meta: { role: 'patient' },
      },
      {
        path: 'doctor',
        name: 'DoctorDashboard',
        component: DoctorDashBoard,
        meta: { role: 'doctor' },
      },
      {
        path: 'doctor/appointments',
        name: 'DoctorAppointments',
        component: () => import('@/views/doctor/DoctorAppointmentsView.vue'),
        meta: { role: 'doctor' },
      },
      {
        path: 'doctor/patients',
        name: 'DoctorPatients',
        component: () => import('@/views/doctor/DoctorPatientsView.vue'),
        meta: { role: 'doctor' },
      },
      {
        path: 'doctor/prescriptions',
        name: 'DoctorPrescriptions',
        component: () => import('@/views/doctor/DoctorPrescriptionsView.vue'),
        meta: { role: 'doctor', simpleNavbar: true },
      },
      {
        path: 'doctor/affiliations',
        name: 'DoctorAffiliations',
        component: () => import('@/views/doctor/DoctorAffiliationsView.vue'),
        meta: { role: 'doctor' },
      },
      {
        path: 'doctor/schedule',
        name: 'DoctorSchedule',
        component: () => import('@/views/doctor/DoctorScheduleView.vue'),
        meta: { role: 'doctor', simpleNavbar: true },
      },
      {
        path: 'doctor/earnings',
        name: 'DoctorEarnings',
        component: () => import('@/views/doctor/DoctorEarningsView.vue'),
        meta: { role: 'doctor' },
      },
      {
        path: 'doctor/profile',
        name: 'DoctorProfile',
        component: () => import('@/views/doctor/DoctorProfileView.vue'),
        meta: { role: 'doctor', hideNavbar: true },
      },
      {
        path: 'doctor/notifications',
        name: 'DoctorNotifications',
        component: () => import('@/views/doctor/DoctorNotificationsView.vue'),
        meta: { role: 'doctor', hideNavbar: true },
      },
      {
        path: 'doctor/clinics',
        name: 'DoctorClinics',
        component: () => import('@/views/doctor/DoctorClinicsView.vue'),
        meta: { role: 'doctor' },
      },
      {
        path: 'clinic',
        name: 'ClinicDashboard',
        component: ClinicDashBoard,
        meta: { role: 'clinic' },
      },
      {
        path: 'clinic/doctors',
        name: 'ClinicDoctors',
        component: () => import('@/views/clinic/ClinicDoctorsView.vue'),
        meta: { role: 'clinic' },
      },
      {
        path: 'clinic/consultations',
        name: 'ClinicConsultations',
        component: () => import('@/views/clinic/ClinicConsultationsView.vue'),
        meta: { role: 'clinic' },
      },
      {
        path: 'clinic/appointments',
        name: 'ClinicAppointments',
        component: () => import('@/views/clinic/ClinicAppointmentsView.vue'),
        meta: { role: 'clinic' },
      },
      {
        path: 'clinic/profile',
        name: 'ClinicProfile',
        component: () => import('@/views/clinic/ClinicProfileView.vue'),
        meta: { role: 'clinic', hideNavbar: true },
      },
      {
        path: 'patient/profile',
        name: 'PatientProfile',
        component: () => import('@/views/patient/PatientProfileView.vue'),
        meta: { role: 'patient', hideNavbar: true },
      },
      {
        path: 'patient/book-appointment',
        name: 'BookAppointment',
        component: () => import('@/views/patient/BookAppointmentView.vue'),
        meta: { role: 'patient' },
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, left: 0 });
        }, 50);
      });
    }
  }
});

// UPDATED Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.isGuest;
  const requiredRole = to.meta.role;

  if (requiresAuth && !authStore.isLoggedIn) {
    // Case 1: User is not logged in but tries to access a protected page.
    let targetRole = requiredRole || authStore.userRole;
    if (!targetRole) {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        try { targetRole = JSON.parse(storedUser)?.role; } catch { /* ignore */ }
      }
      if (!targetRole) {
        targetRole = localStorage.getItem('userType')?.toLowerCase();
      }
    }
    if (!targetRole) {
      if (to.path.includes('/doctor')) targetRole = 'doctor';
      else if (to.path.includes('/clinic')) targetRole = 'clinic';
      else targetRole = 'patient';
    }
    next({ name: 'Login', params: { role: targetRole } });
  } else if (isGuest && authStore.isLoggedIn) {
    // Case 2: User is already logged in but tries to access a guest page.
    next(`/dashboard/${authStore.userRole}`);
  } else if (requiresAuth && authStore.isLoggedIn && requiredRole && requiredRole !== authStore.userRole) {
    // Case 3: User is logged in but tries to access a page of another role.
    next(`/dashboard/${authStore.userRole}`);
  }
  else {
    // Case 4: Access is allowed.
    next();
  }
});

export default router;
