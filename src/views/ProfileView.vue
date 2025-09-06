<template>
  <div v-if="activeProfileComponent">
    <component :is="activeProfileComponent" />
  </div>
  <div v-else>
    <p>Could not load profile. Please log in again.</p>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Use defineAsyncComponent for better performance (code splitting)
const PatientProfileView = defineAsyncComponent(() => import('./PatientProfile.vue'));
const DoctorProfileView = defineAsyncComponent(() => import('./DoctorProfile.vue'));
const ClinicProfileView = defineAsyncComponent(() => import('./ClinicProfile.vue'));

// Map roles to their corresponding components
const profileComponentMap = {
  patient: PatientProfileView,
  doctor: DoctorProfileView,
  clinic: ClinicProfileView,
};

const authStore = useAuthStore();
console.log("Outside");

// Computed property to dynamically select the correct component
const activeProfileComponent = computed(() => {
  console.log("Inside");
  return profileComponentMap[authStore.userRole] || null;
});
</script>
