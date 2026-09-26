<template>
  <WidgetCard title="Recent Vitals">
    <template #icon>
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
    </template>
    
    <div v-if="vitals && vitals.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
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

        <!-- Status badge aligned in the middle -->
        <div class="flex items-center justify-center w-full mt-1">
          <span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-center" :class="getStatusColor(calculateStatus(vital.type, vital.value))">
            {{ calculateStatus(vital.type, vital.value) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div class="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mb-3">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 class="text-sm font-bold text-slate-700">No recent vitals</h4>
      <p class="text-xs text-slate-500 mt-1 max-w-[200px]">Your health vitals will appear here once recorded during a visit.</p>
    </div>
  </WidgetCard>
</template>

<script setup>
import WidgetCard from '../WidgetCard.vue';
import { HeartIcon, ChartBarIcon, ScaleIcon, FireIcon, ArrowsUpDownIcon, UserIcon } from '@heroicons/vue/24/outline';

defineProps({
  vitals: {
    type: Array,
    default: () => []
  }
});

const getIcon = (type) => {
  if (type === 'bp') return HeartIcon;
  if (type === 'hr') return HeartIcon;
  if (type === 'temp') return FireIcon;
  if (type === 'weight') return ScaleIcon;
  if (type === 'height') return ArrowsUpDownIcon;
  if (type === 'bmi') return UserIcon;
  return ChartBarIcon;
};

const getIconBgClass = (type) => {
  if (type === 'bp') return 'bg-rose-100';
  if (type === 'hr') return 'bg-amber-100';
  if (type === 'temp') return 'bg-orange-100';
  if (type === 'height') return 'bg-indigo-100';
  if (type === 'bmi') return 'bg-emerald-100';
  return 'bg-blue-100';
};

const getIconColorClass = (type) => {
  if (type === 'bp') return 'text-rose-500';
  if (type === 'hr') return 'text-amber-500';
  if (type === 'temp') return 'text-orange-500';
  if (type === 'height') return 'text-indigo-500';
  if (type === 'bmi') return 'text-emerald-500';
  return 'text-blue-500';
};

// Wide, Generous Clinical Reference Ranges
const VITAL_RANGES = {
  bp: {
    label: 'Blood Pressure',
    unit: 'mmHg',
    normalSysMin: 90,
    normalSysMax: 135, // Generous upper bound for normal systolic
    normalDiaMin: 60,
    normalDiaMax: 88,  // Generous upper bound for normal diastolic
    mediumSysMax: 145, // Medium / Elevated upper bound
    mediumDiaMax: 94,
  },
  hr: {
    label: 'Heart Rate',
    unit: 'bpm',
    normalMin: 55,     // Relaxed resting lower bound
    normalMax: 105,    // Relaxed resting upper bound
    mediumMin: 48,
    mediumMax: 115,
  },
  temp: {
    label: 'Temperature',
    unit: '°F',
    normalMin: 96.8,   // Covers standard circadian variance
    normalMax: 99.5,   // Mild elevations up to 99.5 remain Normal/Medium
    mediumMax: 100.4,  // Clinical low-grade fever threshold
  },
  weight: {
    label: 'Weight',
    unit: 'kg',
    normalMin: 45,
    normalMax: 95,
  },
  height: {
    label: 'Height',
    unit: 'cm',
    normalMin: 140,
    normalMax: 205,
  },
  bmi: {
    label: 'BMI',
    unit: 'kg/m²',
    normalMin: 18.5,
    normalMax: 26.5,   // Generous normal range
    mediumMax: 30.0,   // Medium / Overweight
  }
};

/**
 * Calculate status string: Normal, Medium, High, Low
 */
const calculateStatus = (type, value) => {
  if (!value) return 'Normal';

  if (type === 'bp') {
    const parts = String(value).split('/').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 'Normal';
    const [sys, dia] = parts;
    const r = VITAL_RANGES.bp;

    if (sys < r.normalSysMin || dia < r.normalDiaMin) return 'Low';
    if (sys <= r.normalSysMax && dia <= r.normalDiaMax) return 'Normal';
    if (sys <= r.mediumSysMax && dia <= r.mediumDiaMax) return 'Medium';
    return 'High';
  }

  const num = parseFloat(value);
  if (isNaN(num)) return 'Normal';

  const r = VITAL_RANGES[type];
  if (!r) return 'Normal';

  if (type === 'bmi') {
    if (num < r.normalMin) return 'Low';
    if (num <= r.normalMax) return 'Normal';
    if (num <= r.mediumMax) return 'Medium';
    return 'High';
  }

  if (type === 'hr') {
    if (num < r.mediumMin) return 'Low';
    if (num < r.normalMin) return 'Medium';
    if (num <= r.normalMax) return 'Normal';
    if (num <= r.mediumMax) return 'Medium';
    return 'High';
  }

  if (type === 'temp') {
    if (num < r.normalMin) return 'Low';
    if (num <= r.normalMax) return 'Normal';
    if (num <= r.mediumMax) return 'Medium';
    return 'High';
  }

  if (r.normalMin !== undefined && r.normalMax !== undefined) {
    if (num < r.normalMin) return 'Low';
    if (num > r.normalMax) return 'High';
    return 'Normal';
  }

  return 'Normal';
};

const getStatusColor = (status) => {
  if (status === 'Normal') return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  if (status === 'Medium') return 'bg-amber-100 text-amber-800 border border-amber-200';
  if (status === 'High')   return 'bg-rose-100 text-rose-800 border border-rose-200';
  if (status === 'Low')    return 'bg-sky-100 text-sky-800 border border-sky-200';
  return 'bg-slate-100 text-slate-700 border border-slate-200';
};
</script>
