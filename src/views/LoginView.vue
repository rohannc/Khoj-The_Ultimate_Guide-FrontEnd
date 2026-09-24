<template>
  <div class="min-h-screen w-full flex bg-white font-jakarta">
    


    <!-- Left Panel: Presentation (Hidden on mobile, 50% width on desktop) -->
    <div class="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-20 relative overflow-hidden" :style="{ backgroundColor: roleShadow }">
      <!-- Background Decorative Elements -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-6 mb-16">
          <button @click="router.push('/')" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all group z-50">
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="w-px h-8 bg-slate-400/20"></div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">K</div>
            <span class="font-extrabold text-2xl text-slate-900 tracking-tighter">KhojHealth</span>
          </div>
        </div>

        <div v-html="roleIcon" class="mb-8 origin-left transform scale-125"></div>
        
        <h1 class="text-5xl font-extrabold text-slate-900 tracking-tighter mb-4 leading-tight">
          Welcome back to the <br />
          <span :style="{ color: roleColor }">{{ currentRoleFormatted }} Portal</span>
        </h1>
        <p class="text-xl text-slate-700 font-medium max-w-md">
          Access your personalized dashboard to manage your healthcare journey efficiently and securely.
        </p>
      </div>

      <div class="relative z-10 flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-sm font-semibold text-slate-700 w-max shadow-sm border border-white/50">
        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Enterprise-grade Security
      </div>
    </div>

    <!-- Right Panel: Form (100% on mobile, 50% on desktop) -->
    <div class="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 relative mt-16 lg:mt-0 lg:h-screen lg:overflow-y-scroll overflow-x-hidden">
      <!-- Mobile Header (Visible only on small screens) -->
      <div class="lg:hidden absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button @click="router.push('/')" class="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 shadow-sm border border-slate-200/50 transition-all group">
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div class="flex items-center gap-2">
          <span class="font-bold text-lg text-slate-900 tracking-tighter">KhojHealth</span>
          <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold shadow-md">K</div>
        </div>
      </div>

      <div class="w-full max-w-lg mx-auto pt-12 lg:pt-20 pb-12 flex-shrink-0">
        <!-- Slide Controls (Login / Signup) -->
        <div class="flex relative w-full h-14 bg-slate-100 rounded-2xl p-1.5 mb-10">
          <div class="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 left-1.5" :style="{ boxShadow: `0 4px 14px 0 ${roleShadow}` }"></div>
          <button class="relative z-10 flex-1 flex items-center justify-center text-sm font-bold text-slate-900 transition-colors">Login</button>
          <router-link :to="signupLink" class="relative z-10 flex-1 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Sign Up</router-link>
        </div>

        <div class="mb-8">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Sign in</h2>
          <p class="text-slate-500 font-medium mt-1">Please enter your details to continue.</p>
        </div>

        <Transition name="alert-fade">
          <div v-if="loginError" class="flex items-center p-4 mb-6 text-sm text-red-800 border border-red-200 rounded-2xl bg-red-50">
            <svg class="flex-shrink-0 inline w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium">{{ loginError }}</span>
            <button @click="loginError = ''" class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">Username or Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <input type="text" v-model="loginData.username" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Enter your username">
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-bold text-slate-700">Password</label>
              <a href="#" class="text-sm font-bold transition-colors hover:underline" :style="{ color: roleColor }">Forgot password?</a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input :type="isPasswordVisible ? 'text' : 'password'" v-model="loginData.password" required class="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Enter your password">
              <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                <svg v-if="!isPasswordVisible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="isLoading || isSuccess" class="w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-[56px]" :style="{ backgroundColor: roleColor, boxShadow: `0 10px 15px -3px ${roleShadow}, 0 4px 6px -4px ${roleShadow}` }">
            <span v-if="!isLoading && !isSuccess">Sign In</span>
            <div v-if="isLoading" class="spinner">
              <svg class="w-6 h-6 animate-spin text-white/80" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path fill="#fff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div v-if="isSuccess" class="success-icon text-white">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
            </div>
          </button>
        </form>
        
        <p class="mt-8 text-center text-sm font-medium text-slate-500">
          Not a member? 
          <router-link :to="signupLink" class="font-bold hover:underline transition-colors" :style="{ color: roleColor }">Sign up now</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { AuthService } from '@/services/auth.service';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const isSuccess = ref(false);
const loginError = ref('');
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const loginData = ref({
  username: '',
  password: ''
});

const currentRole = computed(() => {
  const role = route.params.role;
  return ['doctor', 'patient', 'clinic'].includes(role) ? role : 'default';
});

const signupLink = computed(() => `/signup/${currentRole.value}`);

const currentRoleFormatted = computed(() => {
  if (!currentRole.value || currentRole.value === 'default') return 'User';
  return currentRole.value.charAt(0).toUpperCase() + currentRole.value.slice(1).toLowerCase();
});

const roleColor = computed(() => {
  switch (currentRole.value) {
    case 'patient': return '#2563EB'; // blue-600
    case 'doctor': return '#0D9488'; // teal-600
    case 'clinic': return '#E11D48'; // rose-600
    default: return '#2563EB';
  }
});

const roleShadow = computed(() => {
  switch (currentRole.value) {
    case 'patient': return 'rgba(37, 99, 235, 0.08)';
    case 'doctor': return 'rgba(13, 148, 136, 0.08)';
    case 'clinic': return 'rgba(225, 29, 72, 0.08)'; // rose-600
    default: return 'rgba(37, 99, 235, 0.08)';
  }
});

const roleIcon = computed(() => {
  switch (currentRole.value) {
    case 'doctor':
      return `<div class="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div>`;
    case 'patient':
      return `<div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
    case 'clinic':
      return `<div class="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  }
});

const handleLogin = async () => {
  loginError.value = '';
  isLoading.value = true;
  isSuccess.value = false;

  const payload = {
    username: loginData.value.username,
    password: loginData.value.password,
  };

  const apiCall = AuthService.login(payload);
  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));

  try {
    const [authResult] = await Promise.all([apiCall, minLoadingTime]);
    const result = authResult.data;
    const userRole = result.userType?.toLowerCase();

    if (!userRole || !['doctor', 'patient', 'clinic'].includes(userRole)) {
      throw new Error("A valid user role was not provided by the server.");
    }

    isLoading.value = false;
    isSuccess.value = true;
    
    const userToStore = {
      username: result.username,
      role: userRole,
      userId: result.userId
    };

    authStore.login(userToStore, result.token);

    setTimeout(() => {
      const dashboardPath = `/dashboard/${userRole}`;
      router.push(dashboardPath);
    }, 1000);

  } catch (error) {
    isLoading.value = false;
    isSuccess.value = false;
    loginError.value = error.message || "An error occurred during login.";
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
