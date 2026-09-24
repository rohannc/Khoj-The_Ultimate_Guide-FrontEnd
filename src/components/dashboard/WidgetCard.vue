<template>
  <div class="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div v-if="$slots.icon" class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 shadow-sm">
          <slot name="icon"></slot>
        </div>
        <h2 class="text-lg font-bold text-slate-800 tracking-wide">{{ title }}</h2>
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
