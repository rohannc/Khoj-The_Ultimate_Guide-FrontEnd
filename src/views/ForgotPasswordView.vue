<template>
  <div class="min-h-screen w-full flex bg-white font-jakarta relative overflow-hidden">
    <!-- Global Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="toastMessage.text" :class="[
        'fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm border backdrop-blur-md',
        toastMessage.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' : 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
      ]">
        <svg v-if="toastMessage.type === 'error'" class="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-6 h-6 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="font-semibold text-sm leading-snug">{{ toastMessage.text }}</p>
        <button @click="toastMessage.text = ''" class="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </Transition>

    <!-- Left Panel: Presentation (Hidden on mobile, 50% width on desktop) -->
    <div class="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-20 relative overflow-hidden" :style="{ backgroundColor: roleShadow }">
      <!-- Background Decorative Elements -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-6 mb-16">
          <button @click="router.push(loginLink)" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all group z-50" title="Back to Login">
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="w-px h-8 bg-slate-400/20"></div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">K</div>
            <span class="font-extrabold text-2xl text-slate-900 tracking-tighter">KhojHealth</span>
          </div>
        </div>

        <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-8" :style="{ backgroundColor: roleColor, boxShadow: `0 10px 25px -5px ${roleColor}40` }">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        
        <h1 class="text-5xl font-extrabold text-slate-900 tracking-tighter mb-4 leading-tight">
          Reset Your <br />
          <span :style="{ color: roleColor }">Account Password</span>
        </h1>
        <p class="text-xl text-slate-700 font-medium max-w-md">
          Recover your access quickly with a secure 6-digit one-time verification passcode.
        </p>
      </div>

      <div class="relative z-10 flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-sm font-semibold text-slate-700 w-max shadow-sm border border-white/50">
        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        256-Bit Encrypted Security
      </div>
    </div>

    <!-- Right Panel: Form (100% on mobile, 50% on desktop) -->
    <div class="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 relative mt-16 lg:mt-0 lg:h-screen lg:overflow-y-scroll overflow-x-hidden">
      <!-- Mobile Header -->
      <div class="lg:hidden absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button @click="router.push(loginLink)" class="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 shadow-sm border border-slate-200/50 transition-all group">
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div class="flex items-center gap-2">
          <span class="font-bold text-lg text-slate-900 tracking-tighter">KhojHealth</span>
          <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold shadow-md">K</div>
        </div>
      </div>

      <div class="w-full max-w-lg mx-auto pt-12 lg:pt-20 pb-12 flex-shrink-0">
        
        <!-- Step Progress Indicator -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all',
              currentStep === 1 ? 'text-white' : 'bg-emerald-100 text-emerald-700'
            ]" :style="currentStep === 1 ? { backgroundColor: roleColor } : {}">
              <span v-if="currentStep === 1">1</span>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1</p>
              <p class="text-sm font-bold text-slate-800">Request OTP</p>
            </div>
          </div>

          <div class="flex-1 mx-4 h-0.5 bg-slate-100 relative">
            <div class="h-0.5 transition-all duration-500" :style="{
              width: currentStep === 2 ? '100%' : '0%',
              backgroundColor: roleColor
            }"></div>
          </div>

          <div class="flex items-center gap-3">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all',
              currentStep === 2 ? 'text-white' : 'bg-slate-100 text-slate-400'
            ]" :style="currentStep === 2 ? { backgroundColor: roleColor } : {}">
              2
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Step 2</p>
              <p class="text-sm font-bold text-slate-800">Reset Password</p>
            </div>
          </div>
        </div>

        <!-- Inline Success / Error Banner (if any) -->
        <div v-if="successMessage" class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-sm font-semibold flex items-start gap-3 shadow-sm animate-fade-in">
          <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-bold text-emerald-950">Success</p>
            <p class="text-xs text-emerald-800 mt-0.5 leading-relaxed">{{ successMessage }}</p>
          </div>
        </div>

        <div v-if="errorMessage" class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 text-sm font-semibold flex items-start gap-3 shadow-sm animate-shake">
          <div class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-bold text-rose-950">Incorrect Information</p>
            <p class="text-xs text-rose-800 mt-0.5 leading-relaxed">{{ errorMessage }}</p>
          </div>
          <button @click="errorMessage = ''" class="text-rose-400 hover:text-rose-700 transition-colors p-0.5">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- ============================================ -->
        <!-- STEP 1: REQUEST OTP                          -->
        <!-- ============================================ -->
        <div v-if="currentStep === 1">
          <div class="mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h2>
            <p class="text-slate-500 font-medium mt-1">Enter your registered email and mobile number to receive a verification code.</p>
          </div>

          <form @submit.prevent="handleRequestOtp" class="space-y-5">
            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Registered Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  v-model="email" 
                  @input="clearFieldError('email'); errorMessage = ''"
                  required 
                  :class="[
                    'w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm',
                    fieldErrors.email || (errorMessage && !fieldErrors.primaryMobile) ? 'border-rose-300 ring-1 ring-rose-100 bg-rose-50/30' : 'border-slate-200/80'
                  ]" 
                  :style="{ '--tw-ring-color': roleColor }" 
                  placeholder="name@example.com"
                />
              </div>
              <p v-if="fieldErrors.email" class="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ fieldErrors.email }}</span>
              </p>
            </div>

            <!-- Primary Mobile -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">10-Digit Mobile Number</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input 
                  type="tel" 
                  v-model="primaryMobile" 
                  @input="clearFieldError('primaryMobile'); errorMessage = ''"
                  maxlength="10" 
                  pattern="[0-9]{10}"
                  required 
                  :class="[
                    'w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm',
                    fieldErrors.primaryMobile ? 'border-rose-300 ring-1 ring-rose-100 bg-rose-50/30' : 'border-slate-200/80'
                  ]" 
                  :style="{ '--tw-ring-color': roleColor }" 
                  placeholder="e.g. 9876543210"
                />
              </div>
              <p v-if="fieldErrors.primaryMobile" class="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ fieldErrors.primaryMobile }}</span>
              </p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading" 
              class="w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-[56px]" 
              :style="{ backgroundColor: roleColor, boxShadow: `0 10px 15px -3px ${roleShadow}, 0 4px 6px -4px ${roleShadow}` }"
            >
              <span v-if="!isLoading">Send Verification OTP</span>
              <div v-else class="spinner">
                <svg class="w-6 h-6 animate-spin text-white/80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path fill="#fff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </button>
          </form>
        </div>

        <!-- ============================================ -->
        <!-- STEP 2: VERIFY OTP & RESET PASSWORD          -->
        <!-- ============================================ -->
        <div v-else-if="currentStep === 2">
          <div class="mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Enter OTP & Set Password</h2>
            <p class="text-slate-500 font-medium mt-1">
              A 6-digit passcode was dispatched for <span class="font-bold text-slate-800">{{ email }}</span>.
            </p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-5">
            <!-- 6-digit OTP -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-bold text-slate-700">6-Digit Verification OTP</label>
                <button 
                  type="button" 
                  @click="handleResendOtp" 
                  :disabled="isLoading || resendCooldown > 0"
                  class="text-xs font-bold transition-colors hover:underline disabled:opacity-50 disabled:no-underline"
                  :style="{ color: roleColor }"
                >
                  {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP' }}
                </button>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  v-model="otp" 
                  @input="clearFieldError('otp'); errorMessage = ''"
                  maxlength="6" 
                  pattern="[0-9]{6}"
                  required 
                  :class="[
                    'w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border rounded-2xl text-slate-900 tracking-widest text-lg font-mono focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 placeholder:tracking-normal placeholder:text-sm font-semibold shadow-sm',
                    fieldErrors.otp || (errorMessage && (errorMessage.toLowerCase().includes('otp') || errorMessage.toLowerCase().includes('expired'))) ? 'border-rose-300 ring-1 ring-rose-100 bg-rose-50/30' : 'border-slate-200/80'
                  ]" 
                  :style="{ '--tw-ring-color': roleColor }" 
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <p v-if="fieldErrors.otp" class="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ fieldErrors.otp }}</span>
              </p>
            </div>

            <!-- New Password -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">New Password (min 8 characters)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  :type="isPasswordVisible ? 'text' : 'password'" 
                  v-model="newPassword" 
                  @input="clearFieldError('newPassword'); clearFieldError('password'); errorMessage = ''"
                  required 
                  minlength="8"
                  :class="[
                    'w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium',
                    (fieldErrors.newPassword || fieldErrors.password) || (errorMessage && errorMessage.toLowerCase().includes('password')) ? 'border-rose-300 ring-1 ring-rose-100 bg-rose-50/30' : 'border-slate-200'
                  ]" 
                  :style="{ '--tw-ring-color': roleColor }" 
                  placeholder="Enter new password"
                />
                <button type="button" @click="isPasswordVisible = !isPasswordVisible" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                  <svg v-if="!isPasswordVisible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
              <p v-if="fieldErrors.newPassword || fieldErrors.password" class="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ fieldErrors.newPassword || fieldErrors.password }}</span>
              </p>
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Confirm New Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input 
                  :type="isConfirmPasswordVisible ? 'text' : 'password'" 
                  v-model="confirmPassword" 
                  @input="clearFieldError('confirmPassword'); errorMessage = ''"
                  required 
                  minlength="8"
                  :class="[
                    'w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium',
                    fieldErrors.confirmPassword || (errorMessage && errorMessage.toLowerCase().includes('match')) ? 'border-rose-300 ring-1 ring-rose-100 bg-rose-50/30' : 'border-slate-200'
                  ]" 
                  :style="{ '--tw-ring-color': roleColor }" 
                  placeholder="Re-enter new password"
                />
                <button type="button" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                  <svg v-if="!isConfirmPasswordVisible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
              <p v-if="fieldErrors.confirmPassword" class="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ fieldErrors.confirmPassword }}</span>
              </p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading || isSuccess" 
              class="w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-[56px]" 
              :style="{ backgroundColor: roleColor, boxShadow: `0 10px 15px -3px ${roleShadow}, 0 4px 6px -4px ${roleShadow}` }"
            >
              <span v-if="!isLoading && !isSuccess">Confirm & Reset Password</span>
              <div v-else class="spinner">
                <svg class="w-6 h-6 animate-spin text-white/80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path fill="#fff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div v-if="isSuccess" class="text-white">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              </div>
            </button>

            <!-- Back to step 1 option -->
            <button 
              type="button" 
              @click="currentStep = 1; errorMessage = ''; successMessage = '';"
              class="w-full py-3 text-slate-600 hover:text-slate-900 font-bold rounded-2xl transition-colors text-sm hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Change Email / Mobile
            </button>
          </form>
        </div>

        <p class="mt-8 text-center text-sm font-medium text-slate-500">
          Remember your password?
          <router-link :to="loginLink" class="font-bold hover:underline transition-colors ml-1" :style="{ color: roleColor }">Back to Login</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from '@/services/auth.service';

