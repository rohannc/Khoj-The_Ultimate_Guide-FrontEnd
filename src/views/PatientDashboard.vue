<template>
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <!-- Header Area -->
    <div class="mb-8 animate-fade-in-up">
      <h1 class="text-2xl md:text-3xl font-semibold text-slate-800">
        Good morning, <span class="text-teal-600">{{ authStore.user?.firstName || 'Patient' }}</span>
      </h1>
      <p class="text-slate-500 mt-1 text-sm md:text-base font-medium">Here is your daily health overview.</p>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
      <!-- Main Content Skeleton (2/3) -->
      <div class="lg:col-span-2 flex flex-col gap-6 h-full">
        <div class="h-48 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div class="bg-slate-200 animate-pulse rounded-3xl border border-slate-100 h-full"></div>
          <div class="bg-slate-200 animate-pulse rounded-3xl border border-slate-100 h-full"></div>
        </div>
        <div class="h-32 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
      </div>
      <!-- Side Content Skeleton (1/3) -->
      <div class="flex flex-col gap-6 h-full">
        <div class="h-24 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
        <div class="flex-1 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
        <div class="flex-1 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
      
      <!-- Main Column (2/3 width) -->
      <div class="lg:col-span-2 flex flex-col gap-6 animate-fade-in-up h-full" style="animation-delay: 100ms;">
        <!-- Vitals full width across the 2/3 column -->
        <VitalsWidget :vitals="dashboardData.vitals" />
        
        <!-- Appointments and Prescriptions split 50/50 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <AppointmentsWidget :appointments="dashboardData.upcomingAppointments" />
          <PrescriptionsWidget :prescriptions="dashboardData.activePrescriptions" />
        </div>

        <!-- Quick actions at bottom -->
        <QuickActionsWidget />
      </div>

      <!-- Side Column (1/3 width) -->
      <div class="flex flex-col gap-6 animate-fade-in-up h-full" style="animation-delay: 200ms;">
        
        <!-- Book Appointment CTA -->
        <button class="w-full shrink-0 relative overflow-hidden bg-teal-50 rounded-2xl p-3.5 shadow-sm hover:bg-teal-100 hover:shadow-md transition-all group border border-teal-500">
          <div class="flex items-center justify-between relative z-10">
            <div class="text-left">
              <h3 class="text-lg font-black text-teal-900 mb-0.5">Need a Doctor?</h3>
              <p class="text-teal-700 text-[11px] font-bold uppercase tracking-wider">Book Now &rarr;</p>
            </div>
            <div class="w-9 h-9 bg-teal-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </div>
          </div>
        </button>

        <PendingActionsWidget :actions="dashboardData.pendingActions" class="flex-1 min-h-0" />
        <NotificationsWidget :notifications="dashboardData.notifications" class="flex-1 min-h-0" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Widgets
import AppointmentsWidget from '@/components/dashboard/patient/AppointmentsWidget.vue';
import QuickActionsWidget from '@/components/dashboard/patient/QuickActionsWidget.vue';
import VitalsWidget from '@/components/dashboard/patient/VitalsWidget.vue';
import PrescriptionsWidget from '@/components/dashboard/patient/PrescriptionsWidget.vue';
import PendingActionsWidget from '@/components/dashboard/patient/PendingActionsWidget.vue';
import NotificationsWidget from '@/components/dashboard/patient/NotificationsWidget.vue';

const authStore = useAuthStore();
const isLoading = ref(true);
const dashboardData = ref(null);

onMounted(() => {
  // Simulate API Fetch
  setTimeout(() => {
    dashboardData.value = {
      upcomingAppointments: [
        { id: 1, doctorName: 'Sarah Jenkins', specialty: 'Cardiologist', date: 'Oct 24, 2026', time: '10:00 AM' },
        { id: 2, doctorName: 'Michael Chen', specialty: 'General Practice', date: 'Nov 02, 2026', time: '2:30 PM' }
      ],
      vitals: [
        { type: 'bp', label: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'Normal', trend: 'stable' },
        { type: 'hr', label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Normal', trend: 'down' },
        { type: 'weight', label: 'Weight', value: '165', unit: 'lbs', status: 'Stable', trend: 'up' }
      ],
      activePrescriptions: [
        { name: 'Lisinopril', dosage: '10mg', frequency: '1x Daily' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: '1x at Night' }
      ],
      pendingActions: [
        { title: 'Update Insurance', description: 'Your medical insurance card on file is expiring soon.', cta: 'Update Now' },
        { title: 'Pre-visit Questionnaire', description: 'Dr. Jenkins requested you complete a form before your next visit.', cta: 'Start Form' }
      ],
      notifications: [
        { urgency: 'high', title: 'Lab Results Ready', message: 'Your comprehensive metabolic panel results are available.', time: '2 hours ago' },
        { urgency: 'medium', title: 'Appointment Reminder', message: 'You have an upcoming appointment in 3 days.', time: '1 day ago' },
        { urgency: 'low', title: 'New Message', message: 'Dr. Chen sent you a secure message regarding your last visit.', time: '2 days ago' }
      ]
    };
    isLoading.value = false;
  }, 500); // 0.5s delay to show skeleton loaders
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>
