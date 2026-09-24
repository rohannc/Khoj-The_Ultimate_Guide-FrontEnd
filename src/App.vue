<script setup>

</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="global-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* Global Route Transition */
.global-fade-enter-active,
.global-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.global-fade-enter-from,
.global-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
