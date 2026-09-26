<template>
  <WidgetCard title="Recent Health Records">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </template>

    <template #headerAction>
      <router-link
        to="/dashboard/patient/records"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100 transition-all shadow-sm"
      >
        <span>Show more</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </template>
    
    <div class="flex-grow flex flex-col justify-between min-h-0">
      <div class="relative flex-1 min-h-0">
        <!-- Top fade -->
        <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-xl"></div>
        <!-- Bottom fade -->
        <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-xl"></div>
        
        <div v-if="records && records.length > 0" class="space-y-4 h-full overflow-y-auto pr-2 scroll-accent rounded-xl p-3 pt-4 pb-5">
          <div v-for="(rec, index) in records.slice(0, 3)" :key="rec.id || index" class="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-100 transition-all cursor-pointer group flex items-center justify-between">
            <div>
              <p class="text-base font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{{ rec.documentTitle }}</p>
              <p class="text-xs font-medium text-slate-500">{{ rec.documentType }}</p>
            </div>
            <div class="flex items-center gap-2 text-teal-700 font-semibold text-xs bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">
              <svg class="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ rec.testDate }}
            </div>
          </div>
        </div>
        <div v-else class="flex-grow flex items-center justify-center text-slate-400 font-medium py-8">
          No recent health records.
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';

defineProps({
  records: {
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
