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
          Join the <br />
          <span :style="{ color: roleColor }">{{ currentRoleFormatted }} Portal</span>
        </h1>
        <p class="text-xl text-slate-700 font-medium max-w-md">
          Create your account to start managing your healthcare journey efficiently and securely.
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

      <div class="w-full max-w-xl mx-auto pt-12 lg:pt-20 pb-12 flex-shrink-0">
        <!-- Slide Controls (Login / Signup) -->
        <div class="flex relative w-full h-14 bg-slate-100 rounded-2xl p-1.5 mb-10">
          <div class="absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 right-1.5" :style="{ boxShadow: `0 4px 14px 0 ${roleShadow}` }"></div>
          <router-link :to="loginLink" class="relative z-10 flex-1 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Login</router-link>
          <button class="relative z-10 flex-1 flex items-center justify-center text-sm font-bold text-slate-900 transition-colors">Sign Up</button>
        </div>

        <div class="mb-8">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p class="text-slate-500 font-medium mt-1">Please enter your details to register.</p>
        </div>

        <Transition name="alert-fade">
          <div v-if="signupError" class="flex items-center p-4 mb-6 text-sm text-red-800 border border-red-200 rounded-2xl bg-red-50">
            <svg class="flex-shrink-0 inline w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium">{{ signupError }}</span>
            <button @click="signupError = ''" class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </Transition>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <!-- Account Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Account Details</h3>
            
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input type="text" v-model="clinicData.username" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Choose a username">
              </div>
              <p v-if="usernameError" class="text-red-500 text-xs mt-1">{{ usernameError }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input type="password" v-model="clinicData.password" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Password">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Confirm Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input :type="isPasswordVisible ? 'text' : 'password'" v-model="clinicData.confirmPassword" required class="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Confirm Password">
                  <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                    <svg v-if="!isPasswordVisible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  </button>
                </div>
              </div>
            </div>
            <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
          </div>

          <!-- Clinic Information Section -->
          <div class="space-y-4 pt-4">
            <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Clinic Information</h3>
            
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Clinic Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <input type="text" v-model="clinicData.name" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Clinic Name">
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Clinic Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input type="email" v-model="clinicData.email" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="contact@clinic.com">
              </div>
              <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Street Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <input type="text" v-model="clinicData.street" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="123 Main St">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">City</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="clinicData.city" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="City">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">State</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="clinicData.state" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="State">
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Pincode</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="clinicData.pincode" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Pincode">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Country</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="clinicData.country" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Country">
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Primary Phone</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <input type="tel" v-model="clinicData.primaryPhone" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Phone">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Secondary Phone</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <input type="tel" v-model="clinicData.secondaryPhone" class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Optional">
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Website URL</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </div>
                <input type="url" v-model="clinicData.website" class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="https://">
              </div>
            </div>
          </div>

          <!-- Opening Hours Section -->
          <div class="space-y-4 pt-4 border-t border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 pb-2">Opening Hours</h3>
            
            <div class="space-y-3">
              <div v-for="(day, index) in openingHours" :key="index" class="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div class="w-24 font-bold text-slate-700">{{ day.day }}</div>
                
                <div class="flex-1 flex items-center gap-2">
                  <div class="relative flex-1">
                    <input type="time" v-model="day.open" :disabled="day.isClosed" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-slate-100 disabled:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }">
                  </div>
                  <span class="text-slate-400 font-bold">-</span>
                  <div class="relative flex-1">
                    <input type="time" v-model="day.close" :disabled="day.isClosed" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-slate-100 disabled:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }">
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:ml-4">
                  <input type="checkbox" :id="'closed-' + index" v-model="day.isClosed" class="w-5 h-5 rounded border-slate-300 focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer" :style="{ accentColor: roleColor }">
                  <label :for="'closed-' + index" class="text-sm font-bold text-slate-700 cursor-pointer">Closed</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="isLoading || isSuccess" class="w-full py-4 mt-6 text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-[56px]" :style="{ backgroundColor: roleColor, boxShadow: `0 10px 15px -3px ${roleShadow}, 0 4px 6px -4px ${roleShadow}` }">
            <span v-if="!isLoading && !isSuccess">Sign Up</span>
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
          Already a member?&nbsp;&nbsp;
          <router-link :to="loginLink" class="ml-1.5 font-bold hover:underline transition-colors" :style="{ color: roleColor }">Login now</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { AuthService } from '@/services/auth.service';

