<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 p-6 md:p-8 lg:p-12">
    <div class="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
      <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Book Appointment</h1>
      <p class="text-slate-500 mb-8 max-w-lg mx-auto">
        Booking module is currently under construction.
        <span v-if="$route.query.doctorId" class="block mt-2 font-bold text-slate-700">Booking for Doctor ID: {{ $route.query.doctorId }}</span>
        <span v-if="$route.query.clinicId" class="block mt-2 font-bold text-slate-700">Viewing Doctors for Clinic ID: {{ $route.query.clinicId }}</span>
      </p>
      
      <button @click="$router.back()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm">
        Go Back
      </button>
    </div>
  </div>
</template>

<script setup>
// Booking appointment placeholder
</script>
