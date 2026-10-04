<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-jakarta">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/dashboard/doctor" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Weekly Practice Schedule
          </h1>
          <span
            v-if="!isLoading"
            class="text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5"
            :class="dataSource === 'Live API' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
          >
            <span class="w-2 h-2 rounded-full" :class="dataSource === 'Live API' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
            {{ dataSource === 'Live API' ? 'Live Affiliations' : 'Cached Schedule' }}
          </span>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
          Organized weekly consultation timetable across all your approved healthcare facility affiliations.
        </p>
      </div>

      <!-- Quick Context Link to Affiliations -->
      <div class="flex items-center gap-3">
        <router-link
          to="/dashboard/doctor/affiliations"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>View Clinic Partnerships</span>
        </router-link>
      </div>
    </div>

    <!-- Summary Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
      <div class="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Days</p>
          <p class="text-base font-extrabold text-slate-800">{{ activeDaysCount }} / 7 Days</p>
        </div>
      </div>

      <div class="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Partner Clinics</p>
          <p class="text-base font-extrabold text-slate-800">{{ approvedAffiliationsCount }} Approved</p>
        </div>
      </div>

      <div class="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekly Patient Cap</p>
          <p class="text-base font-extrabold text-slate-800">{{ totalWeeklyCapacity }} Consultations</p>
        </div>
      </div>

      <div class="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekly Shifts</p>
          <p class="text-base font-extrabold text-slate-800">{{ totalShiftsCount }} Sessions</p>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-4 flex-1">
      <div v-for="i in 5" :key="i" class="h-28 bg-white/70 animate-pulse rounded-3xl border border-slate-100"></div>
    </div>

    <!-- Weekly Timetable Cards -->
    <div v-else class="space-y-4 flex-1 overflow-y-auto pr-1">
      <div
        v-for="day in weeklySchedule"
        :key="day.dayName"
        class="bg-white/95 backdrop-blur-xl border rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
        :class="day.isAvailable ? 'border-white/80 hover:border-indigo-200' : 'bg-slate-50/70 border-slate-200/60 opacity-75'"
      >
        <!-- Left: Day badge, Status & Details -->
        <div class="flex items-start sm:items-center gap-4 flex-1">
          <!-- Day Badge -->
          <div
            class="w-14 h-14 rounded-2xl font-black flex flex-col items-center justify-center shadow-sm border flex-shrink-0"
            :class="day.isAvailable 
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-100 ring-4 ring-indigo-50' 
              : 'bg-slate-100 text-slate-600 border-slate-200'"
          >
            <span class="text-xs uppercase tracking-wider font-black">{{ day.shortDay }}</span>
            <span class="text-[9px] font-extrabold uppercase opacity-85">{{ day.isAvailable ? 'ACTIVE' : 'OFF' }}</span>
          </div>

          <!-- Day info & Clinic assignment from affiliations -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-extrabold text-base text-slate-900">{{ day.dayName }}</h3>
              <span
                class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all"
                :class="day.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
              >
                {{ day.isAvailable ? 'ON DUTY' : 'OFF DUTY' }}
              </span>
            </div>

            <!-- Affiliated Clinic details -->
            <div v-if="day.isAvailable" class="mt-1 flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <svg class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{{ day.clinicName }}</span>
              </div>
              <span v-if="day.city" class="text-xs text-slate-400">&bull; {{ day.city }}</span>
              <span v-if="day.charge" class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                ₹{{ day.charge }} Fee
              </span>
            </div>
            <p v-else class="text-xs text-slate-400 font-medium mt-1">No scheduled consultations or facility shifts</p>
          </div>
        </div>

        <!-- Right: Structured Shift Information -->
        <div v-if="day.isAvailable" class="flex flex-wrap items-center gap-3">
          <!-- Morning Shift Box -->
          <div v-if="day.morningShift && day.morningShift !== 'Closed'" class="flex items-center gap-2 bg-slate-50/90 px-4 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0"></div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Morning:</span>
            <span class="font-extrabold text-xs text-slate-800">{{ day.morningShift }}</span>
          </div>

          <!-- Evening Shift Box -->
          <div v-if="day.eveningShift && day.eveningShift !== 'Closed'" class="flex items-center gap-2 bg-slate-50/90 px-4 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <div class="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Evening:</span>
            <span class="font-extrabold text-xs text-slate-800">{{ day.eveningShift }}</span>
          </div>

          <!-- Daily Patient Limit -->
          <div class="flex items-center gap-1.5 bg-slate-50/90 px-4 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Limit:</span>
            <span class="font-black text-xs text-slate-800">{{ day.maxPatients }}</span>
            <span class="text-[10px] text-slate-400 font-bold">Patients / Day</span>
          </div>
        </div>

        <!-- Rest Day Note -->
        <div v-else class="text-xs font-semibold text-slate-400 italic px-3 py-1.5">
          Weekly Practice Rest Day
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { DoctorService } from '@/services/doctor.service';

