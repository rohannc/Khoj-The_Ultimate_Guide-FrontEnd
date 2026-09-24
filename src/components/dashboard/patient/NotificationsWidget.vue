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
      
      <div class="space-y-4 h-full overflow-y-auto pr-2 scroll-accent rounded-xl p-3 pt-4 pb-5">
        <div v-for="(notification, index) in notifications" :key="index" class="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm hover:bg-slate-100 transition-colors relative overflow-hidden group">
          <!-- Colored edge indicator based on urgency -->
          <div class="absolute left-0 top-0 bottom-0 w-1" :class="getUrgencyColor(notification.urgency).border"></div>
          
          <div class="flex-shrink-0 mt-1">
            <div class="w-2 h-2 rounded-full mt-2" :class="getUrgencyColor(notification.urgency).dot"></div>
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">{{ notification.title }}</h4>
            <p class="text-xs text-slate-500 mt-1">{{ notification.message }}</p>
            <span class="text-[10px] text-slate-400 mt-2 block font-medium">{{ notification.time }}</span>
          </div>
        </div>
        <div v-if="!notifications || notifications.length === 0" class="text-center text-slate-400 py-6">
          You're all caught up!
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

const getUrgencyColor = (urgency) => {
  if (urgency === 'high') return { border: 'bg-red-500', dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' };
  if (urgency === 'medium') return { border: 'bg-orange-400', dot: 'bg-orange-400' };
  return { border: 'bg-blue-400', dot: 'bg-blue-400' };
};
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
