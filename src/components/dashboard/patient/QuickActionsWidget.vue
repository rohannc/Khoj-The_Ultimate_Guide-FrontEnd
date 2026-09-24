<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <button v-for="(action, index) in quickActions" :key="index" class="group relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:bg-slate-50 hover:shadow-md hover:border-slate-300 flex flex-col items-center justify-center text-center">
      <div class="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm" :class="action.colorClass">
        <component :is="getIcon(action.iconName)" class="w-6 h-6" :class="action.iconColorClass" />
      </div>
      <span class="text-sm font-bold text-slate-800 tracking-wide">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { h } from 'vue';

defineProps({
  quickActions: {
    type: Array,
    default: () => [
      { label: 'Find Doctor', iconName: 'search', colorClass: 'bg-teal-50', iconColorClass: 'text-teal-600' },
      { label: 'Health Records', iconName: 'document', colorClass: 'bg-blue-50', iconColorClass: 'text-blue-600' },
      { label: 'Messages', iconName: 'chat', colorClass: 'bg-indigo-50', iconColorClass: 'text-indigo-600' },
      { label: 'Account', iconName: 'user', colorClass: 'bg-slate-50', iconColorClass: 'text-slate-600' }
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
  
  const DocumentIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ]);
  
  const ChatIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' })
  ]);

  const UserIcon = (props, context) => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', ...context.attrs }, [
    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
  ]);

  if (name === 'search') return SearchIcon;
  if (name === 'document') return DocumentIcon;
  if (name === 'chat') return ChatIcon;
  if (name === 'user') return UserIcon;
  return GenericIcon;
};
</script>
