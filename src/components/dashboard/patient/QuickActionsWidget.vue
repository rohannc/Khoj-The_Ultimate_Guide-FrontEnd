<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <button v-for="(action, index) in quickActions" :key="index" @click="action.route ? router.push(action.route) : null" class="group relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:bg-slate-50 hover:shadow-md hover:border-slate-300 flex flex-col items-center justify-center text-center">
      <div class="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm" :class="action.colorClass">
        <component :is="getIcon(action.iconName)" class="w-6 h-6" :class="action.iconColorClass" />
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
      { label: 'Find Doctor', iconName: 'search', colorClass: 'bg-teal-50', iconColorClass: 'text-teal-600', route: '/dashboard/patient/book-appointment' },
      { label: 'Notifications', iconName: 'bell', colorClass: 'bg-indigo-50', iconColorClass: 'text-indigo-600', route: '/dashboard/patient/notifications' },
      { label: 'Messages', iconName: 'chat', colorClass: 'bg-blue-50', iconColorClass: 'text-blue-600', route: '/dashboard/patient/messages' },
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

  if (name === 'search') return SearchIcon;
  if (name === 'bell') return BellIcon;
  if (name === 'chat') return ChatIcon;
  if (name === 'user') return UserIcon;
  return GenericIcon;
};
</script>
