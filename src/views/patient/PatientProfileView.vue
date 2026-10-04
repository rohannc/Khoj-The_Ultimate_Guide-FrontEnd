<template>
  <div class="max-w-7xl mx-auto w-full animate-fade-in font-sans pb-20">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between mb-8 md:mb-12">
      <div>
        <button @click="router.push('/dashboard/patient')" class="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2 mb-4">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Dashboard
        </button>
        <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
        <p class="text-slate-500 mt-3 text-base md:text-lg">Manage your personal information and contact details.</p>
      </div>
      <div v-if="!isLoading" class="hidden md:block">
        <button @click="toggleEdit" class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Edit Profile
        </button>
      </div>
    </div>

    <!-- Toast Popup Message -->
    <Transition name="toast-fade">
      <div v-if="message.text" :class="`fixed top-6 right-6 z-[100] max-w-md p-4 rounded-2xl flex items-start gap-3 shadow-2xl transition-all ${message.type === 'error' ? 'bg-white text-red-800 border-l-4 border-l-red-500' : 'bg-white text-emerald-800 border-l-4 border-l-emerald-500'}`">
        <svg v-if="message.type === 'success'" class="w-6 h-6 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <svg v-else class="w-6 h-6 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div class="flex-grow">
          <h4 class="font-bold text-base text-slate-800">{{ message.type === 'success' ? 'Success' : 'Error' }}</h4>
          <p class="text-sm mt-1 text-slate-600 font-medium">{{ message.text }}</p>
        </div>
        <button @click="message.text = ''" class="shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </Transition>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="animate-pulse space-y-8">
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6">
        <div class="w-24 h-24 bg-slate-200 rounded-full"></div>
        <div class="space-y-3">
          <div class="h-6 w-48 bg-slate-200 rounded-lg"></div>
          <div class="h-4 w-32 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 h-[750px]">
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full"></div>
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full"></div>
      </div>
    </div>

    <div v-else class="space-y-8">
      
      <!-- Profile Summary Card -->
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 md:gap-10 relative overflow-hidden">
        <!-- Background Decoration -->
        <div class="absolute top-0 right-0 w-72 h-72 bg-indigo-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-80 pointer-events-none"></div>
        
        <div class="w-28 h-28 md:w-36 md:h-36 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-500/30 relative z-10">
          {{ formData.firstName?.charAt(0) || 'P' }}{{ formData.lastName?.charAt(0) || '' }}
        </div>
        
        <div class="text-center md:text-left relative z-10 flex-1">
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{{ formData.firstName || 'Patient' }} {{ formData.lastName || '' }}</h2>
          <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center md:justify-start">
            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-full">
              <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
              </svg>
              {{ formData.username || authStore.user?.username || 'patient' }}
            </span>
            <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full border border-emerald-100">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Active Profile
            </span>
          </div>
        </div>
      </div>

      <!-- Main Dual Column Layout (Fixed Height on Large Screens) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[750px]">
        
        <!-- Left Column -->
        <div class="flex flex-col gap-8 h-full">
          <!-- Personal Details -->
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col flex-1 overflow-hidden">
            <div class="flex items-center justify-between mb-8 border-b border-slate-100 pb-6 shrink-0">
              <h3 class="text-xl font-extrabold text-slate-900">Personal Details</h3>
              <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
            </div>
            
            <!-- Scrollable Content Area -->
            <div class="overflow-y-auto flex-1 pr-4 custom-scrollbar space-y-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">First Name</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.firstName || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Last Name</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.lastName || '-' }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Date of Birth</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.dateOfBirth || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Gender</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.gender || '-' }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Blood Group</label>
                <div v-if="formData.bloodGroup && formData.bloodGroup !== '-'" class="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 font-black shadow-sm mt-1">
                  {{ formData.bloodGroup }}
                </div>
                <p v-else class="text-lg font-bold text-slate-900 py-1">-</p>
              </div>
            </div>
          </div>
          
          <!-- Account Security -->
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 shrink-0">
            <div class="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
              <h3 class="text-xl font-extrabold text-slate-900">Account Security</h3>
              <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 class="text-base font-bold text-slate-900">Change Username</h4>
                  <p class="text-sm text-slate-500 mt-1">Search for an available username and update.</p>
                </div>
                <button type="button" @click="changeUsername" class="shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                  </svg>
                  Update Username
                </button>
              </div>
              <div class="w-full h-px bg-slate-100"></div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 class="text-base font-bold text-slate-900">Password</h4>
                  <p class="text-sm text-slate-500 mt-1">Update your password to keep your account secure.</p>
                </div>
                <button type="button" @click="changePassword" class="shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all text-sm flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-8 h-full">
          
          <!-- Contact Info -->
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 shrink-0">
            <div class="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
              <h3 class="text-xl font-extrabold text-slate-900">Contact Info</h3>
              <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
            </div>
            
            <div class="space-y-8">
              <div>
                <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Email Address</label>
                <p class="text-lg font-bold text-slate-900 py-1 break-all">{{ formData.emailId || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Mobile Number</label>
                <p class="text-lg font-bold text-slate-900 py-1">{{ formData.primaryMobile || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col flex-1 overflow-hidden">
            <div class="flex items-center justify-between mb-8 border-b border-slate-100 pb-6 shrink-0">
              <h3 class="text-xl font-extrabold text-slate-900">Address</h3>
              <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
            </div>

            <!-- Scrollable Content Area -->
            <div class="overflow-y-auto flex-1 pr-4 custom-scrollbar space-y-8">
              <div>
                <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Street</label>
                <p class="text-lg font-bold text-slate-900 py-1">{{ formData.street || '-' }}</p>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">City</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.city || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">State</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.state || '-' }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">PIN Code</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.pinCode || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-bold tracking-wide text-slate-500 mb-2 uppercase">Country</label>
                  <p class="text-lg font-bold text-slate-900 py-1">{{ formData.country || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Edit Button -->
        <div class="md:hidden col-span-1 mt-6">
          <button @click="toggleEdit" class="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-sm flex justify-center items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- MODAL FOR EDITING PROFILE -->
  <Teleport to="body">
    <div v-if="isEditing" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-[5vh] lg:p-[10vh]">
      <!-- Blurred Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="cancelEdit"></div>
      
      <!-- Modal Container -->
      <div class="relative w-full h-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-fade-in-up border border-slate-200/50">
        
        <!-- Modal Header -->
        <div class="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Edit Profile</h2>
            <p class="text-sm text-slate-500 mt-1 hidden sm:block">Update your personal information and contact details.</p>
          </div>
          <button @click="cancelEdit" class="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <!-- Modal Body (Scrollable) -->
        <div class="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 relative">
          <form @submit.prevent="saveProfile" id="editProfileForm" class="max-w-4xl mx-auto space-y-12 pb-4">
            
            <!-- Section: Personal Info -->
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                Personal Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
                <div>
                  <label class="block text-sm font-bold text-slate-600 mb-2">First Name</label>
                  <input v-model="formData.firstName" required class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-600 mb-2">Last Name</label>
                  <input v-model="formData.lastName" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                </div>
                <div class="relative" ref="calendarRef">
                  <label class="block text-sm font-bold text-slate-600 mb-2">Date of Birth</label>
                  <div class="relative">
                    <button type="button" @click="isDobCalendarVisible = !isDobCalendarVisible" class="w-full text-left pl-4 pr-10 py-3 bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 rounded-xl transition-all font-semibold shadow-sm text-base cursor-pointer hover:border-indigo-300 flex items-center justify-between" :class="formData.dateOfBirth ? 'text-slate-700' : 'text-slate-400'">
                      <span>{{ formattedSelectedDob }}</span>
                      <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                  </div>

                  <!-- Calendar Dropdown -->
                  <div v-if="isDobCalendarVisible" class="calendar-container shadow-xl">
                    <div class="calendar-header">
                      <button type="button" @click.stop.prevent="prevDobMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:border-transparent">
                        <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <div class="month-year-selects">
                        <div class="custom-calendar-dropdown">
                          <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleCalendarDropdown('month')">
                            <span>{{ selectedMonthName }}</span>
                            <svg :class="{ active: monthDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                          <ul v-if="monthDropdownVisible" class="calendar-dropdown-menu shadow-lg">
                            <li v-for="(month, index) in months" :key="month" @click.stop.prevent="selectMonth(index)" :class="{ 'disabled-month': isMonthDisabled(index) }">{{ month }}</li>
                          </ul>
                        </div>
                        <div class="custom-calendar-dropdown">
                          <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleCalendarDropdown('year')">
                            <span>{{ dobCurrentYear }}</span>
                            <svg :class="{ active: yearDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                          </button>
                          <ul v-if="yearDropdownVisible" class="calendar-dropdown-menu shadow-lg">
                            <li v-for="year in years" :key="year" @click.stop.prevent="selectYear(year)">{{ year }}</li>
                          </ul>
                        </div>
                      </div>
                      <button type="button" @click.stop.prevent="nextDobMonth" :disabled="isNextMonthDisabled" :class="{ 'opacity-30 cursor-not-allowed': isNextMonthDisabled }" class="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:border-transparent">
                        <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                    <div class="calendar-grid">
                      <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                      <div class="day-cell" v-for="(day, index) in dobCalendarDays" :key="index"
                        :class="{ 'other-month': !day.isCurrentMonth, 'selected': day.isSelected, 'today': day.isToday, 'disabled-future': day.isFuture }" @click.stop.prevent="!day.isFuture && selectDob(day)">
                        {{ day.dayNumber }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Custom Gender Dropdown -->
                <div class="custom-select-container relative">
                  <label class="block text-sm font-bold text-slate-600 mb-2">Gender</label>
                  <div @click="toggleDropdown('gender')" class="w-full bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 rounded-xl pl-4 pr-10 py-3 text-base font-semibold text-slate-700 transition-all shadow-sm cursor-pointer hover:border-indigo-300 flex items-center justify-between">
                    <span>{{ formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase() : 'Select Gender' }}</span>
                    <svg :class="['w-5 h-5 text-slate-400 transition-transform duration-200', dropdowns.gender ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  <!-- Dropdown List -->
                  <div v-if="dropdowns.gender" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up">
                    <div class="max-h-[188px] overflow-y-auto p-1.5 space-y-1">
                      <div @click="selectOption('gender', 'Male')" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', formData.gender === 'Male' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">Male</div>
                      <div @click="selectOption('gender', 'Female')" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', formData.gender === 'Female' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">Female</div>
                      <div @click="selectOption('gender', 'Other')" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', formData.gender === 'Other' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">Other</div>
                    </div>
                  </div>
                </div>

                <!-- Custom Blood Group Dropdown -->
                <div class="sm:col-span-2 md:col-span-1 custom-select-container relative">
                  <label class="block text-sm font-bold text-slate-600 mb-2">Blood Group</label>
                  <div @click="toggleDropdown('bloodGroup')" class="w-full bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 rounded-xl pl-4 pr-10 py-3 text-base font-semibold text-slate-700 transition-all shadow-sm cursor-pointer hover:border-indigo-300 flex items-center justify-between">
                    <span v-if="formData.bloodGroup" class="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md border border-rose-100 font-black shadow-sm">{{ formData.bloodGroup }}</span>
                    <span v-else class="text-slate-400">Select Blood Group</span>
                    <svg :class="['w-5 h-5 text-slate-400 transition-transform duration-200', dropdowns.bloodGroup ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  <!-- Dropdown List -->
                  <div v-if="dropdowns.bloodGroup" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up">
                    <div class="max-h-[188px] overflow-y-auto p-1.5 space-y-1">
                      <template v-for="bg in ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-']" :key="bg">
                        <div @click="selectOption('bloodGroup', bg)" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', formData.bloodGroup === bg ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">{{ bg }}</div>
                      
  <!-- Update Username Modal -->
  <Teleport to="body">
    <div v-if="isEditingUsername" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-[5vh] lg:p-[10vh]">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeUsernameModal"></div>
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-fade-in-up border border-slate-200/50">
        <div class="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Update Username</h2>
            <p class="text-sm text-slate-500 mt-1 hidden sm:block">Choose a new unique username for your account.</p>
          </div>
          <button @click="closeUsernameModal" class="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 relative">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">New Username</label>
              <div class="relative">
                <input v-model="usernameData.newUsername" @input="onUsernameInput" type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 pl-10 shadow-sm" placeholder="e.g. new_username123">
                <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              
              <div class="mt-3 h-6 flex items-center">
                <span v-if="usernameData.checking" class="text-sm text-indigo-600 font-bold flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Checking availability...
                </span>
                <span v-else-if="usernameData.availabilityStatus === 'available'" class="text-sm text-emerald-600 font-bold flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Username is available!
                </span>
                <span v-else-if="usernameData.availabilityStatus === 'taken'" class="text-sm text-rose-600 font-bold flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  Username is already taken.
                </span>
              </div>

              <!-- Refined Luxury SaaS Style Suggestions -->
              <div v-if="usernameData.availabilityStatus === 'taken' && usernameData.suggestions.length > 0" class="mt-6 p-5 bg-white rounded-2xl border border-indigo-100 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <p class="text-xs font-bold tracking-wide text-indigo-600 uppercase mb-4 relative z-10 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  Suggested Available Usernames
                </p>
                <div class="flex flex-wrap gap-2.5 relative z-10">
                  <button v-for="sug in usernameData.suggestions" :key="sug" @click="selectSuggestion(sug)" type="button" class="px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-200 transition-all duration-200">
                    {{ sug }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 md:px-10 py-5 md:py-6 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3 sm:gap-4 bg-white z-10">
          <button type="button" @click="closeUsernameModal" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm transition-all text-sm sm:text-base">
            Cancel
          </button>
          <button type="button" @click="saveUsername" :disabled="isSaving || usernameData.availabilityStatus !== 'available'" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base">
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'Updating...' : 'Update Username' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Update Password Modal -->
  <Teleport to="body">
    <div v-if="isEditingPassword" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-[5vh] lg:p-[10vh]">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closePasswordModal"></div>
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-fade-in-up border border-slate-200/50">
        <div class="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Update Password</h2>
            <p class="text-sm text-slate-500 mt-1 hidden sm:block">Ensure your account is using a long, random password.</p>
          </div>
          <button @click="closePasswordModal" class="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 relative">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
              <input v-model="passwordData.currentPassword" type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 shadow-sm" placeholder="Enter your current password">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <input v-model="passwordData.newPassword" type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 shadow-sm" placeholder="Create a new password">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
              <input v-model="passwordData.confirmPassword" type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 shadow-sm" placeholder="Confirm your new password">
              
              <div v-if="passwordData.confirmPassword" class="mt-2 text-sm font-bold flex items-center gap-1.5" :class="passwordMatch ? 'text-emerald-600' : 'text-rose-600'">
                <svg v-if="passwordMatch" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                {{ passwordMatch ? 'Passwords match' : 'Passwords do not match' }}
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 md:px-10 py-5 md:py-6 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3 sm:gap-4 bg-white z-10">
          <button type="button" @click="closePasswordModal" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm transition-all text-sm sm:text-base">
            Cancel
          </button>
          <button type="button" @click="savePassword" :disabled="isSaving || !passwordMatch || !passwordData.newPassword || !passwordData.currentPassword" class="bg-rose-600 hover:bg-rose-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm shadow-rose-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base">
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

</template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Contact Info -->
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                Contact Details
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-bold text-slate-600 mb-2">Email Address</label>
                  <div class="relative group">
                    <input type="email" v-model="formData.emailId" disabled title="Email address is permanent and cannot be changed" class="w-full bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-inner" />
                  </div>
                </div>
                <div class="sm:col-span-2 md:col-span-1">
                  <label class="block text-sm font-bold text-slate-600 mb-2">Mobile Number</label>
                  <input type="tel" v-model="formData.primaryMobile" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                </div>
              </div>
            </div>

            <!-- Section: Address -->
            <div>
              <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                Address
              </h3>
              <div class="space-y-5 md:space-y-7">
                <div>
                  <label class="block text-sm font-bold text-slate-600 mb-2">Street</label>
                  <input v-model="formData.street" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
                  <div>
                    <label class="block text-sm font-bold text-slate-600 mb-2">City</label>
                    <input v-model="formData.city" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-600 mb-2">State</label>
                    <input v-model="formData.state" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-600 mb-2">PIN Code</label>
                    <input v-model="formData.pinCode" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-600 mb-2">Country</label>
                    <input v-model="formData.country" class="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 md:px-10 py-5 md:py-6 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3 sm:gap-4 bg-white z-10">
          <button @click="cancelEdit" :disabled="isSaving" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm transition-all disabled:opacity-50 text-sm sm:text-base">
            Cancel
          </button>
          <button type="submit" form="editProfileForm" :disabled="isSaving" class="bg-slate-900 text-white hover:bg-slate-800 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 text-sm sm:text-base">
            <svg v-if="isSaving" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>

      </div>
    </div>
  </Teleport>


  <!-- Update Username Modal -->
  <Teleport to="body">
    <div v-if="isEditingUsername" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-[5vh] lg:p-[10vh]">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeUsernameModal"></div>
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-fade-in-up border border-slate-200/50">
        <div class="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Update Username</h2>
            <p class="text-sm text-slate-500 mt-1 hidden sm:block">Choose a new unique username for your account.</p>
          </div>
          <button @click="closeUsernameModal" class="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 relative">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">New Username</label>
              <div class="relative">
                <input v-model="usernameData.newUsername" @input="onUsernameInput" type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 pl-10 shadow-sm" placeholder="e.g. new_username123">
                <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              
              <div class="mt-3 h-6 flex items-center">
                <span v-if="usernameData.checking" class="text-sm text-indigo-600 font-bold flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Checking availability...
                </span>
                <span v-else-if="usernameData.availabilityStatus === 'available'" class="text-sm text-emerald-600 font-bold flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Username is available!
                </span>
                <span v-else-if="usernameData.availabilityStatus === 'taken'" class="text-sm text-rose-600 font-bold flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  Username is already taken.
                </span>
              </div>

              <!-- Refined Luxury SaaS Style Suggestions -->
              <div v-if="usernameData.availabilityStatus === 'taken' && usernameData.suggestions.length > 0" class="mt-6 p-5 bg-white rounded-2xl border border-indigo-100 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <p class="text-xs font-bold tracking-wide text-indigo-600 uppercase mb-4 relative z-10 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  Suggested Available Usernames
                </p>
                <div class="flex flex-wrap gap-2.5 relative z-10">
                  <button v-for="sug in usernameData.suggestions" :key="sug" @click="selectSuggestion(sug)" type="button" class="px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-200 transition-all duration-200">
                    {{ sug }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 md:px-10 py-5 md:py-6 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3 sm:gap-4 bg-white z-10">
          <button type="button" @click="closeUsernameModal" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm transition-all text-sm sm:text-base">
            Cancel
          </button>
          <button type="button" @click="saveUsername" :disabled="isSaving || usernameData.availabilityStatus !== 'available'" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base">
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'Updating...' : 'Update Username' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Update Password Modal -->
  <Teleport to="body">
    <div v-if="isEditingPassword" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-[5vh] lg:p-[10vh]">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closePasswordModal"></div>
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-fade-in-up border border-slate-200/50">
        <div class="px-6 md:px-10 py-5 md:py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Update Password</h2>
            <p class="text-sm text-slate-500 mt-1 hidden sm:block">Ensure your account is using a long, random password.</p>
          </div>
          <button @click="closePasswordModal" class="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/50 relative">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
              <input v-model="passwordData.currentPassword" type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 shadow-sm" placeholder="Enter your current password">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <input v-model="passwordData.newPassword" type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 shadow-sm" placeholder="Create a new password">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
              <input v-model="passwordData.confirmPassword" type="password" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900 shadow-sm" placeholder="Confirm your new password">
              
              <div v-if="passwordData.confirmPassword" class="mt-2 text-sm font-bold flex items-center gap-1.5" :class="passwordMatch ? 'text-emerald-600' : 'text-rose-600'">
                <svg v-if="passwordMatch" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                {{ passwordMatch ? 'Passwords match' : 'Passwords do not match' }}
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 md:px-10 py-5 md:py-6 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3 sm:gap-4 bg-white z-10">
          <button type="button" @click="closePasswordModal" class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm transition-all text-sm sm:text-base">
            Cancel
          </button>
          <button type="button" @click="savePassword" :disabled="isSaving || !passwordMatch || !passwordData.newPassword || !passwordData.currentPassword" class="bg-rose-600 hover:bg-rose-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold shadow-sm shadow-rose-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base">
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isSaving ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { PatientService } from '@/services/patient.service';

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(true);
const isSaving = ref(false);
const isEditing = ref(false);
const message = reactive({ text: '', type: '' });

// Custom dropdown states
const dropdowns = reactive({
  gender: false,
  bloodGroup: false
});

const toggleDropdown = (field) => {
  // Close the other dropdown if open
  Object.keys(dropdowns).forEach(key => {
    if (key !== field) dropdowns[key] = false;
  });
  dropdowns[field] = !dropdowns[field];
};

const selectOption = (field, value) => {
  formData[field] = value;
  dropdowns[field] = false;
};

const closeDropdownsOnOutsideClick = (e) => {
  if (!e.target.closest('.custom-select-container')) {
    dropdowns.gender = false;
    dropdowns.bloodGroup = false;
  }
  if (isDobCalendarVisible.value && calendarRef.value && !calendarRef.value.contains(e.target)) {
    isDobCalendarVisible.value = false;
  }
};

const formData = reactive({
  username: '',
  firstName: '',
  lastName: '',
  emailId: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  primaryMobile: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  country: ''
});

const originalData = ref({});

// --- Dropdown and Calendar Logic ---
const calendarRef = ref(null);
const isDobCalendarVisible = ref(false);
const monthDropdownVisible = ref(false);
const yearDropdownVisible = ref(false);

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [...Array(12).keys()].map(i => new Date(0, i).toLocaleString('default', { month: 'short' }));

const parseDateString = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
};

const dobDate = ref(new Date());
const dobCurrentMonth = ref(new Date().getMonth());
const dobCurrentYear = ref(new Date().getFullYear());

watch(() => formData.dateOfBirth, (newVal) => {
  if (newVal) {
    const d = parseDateString(newVal);
    dobCurrentMonth.value = d.getMonth();
    dobCurrentYear.value = d.getFullYear();
  }
});

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
  if (!formData.dateOfBirth) return 'YYYY-MM-DD';
  return formData.dateOfBirth;
});

const dobCalendarDays = computed(() => {
  const year = dobCurrentYear.value;
  const month = dobCurrentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDateObj = formData.dateOfBirth ? parseDateString(formData.dateOfBirth) : null;
  if(selectedDateObj) selectedDateObj.setHours(0,0,0,0);

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false, isFuture: false, isToday: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    currentDate.setHours(0, 0, 0, 0);
    const isFuture = currentDate > today;
    const isToday = currentDate.getTime() === today.getTime();
    
    const isSelected = selectedDateObj ? selectedDateObj.getTime() === currentDate.getTime() : false;

    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isToday,
      isFuture: isFuture,
      isSelected: isSelected,
      date: currentDate
    });
  }
  return daysArray;
});

const selectDob = (day) => {
  if (!day.isCurrentMonth || day.isFuture) return;
  const offset = day.date.getTimezoneOffset()
  const localDate = new Date(day.date.getTime() - (offset*60*1000))
  formData.dateOfBirth = localDate.toISOString().split('T')[0];
  isDobCalendarVisible.value = false;
};

const prevDobMonth = () => { if (dobCurrentMonth.value === 0) { dobCurrentMonth.value = 11; dobCurrentYear.value--; } else { dobCurrentMonth.value--; } };
const nextDobMonth = () => { 
  if (isNextMonthDisabled.value) return;
  if (dobCurrentMonth.value === 11) { dobCurrentMonth.value = 0; dobCurrentYear.value++; } else { dobCurrentMonth.value++; } 
};

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


const loadProfile = async () => {
  isLoading.value = true;
  message.text = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id;
    const username = authStore.user?.username;
    
    // Safely attempt to load
    const profile = await PatientService.getPatientProfile(patientId, username) || {};
    
    Object.keys(formData).forEach(key => {
      if (profile[key] !== undefined && profile[key] !== null) {
        // Normalize Gender casing if needed so dropdown binds properly
        if (key === 'gender' && profile[key]) {
          formData[key] = profile[key].charAt(0).toUpperCase() + profile[key].slice(1).toLowerCase();
        } else {
          formData[key] = profile[key];
        }
      }
    });
    originalData.value = JSON.parse(JSON.stringify(formData));

  } catch (err) {
    console.error('Failed to load profile:', err);
    message.text = 'Could not load profile details. Please try again.';
    message.type = 'error';
  } finally {
    isLoading.value = false;
  }
};

const toggleEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = originalData.value[key] || '';
  });
  isEditing.value = false;
  message.text = '';
};




