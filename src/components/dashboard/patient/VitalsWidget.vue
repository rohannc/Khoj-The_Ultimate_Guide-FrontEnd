<template>
  <WidgetCard title="Recent Vitals">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
    </template>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div v-for="(vital, index) in vitals" :key="index" 
        class="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:bg-slate-100 transition-colors flex flex-col items-center text-center">
        
        <!-- Icon on top -->
        <div class="w-10 h-10 rounded-full flex items-center justify-center mb-3" :class="getIconBgClass(vital.type)">
          <component :is="getIcon(vital.type)" class="w-5 h-5" :class="getIconColorClass(vital.type)" />
        </div>

        <!-- Label -->
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{{ vital.label }}</span>

        <!-- Big Value -->
        <div class="mb-3">
          <span class="text-3xl font-bold text-slate-800 block font-display tracking-tight">{{ vital.value }}</span>
          <span class="text-xs font-medium text-slate-400 mt-0.5 block">{{ vital.unit }}</span>
        </div>

        <!-- Status + Trend row at bottom -->
        <div class="flex items-center gap-4">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-md" :class="getStatusColor(calculateStatus(vital.type, vital.value))">
            {{ calculateStatus(vital.type, vital.value) }}
          </span>
          <div class="flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full border" :class="getTrendClasses(vital.trend)">
            <component :is="getTrendIcon(vital.trend)" class="w-3 h-3" />
            <span>{{ vital.trend === 'stable' ? '0.0%' : '2.4%' }}</span>
          </div>
        </div>
      </div>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';
import { HeartIcon, ChartBarIcon, ScaleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/vue/24/outline';

defineProps({
  vitals: {
    type: Array,
    default: () => []
  }
});

const getIcon = (type) => {
  return type === 'bp' ? HeartIcon : type === 'weight' ? ScaleIcon : ChartBarIcon;
};

const getIconBgClass = (type) => {
  if (type === 'bp') return 'bg-rose-100';
  if (type === 'hr') return 'bg-amber-100';
  return 'bg-blue-100';
};

const getIconColorClass = (type) => {
  if (type === 'bp') return 'text-rose-500';
  if (type === 'hr') return 'text-amber-500';
  return 'text-blue-500';
};

// Dynamic Status Calculation Logic
const calculateStatus = (type, value) => {
  if (!value) return 'Unknown';
  
  if (type === 'bp') {
    const [sys, dia] = value.split('/').map(Number);
    if (!sys || !dia) return 'Unknown';
    if (sys < 120 && dia < 80) return 'Normal';
    if (sys < 130 && dia < 80) return 'Elevated';
    return 'High';
  } 
  
  if (type === 'hr') {
    const hr = Number(value);
    if (hr >= 60 && hr <= 100) return 'Normal';
    if (hr < 60) return 'Low';
    return 'High';
  }
  
  return 'Stable'; // Default for weight without historical context
};

const getStatusColor = (status) => {
  if (status === 'Normal') return 'bg-green-100 text-green-700 border border-green-200';
  if (status === 'High' || status === 'Elevated') return 'bg-orange-100 text-orange-700 border border-orange-200';
  if (status === 'Low') return 'bg-blue-100 text-blue-700 border border-blue-200';
  return 'bg-slate-100 text-slate-700 border border-slate-200';
};

// Trend UI Logic
const getTrendIcon = (trend) => {
  if (trend === 'up') return ArrowTrendingUpIcon;
  if (trend === 'down') return ArrowTrendingDownIcon;
  return MinusIcon;
};

const getTrendClasses = (trend) => {
  if (trend === 'up') return 'bg-red-50 text-red-600 border-red-100'; // Assuming up is bad for HR/BP/Weight generally for a quick mock
  if (trend === 'down') return 'bg-green-50 text-green-600 border-green-100';
  return 'bg-slate-50 text-slate-500 border-slate-200';
};
</script>
