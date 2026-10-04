<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <button v-for="(action, index) in quickActions" :key="index" @click="action.route ? router.push(action.route) : null" class="group relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-6 transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
      <div class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm" :class="action.colorClass">
        <component :is="getIcon(action.iconName)" class="w-7 h-7" :class="action.iconColorClass" />
      </div>
      <span class="text-sm font-bold text-slate-800 tracking-wide">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { h } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  quickActions: {
    type: Array,
    default: () => [
      { label: 'Find Doctor', iconName: 'search', colorClass: 'bg-teal-50', iconColorClass: 'text-teal-600', route: '/search?type=doctors' },
      { label: 'Notifications', iconName: 'bell', colorClass: 'bg-indigo-50', iconColorClass: 'text-indigo-600', route: '/dashboard/patient/notifications' },
      { label: 'Find Clinic', iconName: 'hospital', colorClass: 'bg-blue-50', iconColorClass: 'text-blue-600', route: '/search?type=clinics' },
      { label: 'Account', iconName: 'user', colorClass: 'bg-slate-50', iconColorClass: 'text-slate-600', route: '/dashboard/patient/profile' }
    ]
  }
});

const getIcon = (name) => {
  const GenericIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' }) // Lightning bolt generic
  ]);
  
  const SearchIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
  ]);
  
  const BellIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
  ]);
  
  const ChatIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' })
  ]);

  const UserIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
  ]);

  const HospitalIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
  ]);

  if (name === 'search') return SearchIcon;
  if (name === 'bell') return BellIcon;
  if (name === 'chat') return ChatIcon;
  if (name === 'hospital') return HospitalIcon;
  if (name === 'user') return UserIcon;
  return GenericIcon;
};
</script>
