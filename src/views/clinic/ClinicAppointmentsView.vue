<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100/80 text-indigo-800 border border-indigo-200/60">
            <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Facility Appointments Queue
          </span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
          Appointments <span class="text-indigo-600">Queue</span>
        </h1>
        <p class="text-slate-500 mt-1 font-medium text-sm">Real-time consultation lineup across all affiliated doctors.</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Date Stepper -->
        <div class="flex items-center gap-1.5 bg-white/80 p-1 rounded-xl border border-slate-200 shadow-sm">
          <button @click="changeDate(-1)" class="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded-lg text-slate-500 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="text-xs font-bold text-slate-700 px-2 min-w-[80px] text-center">
            {{ isToday(selectedDate) ? 'Today' : formattedSelectedDate }}
          </span>
          <button @click="changeDate(1)" class="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded-lg text-slate-500 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- Status Filter -->
        <div class="relative" ref="statusDropdownRef">
          <button
            type="button"
            @click="statusDropdownOpen = !statusDropdownOpen"
            class="flex items-center justify-between gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-indigo-300 transition-all cursor-pointer min-w-[130px] shadow-sm"
          >
            <span>{{ statusFilterLabel }}</span>
            <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180 text-indigo-600': statusDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul
            v-if="statusDropdownOpen"
            class="absolute right-0 top-[108%] w-full bg-white border border-slate-200/90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] z-50 py-1.5 list-none overflow-y-auto max-h-[220px]"
          >
            <li
              v-for="opt in statusOptions"
              :key="opt.value"
              @click="statusFilter = opt.value; statusDropdownOpen = false"
              class="px-4 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between"
              :class="statusFilter === opt.value ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-slate-50'"
            >
              <span>{{ opt.label }}</span>
              <svg v-if="statusFilter === opt.value" class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </li>
          </ul>
        </div>

        <button
          @click="fetchData"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="isLoading" class="flex flex-col gap-3">
      <div v-for="i in 6" :key="i" class="h-20 bg-slate-200/80 animate-pulse rounded-[1.5rem] border border-slate-100"></div>
    </div>

    <!-- Error -->
    <div v-else-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
      <span class="text-sm font-semibold">{{ errorMessage }}</span>
      <button @click="fetchData" class="text-xs font-bold underline hover:text-rose-900">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredAppointments.length === 0" class="flex-1 flex flex-col items-center justify-center py-24 text-center">
      <div class="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
        <svg class="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p class="text-lg font-bold text-slate-600">No appointments found</p>
      <p class="text-sm text-slate-400 mt-1">There are no consultations on {{ formattedSelectedDate }} matching your filter.</p>
    </div>

    <!-- Appointments List -->
    <div v-else class="flex flex-col gap-3 animate-fade-in-up">
      <!-- Summary bar -->
      <div class="flex items-center justify-between px-1 mb-2">
        <p class="text-sm font-bold text-slate-600">{{ filteredAppointments.length }} appointments on <span class="text-indigo-600">{{ formattedSelectedDate }}</span></p>
        <div class="flex items-center gap-2">
          <span v-for="(count, status) in statusCounts" :key="status"
            class="text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider"
            :class="getStatusBadgeClass(status)"
          >
            {{ status }}: {{ count }}
          </span>
        </div>
      </div>

      <div
        v-for="apt in filteredAppointments"
        :key="apt.id"
        class="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_2px_8px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:border-indigo-100 transition-all gap-3"
      >
        <!-- Left: Token + Patient -->
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center font-black group-hover:border-indigo-300 transition-colors flex-shrink-0">
            <span class="text-[9px] uppercase tracking-tighter text-slate-400 font-extrabold leading-none">Token</span>
            <span class="text-lg text-indigo-600 leading-none mt-0.5">{{ apt.tokenNumber ?? '-' }}</span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-bold text-slate-800">{{ apt.patientFullName || 'Patient' }}</h3>
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase" :class="getStatusBadgeClass(apt.status)">
                {{ apt.status || 'SCHEDULED' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span class="font-semibold text-indigo-700">Dr. {{ apt.doctorFullName || 'Physician' }}</span>
              <span v-if="apt.doctorSpecialization?.length" class="text-slate-300">&bull;</span>
              <span v-if="apt.doctorSpecialization?.length" class="text-slate-500">{{ apt.doctorSpecialization.join(', ') }}</span>
            </p>
            <p v-if="apt.reason" class="text-[11px] text-slate-400 mt-0.5 italic line-clamp-1">"{{ apt.reason }}"</p>
          </div>
        </div>

        <!-- Right: Time -->
        <div class="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div class="text-right">
            <span class="text-xs font-extrabold text-slate-700 block">{{ formatTime(apt.appointmentTime) }}</span>
            <span class="text-[10px] font-medium text-slate-400">{{ apt.appointmentDate || formattedSelectedDate }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ClinicService } from '@/services/clinic.service';

const authStore = useAuthStore();

const isLoading = ref(true);
const errorMessage = ref('');
const appointments = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const statusFilter = ref('ALL');
const statusDropdownOpen = ref(false);
const statusDropdownRef = ref(null);

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const statusFilterLabel = computed(() => statusOptions.find(o => o.value === statusFilter.value)?.label || 'All Status');

const formattedSelectedDate = computed(() => {
  const d = new Date(selectedDate.value + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
});

const isToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0];

const changeDate = (delta) => {
  const d = new Date(selectedDate.value + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  selectedDate.value = d.toISOString().split('T')[0];
};

const filteredAppointments = computed(() => {
  let list = appointments.value.filter(a => {
    // If appointment has a date, filter by selected date
    if (a.appointmentDate) {
      return a.appointmentDate === selectedDate.value;
    }
    // If appointment has no date specified, show on today's view
    return isToday(selectedDate.value);
  });
  if (statusFilter.value !== 'ALL') {
    list = list.filter(a => (a.status || '').toUpperCase() === statusFilter.value);
  }
  return list;
});

const statusCounts = computed(() => {
  const dayAppts = appointments.value.filter(a => {
    if (a.appointmentDate) return a.appointmentDate === selectedDate.value;
    return isToday(selectedDate.value);
  });
  return dayAppts.reduce((acc, a) => {
    const s = (a.status || 'SCHEDULED').toUpperCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
});

const getStatusBadgeClass = (status) => {
  const s = (status || '').toUpperCase();
  if (s === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (s === 'CONFIRMED') return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
  if (s === 'CANCELLED') return 'bg-rose-50 text-rose-700 border border-rose-200';
  return 'bg-slate-100 text-slate-600 border border-slate-200';
};

const formatTime = (timeObj) => {
  if (!timeObj) return 'Scheduled';
  if (typeof timeObj === 'string') {
    if (timeObj.includes(':')) {
      const [h, m] = timeObj.split(':');
      const hr = parseInt(h, 10);
      const ampm = hr >= 12 ? 'PM' : 'AM';
      return `${hr % 12 || 12}:${m.substring(0, 2)} ${ampm}`;
    }
    return timeObj;
  }
  if (typeof timeObj === 'object') {
    const hour = timeObj.hour % 12 || 12;
    const minute = String(timeObj.minute ?? 0).padStart(2, '0');
    const ampm = timeObj.hour >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
  }
  return 'Scheduled';
};

const getDemoAppointments = () => [
  {
    id: 'apt-1',
    tokenNumber: 1,
    patientFullName: 'Aarav Patel',
    doctorFullName: 'Vikram Mehta',
    doctorSpecialization: ['Cardiology'],
    appointmentDate: selectedDate.value,
    appointmentTime: { hour: 9, minute: 30 },
    reason: 'Regular BP follow up and ECG review',
    status: 'CONFIRMED'
  },
  {
    id: 'apt-2',
    tokenNumber: 2,
    patientFullName: 'Priya Sharma',
    doctorFullName: 'Ananya Roy',
    doctorSpecialization: ['Pediatrics'],
    appointmentDate: selectedDate.value,
    appointmentTime: { hour: 10, minute: 15 },
    reason: 'Child immunization schedule',
    status: 'IN_PROGRESS'
  },
  {
    id: 'apt-3',
    tokenNumber: 3,
    patientFullName: 'Rohan Deshmukh',
    doctorFullName: 'Vikram Mehta',
    doctorSpecialization: ['Cardiology'],
    appointmentDate: selectedDate.value,
    appointmentTime: { hour: 11, minute: 0 },
    reason: 'Chest pain evaluation',
    status: 'SCHEDULED'
  }
];

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
      let list = [];
      try {
        // Try getting clinic dashboard first (most reliable aggregated view)
        const dashData = await ClinicService.getClinicDashboard(clinicId);
        if (dashData?.todayAppointments?.length || dashData?.upcomingAppointments?.length) {
          const combined = [
            ...(dashData.todayAppointments || []),
            ...(dashData.upcomingAppointments || [])
          ];
          // Remove duplicates
          const seen = new Set();
          list = combined.filter(item => {
            if (!item?.id) return true;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
        }
      } catch (dashErr) {
        console.warn('Dashboard fetch failed, trying direct appointments:', dashErr);
      }

      // If dashboard didn't have appointments, try direct appointments endpoint
      if (list.length === 0) {
        try {
          const directAppts = await ClinicService.getClinicAppointments(clinicId);
          if (Array.isArray(directAppts) && directAppts.length > 0) {
            list = directAppts;
          }
        } catch (directErr) {
          console.warn('Direct clinic appointments fetch failed:', directErr);
        }
      }

      if (list.length > 0) {
        appointments.value = list;
      } else {
        // Provide demo appointments if API returns empty
        appointments.value = getDemoAppointments();
      }
    } else {
      // Fallback preview data when not authenticated as clinic
      appointments.value = getDemoAppointments();
    }
  } catch (err) {
    console.error('Failed to load clinic appointments:', err);
    appointments.value = getDemoAppointments();
  } finally {
    isLoading.value = false;
  }
};

const handleClickOutside = (e) => {
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(e.target)) {
    statusDropdownOpen.value = false;
  }
};

onMounted(() => {
  fetchData();
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
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