// --- Username Modal Logic ---
const isEditingUsername = ref(false);
const usernameData = reactive({
  newUsername: '',
  checking: false,
  availabilityStatus: null, // 'available', 'taken'
  suggestions: []
});
let usernameDebounceTimeout = null;

const changeUsername = () => {
  isEditingUsername.value = true;
  usernameData.newUsername = '';
  usernameData.checking = false;
  usernameData.availabilityStatus = null;
  usernameData.suggestions = [];
};

const closeUsernameModal = () => {
  isEditingUsername.value = false;
};

const onUsernameInput = () => {
  if (usernameDebounceTimeout) clearTimeout(usernameDebounceTimeout);
  usernameData.availabilityStatus = null;
  usernameData.suggestions = [];
  
  if (!usernameData.newUsername || usernameData.newUsername.length < 3) {
    usernameData.checking = false;
    return;
  }
  
  usernameData.checking = true;
  usernameDebounceTimeout = setTimeout(async () => {
    try {
      const res = await PatientService.checkUsernameAvailability(usernameData.newUsername);
      if (res.available) {
        usernameData.availabilityStatus = 'available';
      } else {
        usernameData.availabilityStatus = 'taken';
        usernameData.suggestions = res.suggestions || [];
      }
    } catch (err) {
      console.error('Failed to check username:', err);
      usernameData.availabilityStatus = null;
    } finally {
      usernameData.checking = false;
    }
  }, 500);
};

