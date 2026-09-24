<template>
  <div class="min-h-screen bg-blue-50/50 font-sans">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-40">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="#" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold shadow-md">K</div>
              <span class="font-extrabold text-xl tracking-tight text-slate-900">KhojHealth</span>
            </a>
          </div>

          <!-- Right side menu -->
          <div class="flex items-center gap-4">
            <!-- Request Affiliation Button (Desktop) -->
            <button type="button" class="hidden md:inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Request Affiliation
            </button>

            <!-- Profile Dropdown -->
            <div class="relative" ref="profileDropdownRef">
              <button @click="toggleUserDropdown" type="button" class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <img class="w-9 h-9 rounded-full object-cover" src="https://ui-avatars.com/api/?name=Alan+Turing&background=f1f5f9&color=0f172a" alt="User Avatar">
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="isUserDropdownOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 z-50">
                  <div class="px-4 py-3">
                    <p class="text-sm font-medium text-slate-900">Dr. {{ doctor.lastName }}</p>
                    <p class="text-xs font-medium text-slate-500 truncate">{{ authStore.user?.username || 'doctor@example.com' }}</p>
                  </div>
                  <div class="py-1">
                    <router-link to="/profile" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">Profile</router-link>
                    <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">Dashboard</a>
                  </div>
                  <div class="py-1">
                    <a @click.prevent="logout" href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</a>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Mobile menu button -->
            <button @click="toggleMobileMenu" class="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="#" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-900 hover:bg-slate-50">Request Affiliation</a>
        </div>
      </div>
    </nav>

    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Alert Banner -->
      <Transition name="fade">
        <div v-if="isAlertVisible" class="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <h3 class="text-sm font-bold text-amber-800">Verify Your Email Address</h3>
              <p class="text-sm text-amber-700 mt-1">Please check your inbox for a verification link. Verifying your email is important for account security.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button @click="resendVerificationEmail" class="flex-1 sm:flex-none px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-bold rounded-xl transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none whitespace-nowrap">Resend Link</button>
            <button @click="isAlertVisible = false" class="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </Transition>

      <!-- Dashboard Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, Dr. {{ doctor.lastName }}!</h1>
        <p class="text-lg text-slate-500 mt-1 font-medium">Here's what your day looks like.</p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Today's Schedule -->
        <div class="bg-white rounded-3xl shadow-md border border-blue-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Today's Schedule</h2>
          </div>
          <div class="flex-grow flex flex-col justify-between">
            <div class="flex-grow flex flex-col items-center justify-center">
              <div class="w-24 h-24 rounded-full bg-blue-50 border-[6px] border-blue-100 flex items-center justify-center mb-4">
                <span class="text-4xl font-extrabold text-blue-600">{{ scheduleSummary.totalAppointments }}</span>
              </div>
              <p class="text-slate-500 font-medium text-center">Total Appointments</p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-4 flex flex-col gap-2 border border-slate-100 my-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Patient</span>
                <span class="text-sm font-bold text-slate-900">{{ scheduleSummary.nextPatient }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</span>
                <div class="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ scheduleSummary.nextTime }}
                </div>
              </div>
            </div>
            <button class="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 mt-auto">View Full Schedule</button>
          </div>
        </div>

        <!-- Patient Queue (Spans 2 columns on lg screens) -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-md border border-blue-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Patient Queue</h2>
          </div>
          <div class="flex-grow">
            <div class="bg-slate-50 rounded-2xl p-2 border border-slate-100 h-full">
              <ul class="divide-y divide-slate-200/60 h-full flex flex-col">
                <li v-for="patient in patientQueue" :key="patient.id" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 border border-blue-200 shadow-sm">
                      {{ patient.name.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-base font-bold text-slate-900">{{ patient.name }}</span>
                      <span class="text-sm font-medium text-slate-500">{{ patient.reason }}</span>
                    </div>
                  </div>
                  <div class="inline-flex items-center px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-semibold text-blue-600 self-start sm:self-auto min-w-[80px] justify-center">
                    {{ patient.status }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="bg-white rounded-3xl shadow-md border border-blue-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Messages</h2>
          </div>
          <div class="flex-grow flex flex-col items-center justify-center">
            <div class="w-24 h-24 rounded-full bg-blue-50 border-[6px] border-blue-100 flex items-center justify-center mb-4 relative">
              <span class="text-4xl font-extrabold text-blue-600">{{ messages.unread }}</span>
              <span class="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <p class="text-slate-500 font-medium">Unread Messages</p>
          </div>
          <a href="#" class="block text-center w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">Go to Inbox</a>
        </div>

        <!-- Quick Actions -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-md border border-blue-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Quick Actions</h2>
          </div>
          <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Manage Patients
              <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Start a New Chart
              <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Update Availability
              <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              View Lab Results
              <svg class="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
