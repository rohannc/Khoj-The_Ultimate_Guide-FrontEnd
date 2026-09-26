<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40">
    <!-- Header with Back & Filter -->
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
            Health Records
          </h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            {{ filteredRecords.length }} Documents
          </span>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">View and download your diagnostic lab reports, clinical notes, and scans.</p>
      </div>

      <!-- Controls & Search -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documents or types..."
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
            <span class="w-2 h-2 rounded-full" :class="selectedTypeColor"></span>
            <span class="text-slate-700">{{ selectedTypeLabel }}</span>
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
              class="absolute right-0 mt-2 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-900/10 p-1.5 z-30 space-y-0.5"
            >
              <button
                v-for="opt in typeOptions"
                :key="opt.value"
                @click="selectType(opt.value)"
                type="button"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left group"
                :class="typeFilter === opt.value ? 'bg-indigo-50/80 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full" :class="opt.dotClass"></span>
                  <span>{{ opt.label }}</span>
                </div>
                <svg
                  v-if="typeFilter === opt.value"
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
      <button @click="loadRecords" class="text-xs font-bold underline hover:text-rose-900 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-white/60 animate-pulse rounded-2xl border border-slate-200/60"></div>
    </div>

    <!-- Records Content -->
    <div v-else-if="filteredRecords.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="rec in filteredRecords"
        :key="rec.id"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60">
              {{ rec.documentType || 'Report' }}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
            {{ rec.documentTitle }}
          </h3>
          <p class="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Recorded: <span class="font-bold text-slate-700">{{ rec.testDate }}</span>
          </p>
        </div>

        <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
          <span class="text-emerald-600 font-bold inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Verified
          </span>
          <a
            v-if="rec.documentUrl"
            :href="rec.documentUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors shadow-sm"
          >
            <span>View File</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            v-else
            @click="handlePreviewNotice"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
          >
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 px-4 my-auto">
      <div class="w-16 h-16 bg-indigo-100/70 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/60 shadow-sm">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800">No health records found</h3>
      <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
        {{ searchQuery || typeFilter !== 'ALL' ? 'No health records match your filter criteria.' : 'No medical records have been uploaded to your profile yet.' }}
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
const records = ref([]);
const searchQuery = ref('');
const typeFilter = ref('ALL');
const errorMessage = ref('');

// Custom Dropdown State & Options
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const typeOptions = [
  { value: 'ALL', label: 'All Categories', dotClass: 'bg-indigo-500' },
  { value: 'LAB', label: 'Lab Reports', dotClass: 'bg-emerald-500' },
  { value: 'IMAGING', label: 'Imaging & Scans', dotClass: 'bg-sky-500' },
  { value: 'PRESCRIPTION', label: 'Prescriptions', dotClass: 'bg-amber-500' },
  { value: 'DISCHARGE', label: 'Discharge Summaries', dotClass: 'bg-purple-500' }
];

const selectedTypeOption = computed(() => {
  return typeOptions.find(o => o.value === typeFilter.value) || typeOptions[0];
});

const selectedTypeLabel = computed(() => selectedTypeOption.value.label);
const selectedTypeColor = computed(() => selectedTypeOption.value.dotClass);

const selectType = (val) => {
  typeFilter.value = val;
  isDropdownOpen.value = false;
};

// Outside click handler to close dropdown
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

const handlePreviewNotice = () => {
  alert('Document file preview will be available upon clinical verification.');
};

const filteredRecords = computed(() => {
  return records.value.filter(rec => {
    const matchesSearch = !searchQuery.value ||
      (rec.documentTitle && rec.documentTitle.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (rec.documentType && rec.documentType.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesType = typeFilter.value === 'ALL' ||
      (rec.documentType && rec.documentType.toUpperCase().includes(typeFilter.value));

    return matchesSearch && matchesType;
  });
});

const loadRecords = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id || '';
    const username = authStore.user?.username || '';
    
    let list = await PatientService.getHealthRecords(patientId, username);

    if (!list || list.length === 0) {
      const dash = await PatientService.getDashboardData(patientId, username);
      list = dash.healthRecords || [];
    }

    records.value = list || [];
  } catch (err) {
    console.warn('Error loading health records:', err);
    errorMessage.value = err.message || 'Unable to load health records from server.';
    records.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadRecords();
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
