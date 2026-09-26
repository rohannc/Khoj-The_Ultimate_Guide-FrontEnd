<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40">
    <!-- Header with Back & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/dashboard/patient" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Appointments
          </h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            {{ filteredAppointments.length }} Total
          </span>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Review your schedule, doctor consultations, and clinic visits.</p>
      </div>

      <!-- Controls & Search -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search doctor or clinic..."
            class="pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400 w-44 sm:w-60"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Custom Luxury Interactive Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            type="button"
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center gap-2.5 pl-3.5 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200/80 bg-white/95 text-slate-700 shadow-sm hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all cursor-pointer backdrop-blur-md group"
            :class="{ 'ring-2 ring-indigo-500/20 border-indigo-500 shadow-indigo-500/10': isDropdownOpen }"
          >
            <span class="w-2 h-2 rounded-full" :class="selectedStatusColor"></span>
            <span class="text-slate-700">{{ selectedStatusLabel }}</span>
            <svg
              class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200"
              :class="{ 'rotate-180 text-indigo-600': isDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Popover Menu -->
          <transition
            enter-active-class="transition duration-150 ease-out origin-top-right"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in origin-top-right"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-900/10 p-1.5 z-30 space-y-0.5"
            >
              <button
                v-for="opt in statusOptions"
                :key="opt.value"
                @click="selectStatus(opt.value)"
                type="button"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left group"
                :class="statusFilter === opt.value ? 'bg-indigo-50/80 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full" :class="opt.dotClass"></span>
                  <span>{{ opt.label }}</span>
                </div>
                <svg
                  v-if="statusFilter === opt.value"
                  class="w-4 h-4 text-indigo-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Error Message Banner -->
    <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-semibold">{{ errorMessage }}</span>
      </div>
      <button @click="loadAppointments" class="text-xs font-bold underline hover:text-rose-900 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-28 bg-white/60 animate-pulse rounded-2xl border border-slate-200/60"></div>
    </div>

    <!-- Appointments Content -->
    <div v-else-if="filteredAppointments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="apt in filteredAppointments"
        :key="apt.id"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <!-- Doctor Name & Status Badge -->
          <div class="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Dr. {{ apt.doctorName }}
              </h3>
              <p class="text-xs font-bold text-indigo-600 tracking-wide mt-0.5">
                {{ apt.specialty || 'General Specialist' }}
              </p>
            </div>
            <span
              class="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
              :class="getStatusClass(apt.status)"
            >
              {{ apt.status || 'Scheduled' }}
            </span>
          </div>

          <!-- Clinic Pill Banner -->
          <div v-if="apt.clinicName" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-600 text-xs font-semibold mb-3">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{{ apt.clinicName }}</span>
          </div>

          <!-- Reason -->
          <div v-if="apt.reason" class="text-xs text-slate-600 bg-slate-50/80 rounded-xl p-2.5 mb-4 border border-slate-100">
            <span class="font-bold text-slate-700">Reason:</span> {{ apt.reason }}
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs gap-2">
          <!-- Appointment Date -->
          <div class="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ apt.date }}</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Token Badge -->
            <div
              class="flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg border"
              :class="apt.tokenNumber && apt.tokenNumber !== 'Unallocated' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200/60'"
              :title="apt.tokenNumber && apt.tokenNumber !== 'Unallocated' ? 'Allocated Queue Token' : 'Queue Token Not Yet Allocated'"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>{{ apt.tokenNumber || 'Unallocated' }}</span>
            </div>

            <!-- Time Badge -->
            <div
              class="flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg border"
              :class="apt.time && apt.time !== 'Unassigned' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80' : 'bg-slate-50 text-slate-500 border-slate-200/60'"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ apt.time || 'Unassigned' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 px-4 my-auto">
      <div class="w-16 h-16 bg-indigo-100/70 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/60 shadow-sm">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800">No appointments found</h3>
      <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
        {{ searchQuery || statusFilter !== 'ALL' ? 'No appointments match your filters. Try adjusting search or status.' : 'You have no scheduled appointments at this time.' }}
      </p>
      <router-link
        to="/dashboard/patient"
        class="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all"
      >
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { PatientService } from '@/services/patient.service';

const authStore = useAuthStore();
const isLoading = ref(true);
const appointments = ref([]);
const searchQuery = ref('');
const statusFilter = ref('ALL');
const errorMessage = ref('');

// Custom Dropdown State & Options
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const statusOptions = [
  { value: 'ALL', label: 'All Status', dotClass: 'bg-indigo-500' },
  { value: 'SCHEDULED', label: 'Scheduled', dotClass: 'bg-emerald-500' },
  { value: 'COMPLETED', label: 'Completed', dotClass: 'bg-blue-500' },
  { value: 'CANCELLED', label: 'Cancelled', dotClass: 'bg-rose-500' }
];

const selectedStatusOption = computed(() => {
  return statusOptions.find(o => o.value === statusFilter.value) || statusOptions[0];
});

const selectedStatusLabel = computed(() => selectedStatusOption.value.label);
const selectedStatusColor = computed(() => selectedStatusOption.value.dotClass);

const selectStatus = (val) => {
  statusFilter.value = val;
  isDropdownOpen.value = false;
};

// Outside click handler to close dropdown
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

const getStatusClass = (status) => {
  const s = (status || '').toUpperCase();
  if (s === 'SCHEDULED' || s === 'CONFIRMED') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s === 'COMPLETED') return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (s === 'CANCELLED') return 'bg-rose-50 text-rose-700 border border-rose-200';
  return 'bg-amber-50 text-amber-700 border border-amber-200';
};

const filteredAppointments = computed(() => {
  return appointments.value.filter(apt => {
    const matchesSearch = !searchQuery.value ||
      (apt.doctorName && apt.doctorName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (apt.specialty && apt.specialty.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (apt.clinicName && apt.clinicName.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesStatus = statusFilter.value === 'ALL' ||
      (apt.status && apt.status.toUpperCase() === statusFilter.value);

    return matchesSearch && matchesStatus;
  });
});

const loadAppointments = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id || '';
    const username = authStore.user?.username || '';
    
    // Try fetching dedicated appointments
    let list = [];
    try {
      list = await PatientService.getAppointments(patientId, username);
    } catch (directErr) {
      console.warn('Direct appointments endpoint failed or restricted, trying dashboard data:', directErr);
    }
    
    // Fallback to dashboard data if direct list is empty or direct endpoint was restricted/404
    if (!list || list.length === 0) {
      const dash = await PatientService.getDashboardData(patientId, username);
      list = dash.upcomingAppointments || [];
    }
    
    appointments.value = list || [];
  } catch (err) {
    console.warn('Error loading appointments:', err);
    errorMessage.value = err.message || 'Unable to load appointments from server.';
    appointments.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadAppointments();
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