const selectSuggestion = (sug) => {
  usernameData.newUsername = sug;
  usernameData.availabilityStatus = 'available';
  usernameData.suggestions = [];
};

const saveUsername = async () => {
  if (usernameData.availabilityStatus !== 'available') return;
  isSaving.value = true;
  message.text = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id;
    await PatientService.updatePatientUsername(patientId, usernameData.newUsername);
    message.text = 'Username updated successfully.';
    message.type = 'success';
    
    // Immediately update local state
    authStore.updateUser({
      ...authStore.user,
      username: usernameData.newUsername
    });
    formData.username = usernameData.newUsername;
    
    closeUsernameModal();
  } catch (err) {
    let errorDetail = err.message || 'Failed to update username.';
    if (err.response && err.response.data) {
      if (typeof err.response.data === 'string') {
        errorDetail = err.response.data;
      } else {
        errorDetail = err.response.data.message || errorDetail;
        if (err.response.data.details) {
          errorDetail += ' - ' + (typeof err.response.data.details === 'string' ? err.response.data.details : JSON.stringify(err.response.data.details));
        }
      }
    }
    message.text = errorDetail;
    message.type = 'error';
  } finally {
    isSaving.value = false;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { message.text = ''; }, 5000);
  }
};

// --- Password Modal Logic ---
const isEditingPassword = ref(false);
const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordMatch = computed(() => {
  return passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword;
});