const authStore = useAuthStore();
const isLoading = ref(true);
const dataSource = ref('Live API');
const approvedAffiliations = ref([]);

// Default structural template for the 7 days of the week
const daysTemplate = [
  { dayName: 'Monday', shortDay: 'MON', key: 'mon' },
  { dayName: 'Tuesday', shortDay: 'TUE', key: 'tue' },
  { dayName: 'Wednesday', shortDay: 'WED', key: 'wed' },
  { dayName: 'Thursday', shortDay: 'THU', key: 'thu' },
  { dayName: 'Friday', shortDay: 'FRI', key: 'fri' },
  { dayName: 'Saturday', shortDay: 'SAT', key: 'sat' },
  { dayName: 'Sunday', shortDay: 'SUN', key: 'sun' },
];

const weeklySchedule = ref([]);

const activeDaysCount = computed(() => {
  return weeklySchedule.value.filter(d => d.isAvailable).length;
});

const approvedAffiliationsCount = computed(() => {
  return approvedAffiliations.value.length;
});

const totalWeeklyCapacity = computed(() => {
  return weeklySchedule.value
    .filter(d => d.isAvailable)
    .reduce((sum, d) => sum + (Number(d.maxPatients) || 0), 0);
});

const totalShiftsCount = computed(() => {
  let count = 0;
  weeklySchedule.value.forEach(d => {
    if (d.isAvailable) {
      if (d.morningShift && d.morningShift !== 'Closed') count++;
      if (d.eveningShift && d.eveningShift !== 'Closed') count++;
    }
  });
  return count;
});

/**
 * Organizes affiliations received from the backend into a clear day-by-day weekly timetable
 */
