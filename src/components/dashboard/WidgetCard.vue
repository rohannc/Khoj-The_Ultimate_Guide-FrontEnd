<template>
  <div class="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] p-7 flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <div v-if="$slots.icon" class="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center text-indigo-600 border border-indigo-100/50 shadow-sm">
          <slot name="icon"></slot>
        </div>
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ title }}</h2>
      </div>
      <div v-if="$slots.headerAction">
        <slot name="headerAction"></slot>
      </div>
    </div>
    <div class="flex-grow flex flex-col relative z-10 min-h-0">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="mt-auto pt-6 border-t border-slate-100">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
