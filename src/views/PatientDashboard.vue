<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40">
    
    <!-- Header with Book CTA inlined -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">
          {{ greeting }}, <span class="text-indigo-600">{{ authStore.user?.firstName || 'Patient' }}</span>
        </h1>
        <p class="text-slate-500 mt-1 font-medium">Your personalized health dashboard.</p>
        <div v-if="!isLoading" class="mt-2 text-xs font-bold px-2 py-1 inline-block rounded-md" :class="dataSource === 'Live API' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
          Data Source: {{ dataSource }}
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-semibold">{{ errorMessage }}</span>
      </div>
      <button @click="fetchDashboard" class="text-xs font-bold underline hover:text-rose-900 transition-colors">
        Retry
      </button>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="flex flex-col gap-6 flex-1">
      <div class="h-40 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
      <div class="h-64 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
      <div class="h-64 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
      <div class="h-64 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
      <div class="h-32 bg-slate-200 animate-pulse rounded-3xl border border-slate-100"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData" class="flex flex-col gap-8 flex-1 animate-fade-in-up">
      
      <!-- Vitals Strip (Full Width) -->
      <VitalsWidget :vitals="dashboardData.vitals" />
      
      <!-- Single Column sequence -->
      <div class="flex flex-col gap-8">

        <AppointmentsWidget :appointments="dashboardData.upcomingAppointments" />
        <PrescriptionsWidget :prescriptions="dashboardData.activePrescriptions" />
        <HealthRecordsWidget :records="dashboardData.healthRecords" />
        <PendingActionsWidget :actions="dashboardData.pendingActions" />
      </div>

      <!-- Quick Actions at the very bottom -->
      <div class="pt-4 border-t border-indigo-100/50">
        <h3 class="text-lg font-bold text-slate-800 mb-4 px-2">Quick Actions</h3>
        <QuickActionsWidget />
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Hello'; // Midnight to 4:59 AM
  if (hour < 12) return 'Good morning'; // 5:00 AM to 11:59 AM
  if (hour < 18) return 'Good afternoon'; // 12:00 PM to 5:59 PM
  return 'Good evening'; // 6:00 PM to 11:59 PM
});

// Widgets
import AppointmentsWidget from '@/components/dashboard/patient/AppointmentsWidget.vue';
import QuickActionsWidget from '@/components/dashboard/patient/QuickActionsWidget.vue';
import VitalsWidget from '@/components/dashboard/patient/VitalsWidget.vue';
import PrescriptionsWidget from '@/components/dashboard/patient/PrescriptionsWidget.vue';
import HealthRecordsWidget from '@/components/dashboard/patient/HealthRecordsWidget.vue';
import PendingActionsWidget from '@/components/dashboard/patient/PendingActionsWidget.vue';
import NotificationsWidget from '@/components/dashboard/patient/NotificationsWidget.vue';
import { PatientService } from '@/services/patient.service';

const authStore = useAuthStore();
const isLoading = ref(true);
const dashboardData = ref(null);
const dataSource = ref('Loading...');
const errorMessage = ref('');

const fetchDashboard = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id || '';
    const username = authStore.user?.username || '';
    const apiData = await PatientService.getDashboardData(patientId, username);
    
    dashboardData.value = apiData;
    dataSource.value = 'Live API';

    if (apiData.firstName || apiData.lastName || apiData.patientId) {
      const resolvedId = apiData.patientId || patientId;
      localStorage.setItem('userId', resolvedId);
      authStore.updateUser({
        userId: resolvedId,
        patientId: resolvedId,
        firstName: apiData.firstName,
        lastName: apiData.lastName,
        emailId: apiData.emailId,
        dateOfBirth: apiData.dateOfBirth,
        gender: apiData.gender,
        primaryMobile: apiData.primaryMobile,
      });
    }
  } catch (err) {
    console.warn('Dashboard fetch error:', err);
    errorMessage.value = err.message || 'Unable to connect to server. Please try again.';
    dataSource.value = 'Offline';
    // Clean empty state instead of mock data
    dashboardData.value = {
      upcomingAppointments: [],
      vitals: [],
      activePrescriptions: [],
      healthRecords: [],
      pendingActions: [],
      notifications: []
    };
  } finally {
    isLoading.value = false;
  }
};

const handleMarkNotificationRead = async (notification) => {
  if (!notification || !notification.id) return;
  
  // Optimistically update in local UI
  notification.isRead = true;

  try {
    await PatientService.markNotificationAsRead(notification.id);
  } catch (err) {
    console.warn('Failed to mark notification as read:', err);
  }
};

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
</style>