const changePassword = () => {
  isEditingPassword.value = true;
  passwordData.currentPassword = '';
  passwordData.newPassword = '';
  passwordData.confirmPassword = '';
};

const closePasswordModal = () => {
  isEditingPassword.value = false;
};

const savePassword = async () => {
  if (!passwordMatch.value) return;
  isSaving.value = true;
  message.text = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id;
    await PatientService.updatePatientPassword(patientId, passwordData.currentPassword, passwordData.newPassword);
    message.text = 'Password updated successfully.';
    message.type = 'success';
    closePasswordModal();
  } catch (err) {
    let errorDetail = err.message || 'Failed to update password.';
    if (err.response && err.response.data) {
      if (typeof err.response.data === 'string') {
        errorDetail = err.response.data;
      } else {
        errorDetail = err.response.data.message || errorDetail;
        if (err.response.data.details) {
          errorDetail += ' - ' + (typeof err.response.data.details === 'string' ? err.response.data.details : JSON.stringify(err.response.data.details));
        }
      }
    }
    message.text = errorDetail;
    message.type = 'error';
  } finally {
    isSaving.value = false;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { message.text = ''; }, 5000);
  }
};


let toastTimeout = null;

const saveProfile = async () => {
  isSaving.value = true;
  message.text = '';
  if (toastTimeout) clearTimeout(toastTimeout);
  
  try {
    const patientId = authStore.user?.userId || authStore.user?.id;
    const payload = {};
    
    Object.keys(formData).forEach(key => {
      if (key === 'username' || key === 'emailId') return;
      
      let val = formData[key];
      if (val === '') val = null;
      payload[key] = val;
    });
    
    await PatientService.updatePatientProfile(patientId, payload);
    
    message.text = 'Profile updated successfully.';
    message.type = 'success';
    originalData.value = JSON.parse(JSON.stringify(formData));
    
    authStore.updateUser({
      ...authStore.user,
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailId: payload.emailId,
      primaryMobile: payload.primaryMobile
    });
    
  } catch (err) {
    console.error('Failed to update profile:', err);
    let errorDetail = err.message || 'An unexpected error occurred. Please try again later.';
    
    if (err.response && err.response.data) {
      if (typeof err.response.data === 'string') {
        errorDetail = err.response.data;
      } else {
        const data = err.response.data;
        errorDetail = data.message || errorDetail;
        if (data.details) {
          errorDetail += ' - ' + (typeof data.details === 'string' ? data.details : JSON.stringify(data.details));
        } else if (data.errors) {
          errorDetail += ' - ' + JSON.stringify(data.errors);
        }
      }
    }
    
    message.text = errorDetail;
    message.type = 'error';
    
    // Revert form data on error
    Object.keys(formData).forEach(key => {
      formData[key] = originalData.value[key] || '';
    });
  } finally {
    isSaving.value = false;
    isEditing.value = false; // Always close the modal
    
    toastTimeout = setTimeout(() => {
      message.text = '';
    }, 5000);
  }
};

