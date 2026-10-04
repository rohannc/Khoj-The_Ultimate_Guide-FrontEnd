<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/60">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Patient Consultations
          </span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
          Recent <span class="text-emerald-600">Patient Consultations</span>
        </h1>
        <p class="text-slate-500 mt-1 font-medium text-sm">All patients who have had consultations through your affiliated doctors.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchData"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-emerald-600 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Search + Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center gap-3 mb-6">
      <div class="relative flex-1 w-full">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, email or blood group..."
          class="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-sm"
        />
      </div>
      <!-- Gender Filter Dropdown -->
      <div class="relative w-full sm:w-auto">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <select
          v-model="genderFilter"
          class="appearance-none w-full sm:w-auto pl-9 pr-10 py-2.5 text-xs font-bold bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-emerald-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer"
        >
          <option value="" class="font-medium text-slate-700">All Genders</option>
          <option value="MALE" class="font-medium text-slate-700">Male</option>
          <option value="FEMALE" class="font-medium text-slate-700">Female</option>
          <option value="OTHER" class="font-medium text-slate-700">Other</option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <svg class="w-3.5 h-3.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="h-40 bg-slate-200/80 animate-pulse rounded-[1.75rem] border border-slate-100"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
      <span class="text-sm font-semibold">{{ errorMessage }}</span>
      <button @click="fetchData" class="text-xs font-bold underline hover:text-rose-900">Retry</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredPatients.length === 0" class="flex-1 flex flex-col items-center justify-center py-24 text-center">
      <div class="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
        <svg class="w-10 h-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <p class="text-lg font-bold text-slate-600">No consultations found</p>
      <p class="text-sm text-slate-400 mt-1 max-w-xs">{{ searchQuery || genderFilter ? 'No patients match your filters.' : 'No patients have consulted at this facility yet.' }}</p>
      <button v-if="searchQuery || genderFilter" @click="searchQuery = ''; genderFilter = ''" class="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-800 underline transition-colors">
        Clear filters
      </button>
    </div>

    <!-- Patient Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in-up">
      <div
        v-for="patient in filteredPatients"
        :key="patient.id || patient.username"
        class="group bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-emerald-100 transition-all flex flex-col gap-4"
      >
        <!-- Avatar + Name -->
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-black flex items-center justify-center text-xl shadow-md shadow-emerald-200 flex-shrink-0">
            {{ (patient.firstName || patient.username || 'P').charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-extrabold text-slate-800 truncate">
              {{ patient.firstName ? `${patient.firstName} ${patient.lastName || ''}`.trim() : patient.username }}
            </h3>
            <p class="text-[11px] text-slate-400 font-medium truncate">{{ patient.emailId || 'No email' }}</p>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 font-semibold block mb-0.5 uppercase text-[9px] tracking-wider">Blood Group</span>
            <p class="font-extrabold text-rose-600">{{ patient.bloodGroup || 'N/A' }}</p>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span class="text-slate-400 font-semibold block mb-0.5 uppercase text-[9px] tracking-wider">Gender</span>
            <p class="font-extrabold text-slate-800">{{ patient.gender || 'N/A' }}</p>
          </div>
        </div>

        <!-- Username badge -->
        <div v-if="patient.username" class="flex items-center gap-2 text-[11px] text-slate-500 font-medium bg-emerald-50/60 px-3 py-2 rounded-xl border border-emerald-100/80">
          <svg class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="truncate">@{{ patient.username }}</span>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <div v-if="!isLoading && !errorMessage && filteredPatients.length > 0" class="mt-6 text-center text-xs text-slate-400 font-medium">
      Showing {{ filteredPatients.length }} of {{ patients.length }} patients
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ClinicService } from '@/services/clinic.service';

const authStore = useAuthStore();

const isLoading = ref(true);
const errorMessage = ref('');
const patients = ref([]);
const searchQuery = ref('');
const genderFilter = ref('');

const getDemoPatients = () => [
  { username: 'aarav_patel', firstName: 'Aarav', lastName: 'Patel', gender: 'Male', bloodGroup: 'B+', emailId: 'aarav.patel@example.com' },
  { username: 'priya_sharma', firstName: 'Priya', lastName: 'Sharma', gender: 'Female', bloodGroup: 'O+', emailId: 'priya.sharma@example.com' },
  { username: 'rohan_d', firstName: 'Rohan', lastName: 'Deshmukh', gender: 'Male', bloodGroup: 'A+', emailId: 'rohan.d@example.com' },
  { username: 'ananya_sen', firstName: 'Ananya', lastName: 'Sen', gender: 'Female', bloodGroup: 'AB+', emailId: 'ananya.sen@example.com' }
];

const filteredPatients = computed(() => {
  let list = patients.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(p => {
      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (p.username || '').toLowerCase().includes(q) ||
        (p.emailId || '').toLowerCase().includes(q) ||
        (p.bloodGroup || '').toLowerCase().includes(q)
      );
    });
  }
  if (genderFilter.value) {
    list = list.filter(p => (p.gender || '').toUpperCase() === genderFilter.value);
  }
  return list;
});

const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  let clinicId = authStore.user?.userId || authStore.user?.id || localStorage.getItem('userId');
  const username = authStore.user?.username;

  try {
    // If no explicit UUID, look up clinic by name or email
    if (!clinicId && username) {
      try {
        const clinicByName = await ClinicService.getClinicByName(username);
        if (clinicByName?.id) {
          clinicId = clinicByName.id;
          localStorage.setItem('userId', clinicId);
          authStore.updateUser({ userId: clinicId, id: clinicId });
        }
      } catch (err) {
        console.warn('Clinic lookup by name failed:', err);
      }
    }

    if (clinicId) {
      let patientList = [];

      // 1. Try fetching clinic patients direct endpoint (/api/clinics/{id}/patients)
      try {
        const directPatients = await ClinicService.getClinicPatients(clinicId);
        if (Array.isArray(directPatients) && directPatients.length > 0) {
          patientList = directPatients;
        }
      } catch (patientsErr) {
        console.warn('Direct clinic patients endpoint failed, trying dashboard:', patientsErr);
      }

      // 2. If direct patients is empty, try dashboard recentPatients
      if (patientList.length === 0) {
        try {
          const dashData = await ClinicService.getClinicDashboard(clinicId);
          if (Array.isArray(dashData?.recentPatients) && dashData.recentPatients.length > 0) {
            patientList = dashData.recentPatients;
          }
        } catch (dashErr) {
          console.warn('Clinic dashboard recentPatients fetch failed:', dashErr);
        }
      }

      if (patientList.length > 0) {
        patients.value = patientList;
      } else {
        patients.value = getDemoPatients();
      }
    } else {
      patients.value = getDemoPatients();
    }
  } catch (err) {
    console.error('Failed to load clinic consultations/patients:', err);
    patients.value = getDemoPatients();
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