const route = useRoute();
const router = useRouter();

// Step control: 1 = Request OTP, 2 = Verify OTP & Set New Password
const currentStep = ref(1);

// Form values
const email = ref('');
const primaryMobile = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Password visibility
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

// UI feedback
const isLoading = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const fieldErrors = ref({});
const resendCooldown = ref(0);
let cooldownTimer = null;

const clearFieldError = (field) => {
  if (fieldErrors.value[field]) {
    delete fieldErrors.value[field];
  }
};

const toastMessage = ref({ text: '', type: '' });
let toastTimeout = null;
const showToast = (text, type = 'error') => {
  toastMessage.value = { text, type };
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = { text: '', type: '' };
  }, 4000);
};

const currentRole = computed(() => {
  const role = route.params.role;
  return ['doctor', 'patient', 'clinic'].includes(role) ? role : 'patient';
});

const loginLink = computed(() => `/login/${currentRole.value}`);

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
    case 'clinic': return 'rgba(225, 29, 72, 0.08)';
    default: return 'rgba(37, 99, 235, 0.08)';
  }
});

const startCooldown = () => {
  resendCooldown.value = 30;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(cooldownTimer);
    }
  }, 1000);
};

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
  if (toastTimeout) clearTimeout(toastTimeout);
});

// Step 1: Request OTP
async function handleRequestOtp() {
  errorMessage.value = '';
  successMessage.value = '';
  fieldErrors.value = {};
  
  // Basic validation
  if (!email.value || !primaryMobile.value) {
    errorMessage.value = 'Please enter both email and mobile number.';
    showToast(errorMessage.value);
    return;
  }
  if (!/^\d{10}$/.test(primaryMobile.value.trim())) {
    errorMessage.value = 'Mobile number must be exactly 10 digits.';
    showToast(errorMessage.value);
    return;
  }

  isLoading.value = true;
  try {
    const { data } = await AuthService.forgotPassword({
      email: email.value.trim().toLowerCase(),
      primaryMobile: primaryMobile.value.trim()
    });

    successMessage.value = data?.message || 'OTP sent successfully to your registered email and mobile.';
    showToast(successMessage.value, 'success');
    startCooldown();
    // Transition to Step 2
    currentStep.value = 2;
  } catch (err) {
    // Check for backend field-level validation errors (HTTP 400 with fieldErrors map)
    const backendFieldErrors = err.fieldErrors || err.response?.data?.fieldErrors;
    if (backendFieldErrors && typeof backendFieldErrors === 'object' && Object.keys(backendFieldErrors).length > 0) {
      fieldErrors.value = { ...backendFieldErrors };
    }

    // Unmatched Email/Mobile: Show backend message directly in the UI
    const msg = err.response?.data?.message || err.message || 'Email or mobile number does not match our records.';
    errorMessage.value = msg;
    showToast(msg);
  } finally {
    isLoading.value = false;
  }
}

