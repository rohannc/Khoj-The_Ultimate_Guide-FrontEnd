<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-4 sm:p-8 lg:p-12 font-jakarta">
    
    <!-- Navbar / Logo Area -->
    <div class="w-full max-w-7xl flex justify-between items-center mb-8 lg:mb-12">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">K</div>
        <span class="font-extrabold text-2xl text-slate-900 tracking-tighter">KhojHealth</span>
      </div>
      <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-900/5">
        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Secure & Encrypted
      </div>

    </div>

    <!-- Bento Grid Container -->
    <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_1fr_1fr] gap-6 lg:gap-8 flex-grow">
      
      <!-- 1. Intro / Header Box (Spans 3 columns) -->
      <div class="col-span-1 lg:col-span-3 bg-white rounded-[2.5rem] p-8 lg:px-16 lg:py-14 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
        <!-- Decorative bg -->
        <div class="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
        
        <div class="relative z-10 max-w-2xl">
          <h1 class="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter mb-4 leading-[1.05]">
            Healthcare, <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">reimagined.</span>
          </h1>
          <p class="text-lg lg:text-2xl text-slate-500 font-medium tracking-tight">
            Select your designated portal to access a personalized suite of medical tools.
          </p>
        </div>
        

        <!-- Relatable Floating Medical Icons Composition -->
        <div class="hidden sm:block relative z-10 p-4 mr-8 lg:mr-16">
          <div class="relative w-32 h-32">
            <!-- Outer glow -->
            <div class="absolute inset-0 bg-blue-100 rounded-full blur-2xl"></div>
            <!-- Main Heart icon -->
            <div class="absolute inset-0 bg-white rounded-full shadow-xl flex items-center justify-center border border-blue-50">
               <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <!-- Floating flask (Labs) -->
            <div class="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-50 animate-bounce" style="animation-duration: 3s;">
               <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <!-- Floating cross (First Aid) -->
            <div class="absolute -bottom-2 -left-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-50 animate-bounce" style="animation-duration: 4s;">
               <svg class="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Patient Box (Massive, Spans 2 columns & 2 rows) -->
      <div 
        @click="navigateToRole('patient')"
        class="group col-span-1 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 lg:p-14 shadow-xl shadow-blue-900/20 ring-1 ring-slate-900/5 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 relative overflow-hidden"
      >
        <!-- Watermark icon -->
        <svg class="absolute -bottom-10 -right-10 w-96 h-96 text-white opacity-5 transform rotate-[15deg] group-hover:scale-110 group-hover:opacity-10 transition-all duration-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>

        <div class="relative z-10 flex justify-between items-start">
          <div class="w-20 h-20 bg-white/10 backdrop-blur-md text-white rounded-3xl flex items-center justify-center mb-6 ring-1 ring-white/20 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-500">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/20 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-500">
             <svg class="w-6 h-6 transform group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          </div>
        </div>

        <div class="relative z-10 mt-20">
          <h2 class="text-4xl lg:text-6xl font-extrabold text-white mb-4 tracking-tighter">Patient Portal</h2>
          <p class="text-blue-100 font-medium text-xl lg:text-2xl leading-relaxed max-w-md tracking-tight">Access your medical history, seamlessly book appointments, and connect directly with your healthcare team.</p>
        </div>
      </div>

      <!-- 3. Doctor Box (Spans 1 col, 1 row) -->
      <div 
        @click="navigateToRole('doctor')"
        class="group col-span-1 bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 relative overflow-hidden"
      >
        <svg class="absolute -bottom-6 -right-6 w-48 h-48 text-teal-50 transform rotate-[-15deg] group-hover:scale-110 group-hover:text-teal-100 transition-all duration-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        
        <div class="relative z-10">
          <div class="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h2 class="text-3xl font-extrabold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors duration-300 tracking-tight">Doctor Portal</h2>
          <p class="text-slate-500 font-medium text-lg leading-snug tracking-tight">Manage patients and daily schedules.</p>
        </div>
      </div>

      <!-- 4. Clinic Box (Spans 1 col, 1 row) -->
      <div 
        @click="navigateToRole('clinic')"
        class="group col-span-1 bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/20 hover:-translate-y-2 relative overflow-hidden"
      >
        <svg class="absolute -bottom-6 -right-6 w-48 h-48 text-rose-50 transform rotate-[10deg] group-hover:scale-110 group-hover:text-rose-100 transition-all duration-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>

        <div class="relative z-10">
          <div class="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h2 class="text-3xl font-extrabold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors duration-300 tracking-tight">Clinic Portal</h2>
          <p class="text-slate-500 font-medium text-lg leading-snug tracking-tight">Administer overall facility operations.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToRole = (role) => {
  router.push(`/login/${role}`);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>
