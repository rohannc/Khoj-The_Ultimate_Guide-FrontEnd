<template>
  <div class="min-h-screen flex text-slate-800 bg-slate-50 font-sans">
    
    <!-- Sidebar (Desktop) -->
    <aside class="w-64 hidden md:flex flex-col bg-white border-r border-slate-200 shadow-sm z-20">
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <div class="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center font-bold shadow-sm mr-3">K</div>
        <span class="font-extrabold text-xl tracking-tight text-slate-800">KhojHealth</span>
      </div>
      <nav class="flex-1 py-6 px-4 space-y-2">
        <router-link to="/dashboard/patient" class="flex items-center px-4 py-3 bg-teal-50 text-teal-700 rounded-xl transition-colors font-medium">
          <svg class="w-5 h-5 mr-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Dashboard
        </router-link>
        <a href="#" class="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors font-medium">
          <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Appointments
        </a>
        <a href="#" class="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors font-medium">
          <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Records
        </a>
      </nav>
      <div class="p-4 border-t border-slate-100">
        <button @click="logout" class="flex items-center w-full px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium">
          <svg class="w-5 h-5 mr-3 text-slate-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      
      <!-- Top Navbar -->
      <header class="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
        <div class="flex items-center">
          <button @click="toggleMobileMenu" class="md:hidden text-slate-500 hover:text-slate-800 focus:outline-none mr-4">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="md:hidden flex items-center gap-2">
            <div class="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center font-bold shadow-md">K</div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
           <!-- Notifications Bell -->
           <button class="relative p-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none rounded-full hover:bg-slate-100">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
             <span class="absolute top-1.5 right-1.5 block w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
           </button>

           <!-- User Profile -->
           <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div class="hidden sm:block text-right">
                 <p class="text-sm font-bold text-slate-800">{{ authStore.user?.firstName || 'Guest' }}</p>
                 <p class="text-xs text-teal-600 font-medium">{{ authStore.user?.role || 'Patient' }}</p>
              </div>
              <img class="w-9 h-9 rounded-full object-cover border border-slate-200" :src="`https://ui-avatars.com/api/?name=${authStore.user?.firstName || 'G'}+${authStore.user?.lastName || 'U'}&background=14b8a6&color=fff`" alt="User Avatar">
           </div>
        </div>
      </header>

      <!-- Main Scrollable Area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto relative z-0 flex flex-col">
        <div class="p-4 sm:p-6 lg:p-8 flex-1">
          <router-view />
        </div>
        
        <!-- Footer -->
        <footer class="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto">
          <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2026 KhojHealth. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="hover:text-teal-600 transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-teal-600 transition-colors">Terms of Service</a>
              <a href="#" class="hover:text-teal-600 transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden" @click="toggleMobileMenu"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const logout = () => {
  authStore.logout();
  router.push('/login/patient');
};
</script>
