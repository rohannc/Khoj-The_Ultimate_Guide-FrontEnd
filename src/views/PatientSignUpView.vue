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
                <input type="text" v-model="patientData.username" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Choose a username">
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
                  <input type="password" v-model="patientData.password" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Password">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Confirm Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input :type="isPasswordVisible ? 'text' : 'password'" v-model="patientData.confirmPassword" required class="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Confirm Password">
                  <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                    <svg v-if="!isPasswordVisible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  </button>
                </div>
              </div>
            </div>
            <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
          </div>

          <!-- Personal Information Section -->
          <div class="space-y-4 pt-4">
            <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Personal Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">First Name</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input type="text" v-model="patientData.firstName" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="John">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Last Name</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input type="text" v-model="patientData.lastName" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="Doe">
                </div>
              </div>
            </div>

              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input type="email" v-model="patientData.email" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="you@example.com">
                </div>
                <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
              </div>

              <!-- Date of Birth (Custom Component) -->
              <div class="space-y-2 relative" ref="calendarRef">
                <label class="block text-sm font-bold text-slate-700">Date of Birth</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <button type="button" @click="isDobCalendarVisible = !isDobCalendarVisible" class="w-full text-left pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium" :class="selectedDob ? 'text-slate-900' : 'text-slate-400'" :style="{ '--tw-ring-color': roleColor }">
                  {{ formattedSelectedDob }}
                </button>
              </div>

              <!-- Calendar Dropdown -->
              <div v-if="isDobCalendarVisible" class="calendar-container shadow-xl">
                <div class="calendar-header">
                  <button type="button" @click.stop.prevent="prevDobMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:border-transparent" :style="{ '--tw-ring-color': roleColor }">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div class="month-year-selects">
                    <div class="custom-calendar-dropdown">
                      <button type="button" class="calendar-dropdown-button" @click="toggleCalendarDropdown('month')">
                        <span>{{ selectedMonthName }}</span>
                        <svg :class="{ active: monthDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      <ul v-if="monthDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                        <li v-for="(month, index) in months" :key="month" @click="selectMonth(index)" :class="{ 'disabled-month': isMonthDisabled(index) }">{{ month }}</li>
                      </ul>
                    </div>
                    <div class="custom-calendar-dropdown">
                      <button type="button" class="calendar-dropdown-button" @click="toggleCalendarDropdown('year')">
                        <span>{{ dobCurrentYear }}</span>
                        <svg :class="{ active: yearDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      <ul v-if="yearDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                        <li v-for="year in years" :key="year" @click="selectYear(year)">{{ year }}</li>
                      </ul>
                    </div>
                  </div>
                  <button type="button" @click.stop.prevent="nextDobMonth" :disabled="isNextMonthDisabled" :class="{ 'opacity-30 cursor-not-allowed': isNextMonthDisabled }" class="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:border-transparent" :style="{ '--tw-ring-color': roleColor }">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div class="calendar-grid">
                  <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                  <div class="day-cell" v-for="(day, index) in dobCalendarDays" :key="index"
                    :class="{ 'other-month': !day.isCurrentMonth, 'selected': day.isSelected, 'today': day.isToday, 'disabled-future': day.isFuture }" @click="!day.isFuture && selectDob(day)">
                    {{ day.dayNumber }}
                  </div>
                </div>
              </div>
            </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Gender -->
              <div class="space-y-2 relative" ref="genderRef">
                <label class="block text-sm font-bold text-slate-700">Gender</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <button type="button" @click="toggleDropdown('gender')" class="w-full flex justify-between items-center pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium" :class="[selectedGender === 'Select Gender' ? 'text-slate-400' : 'text-slate-900', { 'ring-2 border-transparent': genderDropdownVisible }]" :style="{ '--tw-ring-color': roleColor }">
                    <span>{{ selectedGender }}</span>
                    <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': genderDropdownVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <ul v-if="genderDropdownVisible" class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    <li v-for="gender in genderOptions" :key="gender" @click="selectGender(gender)" class="px-4 py-3 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 transition-colors">{{ gender }}</li>
                  </ul>
                </div>
              </div>

              <!-- Blood Group -->
              <div class="space-y-2 relative" ref="bloodGroupRef">
                <label class="block text-sm font-bold text-slate-700">Blood Group</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <button type="button" @click="toggleDropdown('bloodGroup')" class="w-full flex justify-between items-center pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium" :class="[selectedBloodGroup === 'Blood Group' ? 'text-slate-400' : 'text-slate-900', { 'ring-2 border-transparent': bloodGroupDropdownVisible }]" :style="{ '--tw-ring-color': roleColor }">
                    <span>{{ selectedBloodGroup }}</span>
                    <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': bloodGroupDropdownVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <ul v-if="bloodGroupDropdownVisible" class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    <li v-for="group in bloodGroupOptions" :key="group" @click="selectBloodGroup(group)" class="px-4 py-3 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 transition-colors">{{ group }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="space-y-4 pt-4">
            <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Contact Information</h3>
            
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700">Street Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <input type="text" v-model="patientData.street" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="123 Main St">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">City</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="patientData.city" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold shadow-sm" :style="{ '--tw-ring-color': roleColor }" placeholder="City">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">State</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="patientData.state" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="State">
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
                  <input type="text" v-model="patientData.pincode" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Pincode">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Country</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input type="text" v-model="patientData.country" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Country">
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
                  <input type="tel" v-model="patientData.primaryPhone" required class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Phone">
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700">Secondary Phone</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <input type="tel" v-model="patientData.secondaryPhone" class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-slate-400 font-medium" :style="{ '--tw-ring-color': roleColor }" placeholder="Optional">
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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
const currentRoleFormatted = 'Patient';
const loginLink = '/login/patient';
const roleIcon = `<div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
const roleColor = '#2563EB';
const roleShadow = 'rgba(37, 99, 235, 0.08)';

// --- Form Data ---
const patientData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  primaryPhone: '',
  secondaryPhone: '',
});

// --- Field-specific Validation State ---
const passwordError = ref('');
const usernameError = ref('');
const emailError = ref('');
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// --- Dropdown and Calendar Logic ---
const genderDropdownVisible = ref(false);
const bloodGroupDropdownVisible = ref(false);
const selectedGender = ref('Select Gender');
const selectedBloodGroup = ref('Blood Group');

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isDobCalendarVisible = ref(false);
const selectedDob = ref(null);
const dobDate = new Date();
const dobCurrentMonth = ref(dobDate.getMonth());
const dobCurrentYear = ref(dobDate.getFullYear());
const monthDropdownVisible = ref(false);
const yearDropdownVisible = ref(false);

const months = [...Array(12).keys()].map(i => new Date(0, i).toLocaleString('default', { month: 'long' }));

const years = computed(() => {
  const startYear = new Date().getFullYear() - 100;
  const endYear = new Date().getFullYear();
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
});

const selectedMonthName = computed(() => months[dobCurrentMonth.value]);

const isNextMonthDisabled = computed(() => {
  const today = new Date();
  return dobCurrentYear.value === today.getFullYear() && dobCurrentMonth.value >= today.getMonth();
});

const formattedSelectedDob = computed(() => {
  if (!selectedDob.value) return 'Select Date of Birth';
  return selectedDob.value.toLocaleDateString();
});

const dobCalendarDays = computed(() => {
  const year = dobCurrentYear.value;
  const month = dobCurrentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false, isFuture: false, isToday: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    currentDate.setHours(0, 0, 0, 0);
    const isFuture = currentDate > today;
    const isToday = currentDate.getTime() === today.getTime();

    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isToday,
      isFuture: isFuture,
      isSelected: selectedDob.value ? selectedDob.value.toDateString() === currentDate.toDateString() : false,
      date: currentDate
    });
  }
  return daysArray;
});

const selectDob = (day) => {
  if (!day.isCurrentMonth || day.isFuture) return;
  selectedDob.value = day.date;
  isDobCalendarVisible.value = false;
};

const prevDobMonth = () => { if (dobCurrentMonth.value === 0) { dobCurrentMonth.value = 11; dobCurrentYear.value--; } else { dobCurrentMonth.value--; } };
const nextDobMonth = () => { 
  if (isNextMonthDisabled.value) return;
  if (dobCurrentMonth.value === 11) { dobCurrentMonth.value = 0; dobCurrentYear.value++; } else { dobCurrentMonth.value++; } 
};
const toggleDropdown = (type) => { if (type === 'gender') { genderDropdownVisible.value = !genderDropdownVisible.value; bloodGroupDropdownVisible.value = false; } else if (type === 'bloodGroup') { bloodGroupDropdownVisible.value = !bloodGroupDropdownVisible.value; genderDropdownVisible.value = false; } };
const selectGender = (gender) => { selectedGender.value = gender; genderDropdownVisible.value = false; };
const selectBloodGroup = (group) => { selectedBloodGroup.value = group; bloodGroupDropdownVisible.value = false; };
const toggleCalendarDropdown = (type) => { if (type === 'month') { monthDropdownVisible.value = !monthDropdownVisible.value; yearDropdownVisible.value = false; } else if (type === 'year') { yearDropdownVisible.value = !yearDropdownVisible.value; monthDropdownVisible.value = false; } };
const selectMonth = (monthIndex) => { 
  if (isMonthDisabled(monthIndex)) return;
  dobCurrentMonth.value = monthIndex; 
  monthDropdownVisible.value = false; 
};

const isMonthDisabled = (monthIndex) => {
  const today = new Date();
  return dobCurrentYear.value === today.getFullYear() && monthIndex > today.getMonth();
};
const selectYear = (year) => { 
  dobCurrentYear.value = year; 
  const today = new Date();
  if (year === today.getFullYear() && dobCurrentMonth.value > today.getMonth()) {
    dobCurrentMonth.value = today.getMonth();
  }
  yearDropdownVisible.value = false; 
};

// --- Click Outside Logic ---
const calendarRef = ref(null);
const genderRef = ref(null);
const bloodGroupRef = ref(null);

const closeDropdownsOnClickOutside = (event) => {
  if (isDobCalendarVisible.value && calendarRef.value && !calendarRef.value.contains(event.target)) {
    isDobCalendarVisible.value = false;
  }
  if (genderDropdownVisible.value && genderRef.value && !genderRef.value.contains(event.target)) {
    genderDropdownVisible.value = false;
  }
  if (bloodGroupDropdownVisible.value && bloodGroupRef.value && !bloodGroupRef.value.contains(event.target)) {
    bloodGroupDropdownVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdownsOnClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownsOnClickOutside);
});

// --- Main Form Submission Logic ---
const handleSignup = async () => {
  passwordError.value = '';
  usernameError.value = '';
  emailError.value = '';
  signupError.value = '';

  if (patientData.value.password !== patientData.value.confirmPassword) {
    passwordError.value = 'Passwords do not match.';
    return;
  }

  isLoading.value = true;
  isSuccess.value = false;

  const phoneNumbers = [];
  if (patientData.value.primaryPhone) phoneNumbers.push({ number: patientData.value.primaryPhone });
  if (patientData.value.secondaryPhone) phoneNumbers.push({ number: patientData.value.secondaryPhone });

  const formData = {
    username: patientData.value.username,
    password: patientData.value.password,
    emailId: patientData.value.email,
    firstName: patientData.value.firstName,
    lastName: patientData.value.lastName,
    dateOfBirth: selectedDob.value ? selectedDob.value.toISOString().split('T')[0] : null,
    gender: selectedGender.value === 'Select Gender' ? null : selectedGender.value,
    street: patientData.value.street,
    city: patientData.value.city,
    state: patientData.value.state,
    pinCode: patientData.value.pincode,
    country: patientData.value.country,
    phoneNumbers: phoneNumbers,
    bloodGroup: selectedBloodGroup.value === 'Blood Group' ? null : selectedBloodGroup.value,
  };

  const apiCall = AuthService.registerPatient(formData);
  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const [authResult] = await Promise.all([apiCall, minLoadingTime]);
    const result = authResult.data;

    isLoading.value = false;
    isSuccess.value = true;

    const accessToken = result.accessToken || result.token;
    const refreshToken = result.refreshToken || null;

    const userToStore = {
      username: result.username,
      role: result.userType?.toLowerCase() || 'patient',
      userId: result.userId
    };

    authStore.login(userToStore, accessToken, refreshToken);

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
  [() => patientData.value.password, () => patientData.value.confirmPassword],
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

watch(() => patientData.value.email, (newVal) => {
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

/* Calendar Styles preserved */
.calendar-container {
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  padding: 15px;
  margin-top: 10px;
  background-color: #fff;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 50;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.month-year-selects {
  display: flex;
  gap: 10px;
  flex-grow: 1;
  justify-content: center;
  margin: 0 10px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.calendar-header button:hover {
  background-color: #f1f5f9;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
}

.weekday {
  font-weight: 500;
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 5px;
}

.day-cell {
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  margin: auto;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.day-cell:not(.other-month):hover {
  background-color: #eff6ff;
  color: #2563EB;
}

.day-cell.other-month {
  color: #cbd5e1;
  cursor: default;
}

.day-cell.other-month:hover {
  background-color: transparent;
}

.day-cell.selected {
  background-color: #2563EB;
  color: #fff;
}

.day-cell.today {
  border: 1px solid #2563EB;
  color: #2563EB;
}

.day-cell.disabled-future {
  color: #cbd5e1;
  cursor: not-allowed;
}

.day-cell.disabled-future:hover {
  background-color: transparent;
  color: #cbd5e1;
}

.custom-calendar-dropdown {
  position: relative;
  flex-grow: 1;
}

.calendar-dropdown-button {
  width: 100%;
  height: 40px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.calendar-dropdown-button svg {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.calendar-dropdown-button svg.active {
  transform: rotate(180deg);
}

.calendar-dropdown-menu {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  z-index: 20;
  list-style: none;
  padding: 5px 0;
  max-height: 200px;
  overflow-y: auto;
}

.calendar-dropdown-menu li {
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.calendar-dropdown-menu li:hover:not(.disabled-month) {
  background-color: #eff6ff;
  color: #2563EB;
}

.calendar-dropdown-menu li.disabled-month {
  opacity: 0.3;
  cursor: not-allowed;
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
