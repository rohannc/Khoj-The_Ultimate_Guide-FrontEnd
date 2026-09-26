<template>
  <WidgetCard title="Notifications">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
    </template>
    
    <div class="relative flex-1 min-h-0 mt-2">
      <!-- Top fade -->
      <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-xl"></div>
      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-xl"></div>
      
      <div class="space-y-3 h-full overflow-y-auto pr-2 scroll-accent rounded-xl p-2 pt-3 pb-5">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all relative overflow-hidden group"
          :class="notification.isRead ? 'bg-slate-50/70 border-slate-100 opacity-75' : 'bg-white border-indigo-100 shadow-xs hover:border-indigo-200'"
        >
          <!-- Colored edge indicator based on read status -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1"
            :class="notification.isRead ? 'bg-slate-300' : 'bg-indigo-600'"
          ></div>
          
          <div class="flex items-start gap-3 min-w-0">
            <div class="flex-shrink-0 mt-1">
              <div
                class="w-2.5 h-2.5 rounded-full"
                :class="notification.isRead ? 'bg-slate-300' : 'bg-indigo-600 animate-pulse'"
              ></div>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-slate-800 text-sm truncate">{{ notification.title }}</h4>
                <span
                  v-if="!notification.isRead"
                  class="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-indigo-50 text-indigo-600 border border-indigo-200"
                >
                  New
                </span>
              </div>
              <p class="text-xs text-slate-600 mt-0.5 line-clamp-2">{{ notification.message }}</p>
              <span class="text-[10px] text-slate-400 mt-1.5 block font-medium">
                {{ notification.time || (notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : '') }}
              </span>
            </div>
          </div>

          <!-- Mark as Read Button -->
          <div class="flex-shrink-0 self-center">
            <button
              v-if="!notification.isRead"
              @click="$emit('mark-as-read', notification)"
              class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg border border-indigo-200 hover:border-indigo-600 transition-all shadow-xs"
              title="Mark as read"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Mark Read</span>
            </button>
            <span v-else class="text-[11px] font-medium text-slate-400 flex items-center gap-1 px-1">
              <svg class="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Read
            </span>
          </div>
        </div>

        <div v-if="!notifications || notifications.length === 0" class="text-center text-slate-400 py-6 text-sm">
          You're all caught up! No notifications.
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';

defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
});

defineEmits(['mark-as-read']);
</script>

<style scoped>
.scroll-accent {
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}
.scroll-accent:hover {
  scrollbar-color: rgba(59, 130, 246, 0.4) transparent;
}
.scroll-accent::-webkit-scrollbar {
  width: 5px;
}
.scroll-accent::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-accent::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 99px;
}
.scroll-accent:hover::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.35);
}
</style>
