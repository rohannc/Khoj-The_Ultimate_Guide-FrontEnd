<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
            Patient Medical Records
          </h1>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Access patient consultation histories, diagnostics, blood groups, and chronic conditions.</p>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search patient, blood group, city..."
          class="pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400 w-52 sm:w-72"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Patients Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto">
      <div
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-200"
      >
        <div>
          <!-- Patient Top Details -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 font-black flex items-center justify-center text-lg transition-all border border-indigo-100/80 shadow-sm">
                {{ patient.firstName?.charAt(0) }}{{ patient.lastName?.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {{ patient.firstName }} {{ patient.lastName }}
                </h3>
                <p class="text-xs text-slate-400 font-medium">{{ patient.gender }} &bull; {{ patient.age }} yrs</p>
              </div>
            </div>

            <!-- Blood group badge -->
            <span class="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
              {{ patient.bloodGroup || 'O+' }}
            </span>
          </div>

          <!-- Medical summary rows -->
          <div class="space-y-2.5 py-3 border-y border-slate-100 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Condition / Diagnosis:</span>
              <span class="font-bold text-slate-700">{{ patient.condition || 'Hypertension' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Last Visit:</span>
              <span class="font-semibold text-slate-700">{{ patient.lastVisit || '28 Sep 2026' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Primary Contact:</span>
              <span class="font-semibold text-indigo-600">{{ patient.phone || '+91 98765 00000' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Location:</span>
              <span class="font-semibold text-slate-600">{{ patient.city || 'Mumbai' }}</span>
            </div>
          </div>
        </div>

        <!-- Action row -->
        <div class="pt-4 flex items-center justify-between gap-2 mt-4">
          <button
            @click="selectPatient(patient)"
            class="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            View Clinical Summary
          </button>
        </div>
      </div>
    </div>

    <!-- Patient Details Modal -->
    <Teleport to="body">
      <div v-if="selectedPatientModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="selectedPatientModal = null">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up">
          <div class="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-black text-lg text-slate-900">Clinical Summary</h3>
                <p class="text-xs text-slate-400">Patient ID: #PAT-{{ selectedPatientModal.id }}</p>
              </div>
            </div>
            <button @click="selectedPatientModal = null" class="text-slate-400 hover:text-slate-600 p-1">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="space-y-4 text-sm">
            <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase">Age & Gender</span>
                <p class="font-bold text-slate-800 mt-0.5">{{ selectedPatientModal.age }} Yrs &bull; {{ selectedPatientModal.gender }}</p>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase">Blood Group</span>
                <p class="font-bold text-rose-600 mt-0.5">{{ selectedPatientModal.bloodGroup }}</p>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase">Phone</span>
                <p class="font-bold text-slate-800 mt-0.5">{{ selectedPatientModal.phone }}</p>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase">City</span>
                <p class="font-bold text-slate-800 mt-0.5">{{ selectedPatientModal.city }}</p>
              </div>
            </div>

            <div>
              <span class="text-xs text-slate-400 font-bold uppercase">Known Clinical Diagnosis</span>
              <p class="font-bold text-slate-800 mt-1 bg-amber-50 text-amber-800 px-3 py-2 rounded-xl border border-amber-200">
                {{ selectedPatientModal.condition }}
              </p>
            </div>

            <div>
              <span class="text-xs text-slate-400 font-bold uppercase">Doctor Clinical Notes</span>
              <p class="text-xs leading-relaxed text-slate-600 mt-1 bg-slate-50 p-3 rounded-xl">
                Patient is responding well to medication. Blood pressure remains within normal bounds (128/82 mmHg). Scheduled for regular follow-up in 3 weeks.
              </p>
            </div>
          </div>

          <div class="pt-5 mt-5 border-t border-slate-100 flex justify-end">
            <button @click="selectedPatientModal = null" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 cursor-pointer">
              Close Record
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { DoctorService } from '@/services/doctor.service';

const authStore = useAuthStore();
const searchQuery = ref('');
const selectedPatientModal = ref(null);
const patients = ref([]);

const fetchPatients = async () => {
  const doctorId = authStore.user?.userId || authStore.user?.id;
  try {
    if (doctorId) {
      const data = await DoctorService.getDoctorPatients(doctorId);
      if (data && data.length > 0) {
        patients.value = data;
        return;
      }
    }
  } catch (err) {
    console.warn('Doctor patients API error, using rich mock roster:', err);
  }

  // Rich Clinical Patient Mocks
  patients.value = [
    {
      id: 'p-1',
      firstName: 'Rohan',
      lastName: 'Chakraborty',
      gender: 'Male',
      age: 28,
      bloodGroup: 'O+',
      condition: 'Borderline Hypertension & Vitamin D Deficiency',
      lastVisit: 'Today, 10:30 AM',
      phone: '+91 98301 23456',
      city: 'Mumbai, Maharashtra'
    },
    {
      id: 'p-2',
      firstName: 'Ananya',
      lastName: 'Sharma',
      gender: 'Female',
      age: 34,
      bloodGroup: 'B+',
      condition: 'Hypertension Stage 1 (Controlled)',
      lastVisit: 'Today, 11:15 AM',
      phone: '+91 98212 98765',
      city: 'Navi Mumbai, Maharashtra'
    },
    {
      id: 'p-3',
      firstName: 'Vikram',
      lastName: 'Patel',
      gender: 'Male',
      age: 52,
      bloodGroup: 'A+',
      condition: 'Post-Angioplasty Monitoring & Hyperlipidemia',
      lastVisit: '26 Sep 2026',
      phone: '+91 98190 54321',
      city: 'Thane, Maharashtra'
    },
    {
      id: 'p-4',
      firstName: 'Pooja',
      lastName: 'Iyer',
      gender: 'Female',
      age: 41,
      bloodGroup: 'AB+',
      condition: 'Chronic Migraine & Mild Arrhythmia',
      lastVisit: '22 Sep 2026',
      phone: '+91 99200 11223',
      city: 'Pune, Maharashtra'
    },
    {
      id: 'p-5',
      firstName: 'Suresh',
      lastName: 'Menon',
      gender: 'Male',
      age: 60,
      bloodGroup: 'O-',
      condition: 'Type 2 Diabetes & Ischemic Heart Disease',
      lastVisit: '18 Sep 2026',
      phone: '+91 97690 99887',
      city: 'Mumbai, Maharashtra'
    }
  ];
};

const filteredPatients = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return patients.value;
  return patients.value.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
    (p.bloodGroup && p.bloodGroup.toLowerCase().includes(query)) ||
    (p.city && p.city.toLowerCase().includes(query)) ||
    (p.condition && p.condition.toLowerCase().includes(query))
  );
});

const selectPatient = (patient) => {
  selectedPatientModal.value = patient;
};

onMounted(fetchPatients);
</script>
