<template>
  <WidgetCard title="Upcoming Appointments">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
    </template>
    
    <div class="flex-grow flex flex-col justify-between min-h-0">
      <div class="relative flex-1 min-h-0">
        <!-- Top fade -->
        <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-xl"></div>
        <!-- Bottom fade -->
        <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-xl"></div>
        
        <div v-if="appointments && appointments.length > 0" class="space-y-4 h-full overflow-y-auto pr-2 scroll-accent rounded-xl p-3 pt-4 pb-5">
          <div v-for="(apt, index) in appointments.slice(0, 3)" :key="apt.id || index" class="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-100 transition-all cursor-pointer group">
            <p class="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">Dr. {{ apt.doctorName }}</p>
            <p class="text-sm font-medium text-slate-500 mb-3">{{ apt.specialty }}</p>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2 text-teal-700 font-semibold text-sm bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                <svg class="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ apt.date }}
              </div>
              <div class="flex items-center gap-2 text-teal-700 font-semibold text-sm bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                <svg class="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ apt.time }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex-grow flex items-center justify-center text-slate-400 font-medium py-8">
          No upcoming appointments.
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';

defineProps({
  appointments: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.scroll-accent {
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}
.scroll-accent:hover {
  scrollbar-color: rgba(20, 184, 166, 0.4) transparent;
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
  background: rgba(20, 184, 166, 0.35);
}
</style>