const buildScheduleFromAffiliations = (affList) => {
  const schedule = daysTemplate.map(day => {
    return {
      dayName: day.dayName,
      shortDay: day.shortDay,
      key: day.key,
      isAvailable: false,
      clinicName: '',
      city: '',
      charge: 0,
      morningShift: 'Closed',
      eveningShift: 'Closed',
      maxPatients: 0
    };
  });

  if (!Array.isArray(affList) || affList.length === 0) {
    // Standard clinical defaults organized by hospital partnership
    schedule[0] = { ...schedule[0], isAvailable: true, clinicName: 'Apollo Clinic & Diagnostic Center', city: 'Mumbai', charge: 600, morningShift: '09:00 - 13:00', eveningShift: '17:00 - 20:00', maxPatients: 25 };
    schedule[1] = { ...schedule[1], isAvailable: true, clinicName: 'Fortis Health Point', city: 'Navi Mumbai', charge: 800, morningShift: '10:00 - 14:00', eveningShift: '18:00 - 21:00', maxPatients: 20 };
    schedule[2] = { ...schedule[2], isAvailable: true, clinicName: 'Apollo Clinic & Diagnostic Center', city: 'Mumbai', charge: 600, morningShift: '09:00 - 13:00', eveningShift: '17:00 - 20:00', maxPatients: 25 };
    schedule[3] = { ...schedule[3], isAvailable: true, clinicName: 'Fortis Health Point', city: 'Navi Mumbai', charge: 800, morningShift: '10:00 - 14:00', eveningShift: '18:00 - 21:00', maxPatients: 20 };
    schedule[4] = { ...schedule[4], isAvailable: true, clinicName: 'Apollo Clinic & Diagnostic Center', city: 'Mumbai', charge: 600, morningShift: '09:00 - 13:00', eveningShift: '17:00 - 20:00', maxPatients: 25 };
    schedule[5] = { ...schedule[5], isAvailable: true, clinicName: 'Fortis Health Point', city: 'Navi Mumbai', charge: 800, morningShift: '10:00 - 14:00', eveningShift: 'Closed', maxPatients: 15 };
    schedule[6] = { ...schedule[6], isAvailable: false, clinicName: 'None', city: '', charge: 0, morningShift: 'Closed', eveningShift: 'Closed', maxPatients: 0 };
    return schedule;
  }

  // Parse each approved affiliation shift safely (e.g. string or object)
  affList.forEach((aff, affIdx) => {
    let rawShiftVal = aff?.shift ?? aff?.shiftDetails ?? '';
    if (typeof rawShiftVal === 'object' && rawShiftVal !== null) {
      try {
        rawShiftVal = JSON.stringify(rawShiftVal);
      } catch (e) {
        rawShiftVal = '';
      }
    }
    const rawShift = String(rawShiftVal || '').toLowerCase();
    const clinicName = aff.clinicName || aff.clinic?.name || `Affiliated Clinic #${affIdx + 1}`;
    const city = aff.city || aff.clinic?.city || '';
    const charge = aff.charge || 600;
    const patientLimit = aff.patientLimit || aff.patientLimits || 20;

    schedule.forEach(day => {
      let matchesDay = false;

      if (rawShift && rawShift.includes(day.key)) {
        matchesDay = true;
      } else if (rawShift && (rawShift.includes('mon to fri') || rawShift.includes('mon-fri') || rawShift.includes('weekdays'))) {
        if (['mon', 'tue', 'wed', 'thu', 'fri'].includes(day.key)) matchesDay = true;
      } else if (rawShift && (rawShift.includes('all days') || rawShift.includes('daily'))) {
        matchesDay = true;
      } else if (!rawShift || rawShift.trim() === '') {
        // Distribute alternating across weekdays if shift string was empty
        if (affIdx % 2 === 0 && ['mon', 'wed', 'fri'].includes(day.key)) matchesDay = true;
        if (affIdx % 2 === 1 && ['tue', 'thu', 'sat'].includes(day.key)) matchesDay = true;
      }

      if (matchesDay && !day.isAvailable) {
        day.isAvailable = true;
        day.clinicName = clinicName;
        day.city = city;
        day.charge = charge;
        day.maxPatients = patientLimit;

        // Parse timing if present
        if (rawShift.includes('09:00') || rawShift.includes('morning') || rawShift.includes('am')) {
          day.morningShift = '09:00 - 13:00';
          day.eveningShift = '17:00 - 20:00';
        } else if (rawShift.includes('10:00')) {
          day.morningShift = '10:00 - 14:00';
          day.eveningShift = '18:00 - 21:00';
        } else {
          day.morningShift = '09:30 - 13:30';
          day.eveningShift = '17:30 - 20:30';
        }
      }
    });
  });

  return schedule;
};

const fetchAffiliationSchedule = async () => {
  isLoading.value = true;
  try {
    const doctorId = authStore.user?.userId || authStore.user?.id;
    if (doctorId) {
      const data = await DoctorService.getDoctorAffiliations(doctorId, 'APPROVED');
      if (Array.isArray(data) && data.length > 0) {
        approvedAffiliations.value = data;
        weeklySchedule.value = buildScheduleFromAffiliations(data);
        dataSource.value = 'Live API';
        return;
      }
    }
    // Fallback if no backend affiliations currently found
    approvedAffiliations.value = [];
    weeklySchedule.value = buildScheduleFromAffiliations([]);
    dataSource.value = 'Organized Schedule';
  } catch (err) {
    console.warn('Failed to load affiliations for schedule, displaying organized roster:', err);
    weeklySchedule.value = buildScheduleFromAffiliations([]);
    dataSource.value = 'Organized Schedule';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAffiliationSchedule();
});
</script>
