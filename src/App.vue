<script setup>

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="global-fade" mode="out-in">
      <component :is="Component" :key="route.matched[0]?.path || route.path" />
    </transition>
  </router-view>
</template>

<style>
/* Global Route Transition - Smooth cubic-bezier flow */
.global-fade-enter-active,
.global-fade-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.global-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.global-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
