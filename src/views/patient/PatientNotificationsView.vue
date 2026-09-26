<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40">

    <!-- Header -->
    <div class="relative overflow-hidden rounded-[2rem] bg-white p-6 sm:p-8 mb-8 shadow-sm border border-slate-100 animate-fade-in-up">
      <!-- Decorative Background Glows -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div class="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-300/40 transition-transform duration-300 hover:scale-105">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Notifications</h1>
            <p class="text-sm sm:text-base text-slate-500 mt-1 sm:mt-1.5 font-medium">All your alerts and updates in one place.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <!-- Filter tabs -->
          <div class="flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100/50 backdrop-blur-sm shadow-inner">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              @click="activeFilter = tab.value"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 relative overflow-hidden group"
              :class="activeFilter === tab.value
                ? 'text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white'"
            >
              <!-- Active Background -->
              <span v-if="activeFilter === tab.value" class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl"></span>
              
              <span class="relative z-10 flex items-center gap-1.5">
                {{ tab.label }}
                <span
                  v-if="tab.value === 'unread' && unreadCount > 0"
                  class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black transition-colors"
                  :class="activeFilter === 'unread' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600 group-hover:bg-rose-200'"
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
            class="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            Mark all read
          </button>
        </div>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="isLoading" class="flex flex-col gap-4">
      <div v-for="i in 5" :key="i" class="h-20 bg-white animate-pulse rounded-2xl border border-slate-100"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between">
      <span class="text-sm font-semibold">{{ error }}</span>
      <button @click="fetchNotifications" class="text-xs font-bold underline hover:text-rose-900">Retry</button>
    </div>

    <!-- List -->
    <div v-else class="flex flex-col gap-3 animate-fade-in-up">
      <TransitionGroup name="notif-page" tag="div" class="flex flex-col gap-3">
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 bg-white"
          :class="item.isRead
            ? 'border-slate-100 opacity-75'
            : 'border-indigo-100 shadow-sm shadow-indigo-100/60 hover:shadow-md'"
        >
          <!-- Left accent -->
          <div
            class="absolute left-0 top-3 bottom-3 w-1 rounded-full transition-all duration-500"
            :class="item.isRead ? 'bg-slate-200' : 'bg-indigo-500'"
          ></div>

          <!-- Icon -->
          <div
            class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ml-1 transition-all duration-300"
            :class="item.isRead ? 'bg-slate-100' : 'bg-indigo-100'"
          >
            <svg
              class="w-5 h-5 transition-colors duration-300"
              :class="item.isRead ? 'text-slate-400' : 'text-indigo-600'"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-bold transition-colors duration-300" :class="item.isRead ? 'text-slate-500' : 'text-slate-800'">
                {{ item.title || 'Notification' }}
              </p>
              <span
                v-if="!item.isRead"
                class="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200"
              >Unread</span>
            </div>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ item.message }}</p>
            <span class="text-[11px] text-slate-400 mt-2 block font-medium">
              {{ item.createdAt ? formatTime(item.createdAt) : (item.time || 'Recently') }}
            </span>
          </div>

          <!-- Action -->
          <div class="flex-shrink-0 self-center">
            <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-75" enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75" mode="out-in">
              <button
                v-if="!item.isRead && !item._marking"
                key="btn"
                @click="markAsRead(item)"
                class="flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 hover:text-white bg-white hover:bg-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-200 hover:border-transparent shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                Mark read
              </button>
              <span v-else-if="item._marking" key="spin" class="flex items-center gap-1 text-[11px] text-indigo-400 px-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              </span>
              <span v-else key="read" class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                Read
              </span>
            </Transition>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty state -->
      <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <p class="text-base font-bold text-slate-400">
          {{ activeFilter === 'unread' ? "You're all caught up!" : 'No notifications yet' }}
        </p>
        <p class="text-sm text-slate-300 mt-1">
          {{ activeFilter === 'unread' ? 'No unread notifications.' : 'Notifications will appear here.' }}
        </p>
      </div>

      <!-- Footer count -->
      <div v-if="allNotifications.length > 0" class="mt-2 text-center text-xs text-slate-400 font-medium">
        Showing {{ filteredNotifications.length }} of {{ allNotifications.length }} notification{{ allNotifications.length !== 1 ? 's' : '' }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { PatientService } from '@/services/patient.service';

const authStore = useAuthStore();
const isLoading = ref(true);
const error = ref('');
const allNotifications = ref([]);
const activeFilter = ref('all');
const isMarkingAll = ref(false);

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

const fetchNotifications = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const userId = authStore.user?.userId || authStore.user?.id;
    const username = authStore.user?.username;
    const list = await PatientService.getNotifications(userId, username);
    if (list && list.length > 0) {
      allNotifications.value = list.map(n => ({ ...n, isRead: Boolean(n.isRead), _marking: false }));
    } else {
      const dash = await PatientService.getDashboardData(userId, username);
      allNotifications.value = (dash.notifications || []).map(n => ({
        ...n, isRead: Boolean(n.isRead), _marking: false
      }));
    }
  } catch (err) {
    error.value = 'Unable to load notifications. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const markAsRead = async (item) => {
  if (!item || !item.id || item.isRead) return;
  item._marking = true;
  try {
    await PatientService.markNotificationAsRead(item.id);
    await new Promise(r => setTimeout(r, 350));
    item.isRead = true;
  } catch (err) {
    console.warn('Error marking as read:', err);
  } finally {
    item._marking = false;
  }
};

const markAllAsRead = async () => {
  isMarkingAll.value = true;
  const unread = allNotifications.value.filter(n => !n.isRead);
  unread.forEach(n => { n._marking = true; });
  try {
    await Promise.allSettled(unread.map(n => PatientService.markNotificationAsRead(n.id)));
    await new Promise(r => setTimeout(r, 350));
    unread.forEach(n => { n.isRead = true; n._marking = false; });
  } finally {
    isMarkingAll.value = false;
  }
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(fetchNotifications);
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.35s ease-out forwards; }

.notif-page-move,
.notif-page-enter-active,
.notif-page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.notif-page-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
.notif-page-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.notif-page-leave-active {
  position: absolute;
  width: 100%;
}
</style>
