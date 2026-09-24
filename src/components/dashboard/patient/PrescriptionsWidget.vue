<template>
  <WidgetCard title="Active Prescriptions">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
    </template>
    
    <div class="relative flex-1 min-h-0 mt-2">
      <!-- Top fade -->
      <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-xl"></div>
      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-xl"></div>
      
      <div class="space-y-3 h-full overflow-y-auto pr-2 scroll-accent rounded-xl p-3 pt-4 pb-5">
        <div v-for="(med, index) in prescriptions" :key="index" class="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-100 transition-all">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5a4.596 4.596 0 01-6.5-6.5l7.5-7.5a4.596 4.596 0 016.5 6.5z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 9.75l4.5 4.5" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-slate-800">{{ med.name }}</h3>
              <p class="text-xs font-medium text-slate-500">{{ med.dosage }} &bull; {{ med.frequency }}</p>
            </div>
          </div>
          <button class="px-3 py-1.5 text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors border border-teal-200">
            Refill
          </button>
        </div>
        <div v-if="!prescriptions || prescriptions.length === 0" class="text-center text-slate-400 py-6">
          No active prescriptions.
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';

defineProps({
  prescriptions: {
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
  scrollbar-color: rgba(34, 197, 94, 0.4) transparent;
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
  background: rgba(34, 197, 94, 0.35);
}
</style>