const router = useRouter();
const authStore = useAuthStore();

// --- Form State ---
const isLoading = ref(false);
const isSuccess = ref(false);
const signupError = ref('');

// --- Static Role Data ---
const currentRoleFormatted = 'Clinic';
const loginLink = '/login/clinic';
const roleIcon = `<div class="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`;
const roleColor = '#E11D48';
const roleShadow = 'rgba(225, 29, 72, 0.08)';

// --- Form Data ---
const clinicData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  primaryPhone: '',
  secondaryPhone: '',
  website: '',
});

// --- Field-specific Validation State ---
const passwordError = ref('');
const usernameError = ref('');
const emailError = ref('');
const isPasswordVisible = ref(false);

const openingHours = ref([
  { day: 'Monday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Tuesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Wednesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Thursday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Friday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Saturday', open: '09:00', close: '13:00', isClosed: false },
  { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true },
]);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// --- Helper to format 24h time to 12h AM/PM format ---
const formatTime12h = (time24h) => {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

// --- Form Submission Logic ---
const handleSignup = async () => {
  passwordError.value = '';
  usernameError.value = '';
  emailError.value = '';
  signupError.value = '';

  if (clinicData.value.password !== clinicData.value.confirmPassword) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  isLoading.value = true;
  isSuccess.value = false;

  const phoneNumbers = [];
  if (clinicData.value.primaryPhone) phoneNumbers.push({ number: clinicData.value.primaryPhone });
  if (clinicData.value.secondaryPhone) phoneNumbers.push({ number: clinicData.value.secondaryPhone });

  const formattedHours = {};
  openingHours.value.forEach(day => {
    if (day.isClosed) {
      formattedHours[day.day] = 'Closed';
    } else {
      const openTime = formatTime12h(day.open);
      const closeTime = formatTime12h(day.close);
      formattedHours[day.day] = `${openTime} - ${closeTime}`;
    }
  });

  const formData = {
    username: clinicData.value.username,
    password: clinicData.value.password,
    emailId: clinicData.value.email,
    name: clinicData.value.name,
    street: clinicData.value.street,
    city: clinicData.value.city,
    state: clinicData.value.state,
    pinCode: clinicData.value.pincode,
    country: clinicData.value.country,
    phoneNumbers: phoneNumbers,
    website: clinicData.value.website,
    openingHours: formattedHours,
  };

  const apiCall = AuthService.registerClinic(formData);
  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const [authResult] = await Promise.all([apiCall, minLoadingTime]);
    const result = authResult.data;

    isLoading.value = false;
    isSuccess.value = true;

    const userToStore = {
      username: result.username,
      role: result.userType?.toLowerCase() || 'clinic',
      userId: result.userId
    };
    authStore.login(userToStore, result.token);

    setTimeout(() => {
      router.push(`/dashboard/${userToStore.role}`);
    }, 1500);

  } catch (error) {
    isLoading.value = false;
    const errorMessage = error.message || "Signup failed";
    if (errorMessage.toLowerCase().includes('username')) {
      usernameError.value = errorMessage;
    } else if (errorMessage.toLowerCase().includes('email')) {
      emailError.value = errorMessage;
    } else {
      signupError.value = errorMessage;
    }
  }
};

watch(
  [() => clinicData.value.password, () => clinicData.value.confirmPassword],
  ([password, confirmPassword]) => {
    if (password && password.length < 8) {
      passwordError.value = 'Password must be at least 8 characters long.';
    } else if (confirmPassword && password !== confirmPassword) {
      passwordError.value = 'Passwords do not match.';
    } else {
      passwordError.value = '';
    }
  }
);

watch(() => clinicData.value.email, (newVal) => {
  if (newVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newVal)) {
    emailError.value = 'Please enter a valid email address.';
  } else {
    emailError.value = '';
  }
});
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