// Step 2: Reset Password
async function handleResetPassword() {
  errorMessage.value = '';
  successMessage.value = '';
  fieldErrors.value = {};

  // Basic validation
  if (!otp.value || !newPassword.value) {
    errorMessage.value = 'Please enter the OTP and a new password.';
    showToast(errorMessage.value);
    return;
  }
  if (!/^\d{6}$/.test(otp.value.trim())) {
    errorMessage.value = 'OTP must be exactly 6 digits.';
    showToast(errorMessage.value);
    return;
  }
  if (newPassword.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.';
    showToast(errorMessage.value);
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    showToast(errorMessage.value);
    return;
  }

  isLoading.value = true;
  try {
    const { data } = await AuthService.resetPassword({
      email: email.value.trim().toLowerCase(),
      otp: otp.value.trim(),
      newPassword: newPassword.value
    });

    successMessage.value = data?.message || 'Password reset successfully! Redirecting to login...';
    isSuccess.value = true;
    showToast(successMessage.value, 'success');

    // Reset complete -> redirect to Login page after 2 seconds
    setTimeout(() => {
      router.push(loginLink.value);
    }, 2000);
  } catch (err) {
    // Check for backend field-level validation errors (HTTP 400 with fieldErrors map)
    const backendFieldErrors = err.fieldErrors || err.response?.data?.fieldErrors;
    if (backendFieldErrors && typeof backendFieldErrors === 'object' && Object.keys(backendFieldErrors).length > 0) {
      fieldErrors.value = { ...backendFieldErrors };
    }

    // Handles 400 Bad Request (e.g., "Invalid OTP. 4 attempts remaining", "OTP has expired")
    const msg = err.response?.data?.message || err.message || 'Failed to reset password.';
    errorMessage.value = msg;
    showToast(msg);
  } finally {
    isLoading.value = false;
  }
}

// Resend OTP Helper
async function handleResendOtp() {
  if (resendCooldown.value > 0) return;
  await handleRequestOtp();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Animations */
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Toast Transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
</style>
