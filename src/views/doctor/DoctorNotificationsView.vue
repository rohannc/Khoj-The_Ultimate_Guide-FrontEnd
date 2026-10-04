<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40">

    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-6 sm:p-8 mb-8 shadow-sm border border-slate-100 animate-fade-in-up">
      <!-- Decorative Glows -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <!-- Back Button -->
      <button @click="router.push('/dashboard/doctor')" class="relative z-10 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6 group cursor-pointer">
        <div class="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </div>
        Back to Dashboard
      </button>

      <div class="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-300/40 transition-transform duration-300 hover:scale-105">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Clinical Alerts & Notifications</h1>
            <p class="text-sm sm:text-base text-slate-500 mt-1 sm:mt-1.5 font-medium">Practice alerts, clinic affiliation responses, and consultation updates.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <!-- Filter Tabs -->
          <div class="flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100/50 backdrop-blur-sm shadow-inner">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              @click="activeFilter = tab.value"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 relative overflow-hidden group cursor-pointer"
              :class="activeFilter === tab.value ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white'"
            >
              <span v-if="activeFilter === tab.value" class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl"></span>
              <span class="relative z-10 flex items-center gap-1.5">
                {{ tab.label }}
                <span
                  v-if="tab.value === 'unread' && unreadCount > 0"
                  class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black"
                  :class="activeFilter === 'unread' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'"
                >
                  {{ unreadCount }}
                </span>
              </span>
            </button>
          </div>

          <!-- Mark all read -->
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            :disabled="isMarkingAll"
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ isMarkingAll ? 'Marking...' : 'Mark all read' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Notification List Container -->
    <div class="bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-sm border border-slate-100 flex-1 flex flex-col">
      <TransitionGroup
        name="notif-page"
        tag="div"
        class="divide-y divide-slate-100/80 flex flex-col gap-1"
      >
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="flex items-start justify-between gap-4 p-4 rounded-2xl transition-all duration-200 group"
          :class="item.isRead ? 'bg-transparent hover:bg-slate-50/60' : 'bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-100/60'"
        >
          <div class="flex items-start gap-3.5 flex-1 min-w-0">
            <!-- Dynamic Role Icon -->
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
              :class="getIconConfig(item.type, item.isRead).bgClass"
            >
              <svg
                class="w-5 h-5"
                :class="getIconConfig(item.type, item.isRead).textClass"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconConfig(item.type, item.isRead).path" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3
                  class="text-sm font-bold transition-colors"
                  :class="item.isRead ? 'text-slate-600' : 'text-slate-900'"
                >
                  {{ item.title }}
                </h3>
                <span
                  v-if="!item.isRead"
                  class="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-300 flex-shrink-0"
                ></span>
              </div>
              <p
                class="text-xs sm:text-sm mt-1 leading-relaxed"
                :class="item.isRead ? 'text-slate-400' : 'text-slate-600'"
              >
                {{ item.message }}
              </p>
              <span class="inline-block text-[11px] text-slate-400 font-medium mt-2">
                {{ item.time || (item.createdAt ? formatTime(item.createdAt) : 'Today') }}
              </span>
            </div>
          </div>

          <!-- Mark As Read Button -->
          <div class="flex-shrink-0">
            <button
              v-if="!item.isRead"
              @click="markAsRead(item)"
              class="text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-200 hover:border-transparent transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            >
              Mark read
            </button>
            <span v-else class="text-[11px] font-semibold text-slate-400">Read</span>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <p class="text-sm font-bold text-slate-500">
          {{ activeFilter === 'unread' ? "No unread alerts" : "No clinical notifications yet" }}
        </p>
      </div>

      <!-- Footer count -->
      <div v-if="allNotifications.length > 0" class="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
        Showing {{ filteredNotifications.length }} of {{ allNotifications.length }} alert{{ allNotifications.length !== 1 ? 's' : '' }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const activeFilter = ref('all');
const isMarkingAll = ref(false);
const allNotifications = ref([]);

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
];

const unreadCount = computed(() => allNotifications.value.filter(n => !n.isRead).length);

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') return allNotifications.value.filter(n => !n.isRead);
  if (activeFilter.value === 'read') return allNotifications.value.filter(n => n.isRead);
  return allNotifications.value;
});

const getIconConfig = (type, isRead) => {
  if (isRead) {
    return {
      bgClass: 'bg-slate-100',
      textClass: 'text-slate-400',
      path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
  }

  switch (type) {
    case 'AFFILIATION_APPROVED':
    case 'AFFILIATION_REQUEST':
      return {
        bgClass: 'bg-emerald-100',
        textClass: 'text-emerald-700',
        path: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      };
    case 'APPOINTMENT_NEW':
    case 'APPOINTMENT_REMINDER':
      return {
        bgClass: 'bg-indigo-100',
        textClass: 'text-indigo-600',
        path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      };
    case 'EMERGENCY':
      return {
        bgClass: 'bg-rose-100',
        textClass: 'text-rose-600',
        path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      };
    default:
      return {
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-600',
        path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      };
  }
};

const fetchDoctorNotifications = async () => {
  const userId = authStore.user?.userId || authStore.user?.id;
  
  if (userId) {
    try {
      const { default: api } = await import('@/services/api');
      const res = await api.get(`/notifications/user/${userId}`);
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      if (list && list.length > 0) {
        allNotifications.value = list.map(n => ({
          ...n,
          isRead: Boolean(n.isRead),
          time: n.createdAt ? new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'
        }));
        return;
      }
    } catch (err) {
      console.warn('Live notification API error, falling back to mock clinical alerts:', err);
    }
  }

  // Doctor Mock Clinical Notifications
  allNotifications.value = [
    {
      id: 'd-notif-1',
      title: 'Clinic Affiliation Approved',
      message: 'Apollo Clinic & Diagnostic Center has approved your practice affiliation request for morning shift consultations.',
      type: 'AFFILIATION_APPROVED',
      isRead: false,
      time: '15m ago'
    },
    {
      id: 'd-notif-2',
      title: 'New Appointment Booked',
      message: 'Rohan Chakraborty has booked Token #1 for a routine cardio checkup today at 10:30 AM.',
      type: 'APPOINTMENT_NEW',
      isRead: false,
      time: '1h ago'
    },
    {
      id: 'd-notif-3',
      title: 'Critical Lab Report Available',
      message: 'Vikram Patel post-op cardiac profile report has been uploaded by Fortis Diagnostic Lab for your review.',
      type: 'EMERGENCY',
      isRead: false,
      time: '3h ago'
    },
    {
      id: 'd-notif-4',
      title: 'Prescription Refill Request',
      message: 'Ananya Sharma requested a 30-day refill authorization for Atorvastatin 10mg.',
      type: 'INFO',
      isRead: true,
      time: 'Yesterday'
    }
  ];
};

const markAsRead = async (item) => {
  if (!item || item.isRead) return;
  try {
    const { default: api } = await import('@/services/api');
    await api.put(`/notifications/${item.id}/read`);
  } catch (err) {
    console.debug('Notification mark read skipped/failed:', err);
  }
  item.isRead = true;
};

const markAllAsRead = async () => {
  isMarkingAll.value = true;
  try {
    const { default: api } = await import('@/services/api');
    await Promise.allSettled(
      allNotifications.value.filter(n => !n.isRead).map(n => api.put(`/notifications/${n.id}/read`))
    );
  } catch (err) {
    console.debug('Batch mark read skipped/failed:', err);
  }
  allNotifications.value.forEach(n => { n.isRead = true; });
  isMarkingAll.value = false;
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(fetchDoctorNotifications);
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.35s ease-out forwards; }
</style>