onMounted(() => {
  loadProfile();
  document.addEventListener('click', closeDropdownsOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownsOnOutsideClick);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom Scrollbar for scrollable regions */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* slate-300 */
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; /* slate-400 */
}

/* Calendar Styles (Scaled Down) */
.calendar-container {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
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
  margin-bottom: 12px;
}

.month-year-selects {
  display: flex;
  gap: 8px;
  flex-grow: 1;
  justify-content: center;
  margin: 0 8px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 5px;
}

.calendar-header button:hover {
  background-color: #f1f5f9;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.weekday {
  font-weight: 600;
  color: #94a3b8;
  font-size: 11px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.day-cell {
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin: auto;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.day-cell:not(.other-month):hover {
  background-color: #eff6ff;
  color: #4f46e5;
}

.day-cell.other-month {
  color: #cbd5e1;
  cursor: default;
}

.day-cell.other-month:hover {
  background-color: transparent;
}

.day-cell.selected {
  background-color: #4f46e5;
  color: #fff;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.day-cell.today {
  border: 1px solid #4f46e5;
  color: #4f46e5;
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
  height: 32px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.calendar-dropdown-button:hover {
  border-color: #cbd5e1;
}

.calendar-dropdown-button svg {
  width: 10px;
  height: 10px;
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
  border-radius: 8px;
  z-index: 60;
  list-style: none;
  padding: 4px 0;
  max-height: 160px;
  overflow-y: auto;
}

.calendar-dropdown-menu li {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.calendar-dropdown-menu li:hover:not(.disabled-month) {
  background-color: #eff6ff;
  color: #4f46e5;
}

.calendar-dropdown-menu li.disabled-month {
  opacity: 0.3;
  cursor: not-allowed;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

