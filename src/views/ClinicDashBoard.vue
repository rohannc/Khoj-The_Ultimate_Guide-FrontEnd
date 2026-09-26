<template>
  <LogoutModal :show="showLogoutModal" @confirm="confirmLogout" @cancel="showLogoutModal = false" />
  <div class="min-h-screen bg-indigo-50/50 font-sans">
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
            <!-- Profile Dropdown -->
            <div class="relative" ref="profileDropdownRef">
              <button @click="toggleUserDropdown" type="button" class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <img class="w-9 h-9 rounded-full object-cover" src="https://ui-avatars.com/api/?name=City+Hospital&background=e0e7ff&color=312e81" alt="Clinic Avatar">
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
                    <p class="text-sm font-medium text-slate-900">{{ clinic.name }}</p>
                    <p class="text-xs font-medium text-slate-500 truncate">{{ authStore.user?.username || 'clinic@example.com' }}</p>
                  </div>
                  <div class="py-1">
                    <router-link to="/profile" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Profile</router-link>
                    <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Dashboard</a>
                  </div>
                  <div class="py-1">
                    <a @click.prevent="showLogoutModal = true" href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</a>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Mobile menu button -->
            <button @click="toggleMobileMenu" class="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
        <!-- Add mobile menu items here if needed -->
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
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, {{ clinic.name }}!</h1>
        <p class="text-lg text-slate-500 mt-1 font-medium">Manage your clinic operations here.</p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Today's Appointments -->
        <div class="bg-white rounded-3xl shadow-md border border-indigo-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Today's Appointments</h2>
          </div>
          <div class="flex-grow flex flex-col justify-between">
            <div class="flex-grow flex flex-col items-center justify-center">
              <div class="w-24 h-24 rounded-full bg-indigo-50 border-[6px] border-indigo-100 flex items-center justify-center mb-4">
                <span class="text-4xl font-extrabold text-indigo-600">{{ clinicStats.appointmentsToday }}</span>
              </div>
              <p class="text-slate-500 font-medium text-center">Total Across All Doctors</p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-4 flex flex-col gap-2 border border-slate-100 my-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Checked In</span>
                <span class="text-sm font-bold text-green-600">{{ clinicStats.checkedIn }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Waiting</span>
                <span class="text-sm font-bold text-amber-600">{{ clinicStats.waiting }}</span>
              </div>
            </div>
            <button class="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 mt-auto">View Schedule</button>
          </div>
        </div>

        <!-- Active Staff (Spans 2 columns on lg screens) -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-md border border-indigo-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <h2 class="text-lg font-bold text-slate-800">Active Staff</h2>
            </div>
            <button class="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Manage</button>
          </div>
          <div class="flex-grow">
            <div class="bg-slate-50 rounded-2xl p-2 border border-slate-100 h-full">
              <ul class="divide-y divide-slate-200/60 h-full flex flex-col">
                <li v-for="staff in activeStaff" :key="staff.id" class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center flex-shrink-0 border border-indigo-200 shadow-sm">
                      {{ staff.name.charAt(4) }} <!-- Assuming 'Dr. ' prefix -->
                    </div>
                    <div class="flex flex-col">
                      <span class="text-base font-bold text-slate-900">{{ staff.name }}</span>
                      <span class="text-sm font-medium text-slate-500">{{ staff.role }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 self-start sm:self-auto">
                    <span class="text-sm font-medium text-slate-600">
                      {{ staff.patientsWaiting }} waiting
                    </span>
                    <span class="w-2 h-2 rounded-full" :class="staff.status === 'Available' ? 'bg-green-500' : 'bg-amber-500'"></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Operations -->
        <div class="bg-white rounded-3xl shadow-md border border-indigo-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Operations</h2>
          </div>
          <div class="flex-grow flex flex-col items-center justify-center gap-4">
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 w-full flex items-center justify-between">
              <div class="flex items-center gap-3">
                 <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                 </div>
                 <span class="font-bold text-slate-700">Pending Requests</span>
              </div>
              <span class="text-xl font-extrabold text-indigo-600">{{ clinicStats.pendingRequests }}</span>
            </div>
             <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 w-full flex items-center justify-between">
              <div class="flex items-center gap-3">
                 <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                 </div>
                 <span class="font-bold text-slate-700">New Messages</span>
              </div>
              <span class="text-xl font-extrabold text-indigo-600">{{ clinicStats.newMessages }}</span>
            </div>
          </div>
          <button class="w-full py-3 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm">View Reports</button>
        </div>

        <!-- Quick Actions -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-md border border-indigo-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Quick Actions</h2>
          </div>
          <div class="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Register Patient
              <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Manage Billing
              <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Inventory Check
              <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-2xl transition-colors border border-slate-200 group">
              Update Details
              <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
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
import LogoutModal from '@/components/LogoutModal.vue';

const authStore = useAuthStore();
const router = useRouter();

const isUserDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isAlertVisible = ref(true);
const showLogoutModal = ref(false);
const profileDropdownRef = ref(null);

const toggleUserDropdown = () => isUserDropdownOpen.value = !isUserDropdownOpen.value;
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;

const confirmLogout = () => {
  showLogoutModal.value = false;
  authStore.logout();
  router.push('/login/clinic');
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

const clinic = ref({
  name: 'City Central Clinic',
});

const clinicStats = ref({
  appointmentsToday: 45,
  checkedIn: 12,
  waiting: 5,
  pendingRequests: 8,
  newMessages: 14
});

const activeStaff = ref([
  { id: 1, name: 'Dr. Alan Turing', role: 'General Practice', patientsWaiting: 3, status: 'Busy' },
  { id: 2, name: 'Dr. Ada Lovelace', role: 'Pediatrics', patientsWaiting: 1, status: 'Available' },
  { id: 3, name: 'Dr. Grace Hopper', role: 'Cardiology', patientsWaiting: 0, status: 'Available' },
  { id: 4, name: 'Dr. John von Neumann', role: 'Neurology', patientsWaiting: 1, status: 'Busy' },
]);

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
