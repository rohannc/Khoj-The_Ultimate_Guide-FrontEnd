<template>
  <WidgetCard title="Pending Actions">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    </template>
    
    <div class="relative flex-1 min-h-0 mt-2">
      <!-- Top fade -->
      <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-xl"></div>
      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-xl"></div>
      
      <div class="space-y-3 h-full overflow-y-auto pr-2 scroll-accent rounded-xl p-3 pt-4 pb-5">
        <div v-for="(action, index) in actions" :key="index" class="flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition-all shadow-sm">
          <div class="mt-1">
            <input type="checkbox" class="w-5 h-5 rounded border-orange-200 bg-white text-orange-500 focus:ring-orange-500/50 cursor-pointer" />
          </div>
          <div>
            <h4 class="font-bold text-orange-900">{{ action.title }}</h4>
            <p class="text-sm text-orange-800/80 mt-1 font-medium">{{ action.description }}</p>
            <button class="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-wider">
              {{ action.cta }} &rarr;
            </button>
          </div>
        </div>
        <div v-if="!actions || actions.length === 0" class="text-center text-slate-400 py-6">
          No pending actions. Great job!
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';

defineProps({
  actions: {
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
  scrollbar-color: rgba(249, 115, 22, 0.4) transparent;
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
  background: rgba(249, 115, 22, 0.35);
}
</style>
