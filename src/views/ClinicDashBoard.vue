<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Greeting & Live Status Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
      <div>
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100/80 text-indigo-800 border border-indigo-200/60">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Facility Management
          </span>
          <span v-if="clinicProfile?.city" class="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ $formatAddress(clinicProfile) }}
          </span>
          <span 
            v-if="!isLoading" 
            class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider"
            :class="dataSource === 'Live API' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
          >
            {{ dataSource }}
          </span>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
          {{ greeting }}, <span class="text-indigo-600">{{ clinicProfile?.name || 'Healthcare Facility' }}</span>
        </h1>
        <p class="text-slate-500 mt-1 font-medium text-sm sm:text-base flex items-center gap-2 flex-wrap">
          <span>{{ clinicProfile?.emailId || clinicProfile?.username || 'clinic@khojhealth.com' }}</span>
          <span v-if="clinicProfile?.phoneNumbers?.length" class="text-slate-300">&bull;</span>
          <span v-if="clinicProfile?.phoneNumbers?.length" class="text-slate-600 font-semibold">
            {{ formatPhone(clinicProfile.phoneNumbers[0]) }}
          </span>
        </p>
      </div>

      <!-- Quick Actions in Header -->
      <div class="flex items-center gap-3">
        <button
          @click="fetchClinicData"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Error State Banner -->
    <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-semibold">{{ errorMessage }}</span>
      </div>
      <button @click="fetchClinicData" class="text-xs font-bold underline hover:text-rose-900 transition-colors">
        Retry
      </button>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="isLoading" class="flex flex-col gap-6 flex-1">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-32 bg-slate-200/80 animate-pulse rounded-[1.75rem] border border-slate-100"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-96 bg-slate-200/80 animate-pulse rounded-[2rem] border border-slate-100"></div>
        <div class="h-96 bg-slate-200/80 animate-pulse rounded-[2rem] border border-slate-100"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="h-80 bg-slate-200/80 animate-pulse rounded-[2rem] border border-slate-100"></div>
        <div class="h-80 bg-slate-200/80 animate-pulse rounded-[2rem] border border-slate-100"></div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="flex flex-col gap-8 flex-1 animate-fade-in-up">
      
      <!-- Key Operational Metrics Strip (Harmonious Indigo/Emerald/Amber/Blue Palette) -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Today's Visits -->
        <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Visits</span>
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.todayAppointmentsCount }}</div>
          <p class="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            <span>Scheduled for today</span>
          </p>
        </div>

        <!-- Total Patients -->
        <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalPatients }}</div>
          <p class="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>Registered facility patients</span>
          </p>
        </div>

        <!-- Active Doctors -->
        <router-link
          to="/dashboard/clinic/doctors"
          class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all block group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Affiliated Doctors</span>
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.activeDoctorsCount }}</div>
          <p class="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
            <span>Browse directory</span>
          </p>
        </router-link>

        <!-- Pending Affiliations / Requests -->
        <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Affiliations</span>
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.pendingAffiliationsCount }}</div>
          <p class="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <span>Awaiting doctor response</span>
          </p>
        </div>

      </div>

      <!-- Main Operational Split: Left (Queue/Appointments) + Right (Affiliations & Doctors) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Today's Appointments & Queue (Spans 2 cols) -->
        <div class="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>Facility Appointments Queue</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100">
                  {{ filteredAppointments.length }}
                </span>
              </h2>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Real-time consultation lineup across all affiliated doctors</p>
            </div>

            <!-- Date Picker / Filter Stepper -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button 
                  @click="changeDate(-1)" 
                  class="p-1.5 hover:bg-white hover:text-indigo-600 rounded-lg text-slate-500 transition-colors"
                  title="Previous Day"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span class="text-xs font-bold text-slate-700 px-2 min-w-[85px] text-center">
                  {{ isToday(selectedDate) ? 'Today' : formattedSelectedDate }}
                </span>
                <button 
                  @click="changeDate(1)" 
                  class="p-1.5 hover:bg-white hover:text-indigo-600 rounded-lg text-slate-500 transition-colors"
                  title="Next Day"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <!-- Status Filter Custom Dropdown -->
              <div class="relative custom-dropdown" ref="statusDropdownRef">
                <button
                  type="button"
                  class="dropdown-button flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 outline-none hover:border-indigo-300 focus:border-indigo-500 transition-all cursor-pointer min-w-[130px]"
                  :class="{ active: statusDropdownOpen }"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  <span class="truncate">{{ statusFilterLabel }}</span>
                  <svg
                    class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0"
                    :class="{ 'rotate-180 text-indigo-600': statusDropdownOpen }"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <ul
                  v-if="statusDropdownOpen"
                  class="dropdown-menu absolute right-0 top-[108%] w-full bg-white border border-slate-200/90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)] z-50 py-1.5 list-none overflow-y-auto max-h-[220px] custom-dropdown-scrollbar animate-in fade-in zoom-in-95 duration-150"
                >
                  <li
                    v-for="opt in statusOptions"
                    :key="opt.value"
                    @click="statusFilter = opt.value; statusDropdownOpen = false"
                    class="px-4 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between"
                    :class="statusFilter === opt.value ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-slate-50 hover:text-indigo-600'"
                  >
                    <span>{{ opt.label }}</span>
                    <svg v-if="statusFilter === opt.value" class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Appointments List Table / Cards -->
          <div v-if="filteredAppointments.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-3">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="font-bold text-slate-600">No appointments found</p>
            <p class="text-xs text-slate-400 mt-1">There are no consultations scheduled on {{ formattedSelectedDate }} matching your filter.</p>
          </div>

          <div v-else class="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            <div 
              v-for="apt in filteredAppointments" 
              :key="apt.id"
              class="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/70 hover:border-indigo-200 transition-all gap-3"
            >
              <!-- Left token & patient info -->
              <div class="flex items-center gap-3.5">
                <!-- Pure Numeric Token Badge (matching Doctor Queue format) -->
                <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center font-black group-hover:border-indigo-300 transition-colors">
                  <span class="text-[9px] uppercase tracking-tighter text-slate-400 font-extrabold leading-none">Token</span>
                  <span class="text-lg text-indigo-600 leading-none mt-0.5">{{ apt.tokenNumber ?? '-' }}</span>
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-bold text-slate-800">{{ apt.patientFullName || 'Patient' }}</h3>
                    <span 
                      class="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase"
                      :class="getStatusBadgeClass(apt.status)"
                    >
                      {{ apt.status || 'SCHEDULED' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span class="font-semibold text-indigo-700">Dr. {{ apt.doctorFullName || 'Physician' }}</span>
                    <span v-if="apt.doctorSpecialization?.length" class="text-slate-300">&bull;</span>
                    <span v-if="apt.doctorSpecialization?.length" class="text-slate-500">
                      {{ apt.doctorSpecialization.join(', ') }}
                    </span>
                  </p>
                  <p v-if="apt.reason" class="text-[11px] text-slate-400 mt-1 italic line-clamp-1">
                    "{{ apt.reason }}"
                  </p>
                </div>
              </div>

              <!-- Right time & action controls -->
              <div class="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div class="text-right">
                  <span class="text-xs font-extrabold text-slate-700 block">
                    {{ formatTime(apt.appointmentTime) }}
                  </span>
                  <span class="text-[10px] font-medium text-slate-400">
                    {{ apt.appointmentDate || 'Today' }}
                  </span>
                </div>

                <!-- Update Status Dropdown / Action -->
                <div class="relative group/status">
                  <button 
                    @click="promptUpdateAppointment(apt)"
                    class="p-2 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors shadow-sm"
                    title="Update Status / Token"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: Doctor Affiliations & Requests (Spans 1 col) -->
        <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
          
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-lg font-bold text-slate-800">Affiliated Doctors</h2>
              <p class="text-xs text-slate-400 font-medium">Practice contracts & schedules</p>
            </div>
            <div class="flex items-center gap-2">
              <router-link
                to="/dashboard/clinic/doctors"
                class="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                View All
              </router-link>
            </div>
          </div>

          <!-- Pending Affiliations Section (if any require clinic action) -->
          <div v-if="pendingAffiliations.length > 0" class="mb-5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Action Required ({{ pendingAffiliations.length }})
              </span>
            </div>

            <div class="space-y-2">
              <div 
                v-for="aff in pendingAffiliations" 
                :key="aff.affiliationId"
                class="p-2.5 rounded-xl bg-white border border-amber-100 shadow-sm flex flex-col gap-2"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">Dr. {{ aff.doctorName || 'Practitioner' }}</h4>
                    <span class="text-[10px] text-slate-500 font-medium">
                      Fee: ₹{{ aff.doctorCharge || aff.clinicCharge || 0 }} &bull; Max: {{ aff.patientLimits || 20 }} pts
                    </span>
                  </div>
                  <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    PENDING
                  </span>
                </div>

                <div class="flex items-center gap-2 mt-1">
                  <button 
                    @click="handleAffiliationResponse(aff, 'ACCEPT')" 
                    class="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Accept
                  </button>
                  <button 
                    @click="handleAffiliationResponse(aff, 'REJECT')" 
                    class="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Affiliations List -->
          <div v-if="activeAffiliations.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p class="text-xs font-bold text-slate-600">No active doctors yet</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Invite qualified specialists to practice at your clinic.</p>
          </div>

          <div v-else class="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            <div 
              v-for="aff in activeAffiliations" 
              :key="aff.affiliationId"
              class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {{ (aff.doctorName || 'Dr').replace('Dr. ', '').charAt(0) }}
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Dr. {{ aff.doctorName || 'Physician' }}</h4>
                  <p class="text-[11px] text-slate-500 font-medium">
                    Consultation: ₹{{ aff.clinicCharge || aff.doctorCharge || 0 }}
                  </p>
                  <p class="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    Limit: {{ aff.patientLimits || 25 }} patients/day
                  </p>
                </div>
              </div>

              <div class="text-right">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
                <span class="text-[10px] text-slate-400 block mt-1">
                  Since {{ aff.joiningDate || '2026' }}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom Split: Facility Information & Operating Hours + Patient Roster Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Facility Profile Card (links to full profile page) -->
        <router-link
          to="/dashboard/clinic/profile"
          class="group bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] hover:border-indigo-100 transition-all duration-300 cursor-pointer"
        >
          <div>
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <span>Clinic Profile</span>
              </h3>
              <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Verified
              </span>
            </div>

            <!-- Avatar + Name -->
            <div class="flex items-center gap-4 mb-5">
              <div class="w-16 h-16 shrink-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-200">
                {{ (clinicProfile?.name || 'C').charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="text-base font-extrabold text-slate-900">{{ clinicProfile?.name || 'Your Clinic' }}</h4>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">
                  {{ [clinicProfile?.city, clinicProfile?.state].filter(Boolean).join(', ') || 'Location not set' }}
                </p>
                <p v-if="clinicProfile?.emailId" class="text-xs text-indigo-600 font-semibold mt-0.5">{{ clinicProfile.emailId }}</p>
              </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 font-semibold block mb-0.5">Pin Code</span>
                <p class="font-bold text-slate-800">{{ clinicProfile?.pinCode || 'N/A' }}</p>
              </div>
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 font-semibold block mb-0.5">Website</span>
                <p class="font-bold text-indigo-600 truncate">{{ clinicProfile?.website || 'Not set' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-400 font-medium">ID: <strong class="text-slate-600">{{ clinicProfile?.id?.slice(0, 10) }}...</strong></span>
            <span class="inline-flex items-center gap-1.5 text-indigo-600 font-bold group-hover:gap-2.5 transition-all duration-200">
              View &amp; Edit Profile
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>

        </router-link>

        <!-- Recent Patients Registered at Clinic -->
        <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span>Recent Patient Consultations</span>
            </h3>
            <router-link
              to="/dashboard/clinic/consultations"
              class="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-200 hover:border-indigo-600 transition-all duration-200 group"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 10h16M4 14h10" /></svg>
              View All
              <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </router-link>
          </div>

          <div v-if="recentPatients.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <p class="text-xs font-bold text-slate-600">No patient history recorded yet</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Patients booked through affiliated doctors will appear here.</p>
          </div>

          <div v-else class="flex flex-col gap-1">
            <div class="space-y-2.5 overflow-hidden pr-1" :style="showAllPatients ? '' : 'max-height: 300px'">
              <div 
                v-for="patient in displayedPatients" 
                :key="patient.id || patient.username"
                class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-emerald-50/40 hover:border-emerald-100 transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-emerald-200">
                    {{ (patient.firstName || patient.username || 'P').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-800">
                      {{ patient.firstName ? `${patient.firstName} ${patient.lastName || ''}` : patient.username }}
                    </h4>
                    <p class="text-[10px] text-slate-400">
                      {{ patient.emailId || 'Patient' }} &bull; {{ patient.bloodGroup || 'Blood: O+' }}
                    </p>
                  </div>
                </div>

                <div class="text-right">
                  <span class="text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {{ patient.gender || 'General' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Show More / Show Less toggle -->
            <div v-if="recentPatients.length > 5" class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[10px] text-slate-400 font-medium">
                Showing {{ displayedPatients.length }} of {{ recentPatients.length }} patients
              </span>
              <button
                @click="showAllPatients = !showAllPatients"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-200 hover:border-indigo-600 transition-all duration-200 group"
              >
                <svg
                  class="w-3 h-3 transition-transform duration-300"
                  :class="showAllPatients ? 'rotate-180' : ''"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>
                {{ showAllPatients ? 'Show Less' : `Show More (${recentPatients.length - 5} more)` }}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Modal 1: Invite / Request Doctor Affiliation -->
    <Transition name="fade">
      <div v-if="openAffiliateDoctorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2rem] p-6 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col gap-4 animate-fade-in-up">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">Invite Doctor Affiliation</h3>
                <p class="text-xs text-slate-400">Initiate practice terms with a licensed physician</p>
              </div>
            </div>
            <button @click="openAffiliateDoctorModal = false" class="p-1 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitDoctorAffiliation" class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Doctor UUID or Username</label>
              <input 
                v-model="affiliationForm.targetId" 
                type="text" 
                required 
                placeholder="e.g. 1a2b3c4d-5e6f-..." 
                class="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                <input 
                  v-model.number="affiliationForm.charge" 
                  type="number" 
                  required 
                  min="0"
                  placeholder="500" 
                  class="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Daily Patient Limit</label>
                <input 
                  v-model.number="affiliationForm.patientLimits" 
                  type="number" 
                  required 
                  min="1"
                  max="100"
                  placeholder="30" 
                  class="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Joining / Start Date</label>
              <input 
                v-model="affiliationForm.joiningDate" 
                type="date" 
                required 
                class="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div v-if="affiliationError" class="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100 font-medium">
              {{ affiliationError }}
            </div>

            <div class="flex items-center gap-3 mt-2">
              <button 
                type="button" 
                @click="openAffiliateDoctorModal = false" 
                class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="isSubmittingAffiliation"
                class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {{ isSubmittingAffiliation ? 'Sending Request...' : 'Send Affiliation' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal 2: Edit Clinic Profile Settings -->
    <Transition name="fade">
      <div v-if="openEditProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2rem] p-6 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col gap-4 animate-fade-in-up">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">Update Facility Details</h3>
                <p class="text-xs text-slate-400">Keep clinic directory listing accurate</p>
              </div>
            </div>
            <button @click="openEditProfileModal = false" class="p-1 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitProfileUpdate" class="flex flex-col gap-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Facility Name</label>
              <input 
                v-model="profileForm.name" 
                type="text" 
                required 
                class="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input 
                  v-model="profileForm.street" 
                  type="text" 
                  class="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input 
                  v-model="profileForm.city" 
                  type="text" 
                  class="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input 
                  v-model="profileForm.state" 
                  type="text" 
                  class="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">PIN Code (6 digits)</label>
                <input 
                  v-model="profileForm.pinCode" 
                  type="text" 
                  pattern="\d{6}"
                  maxlength="6"
                  class="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
              <input 
                v-model="profileForm.website" 
                type="text" 
                placeholder="https://myclinic.com"
                class="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div v-if="profileUpdateError" class="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100 font-medium">
              {{ profileUpdateError }}
            </div>

            <div class="flex items-center gap-3 mt-2">
              <button 
                type="button" 
                @click="openEditProfileModal = false" 
                class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="isUpdatingProfile"
                class="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {{ isUpdatingProfile ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal 3: Update Appointment Status / Token -->
    <Transition name="fade">
      <div v-if="selectedAppointmentToUpdate" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col gap-4 animate-fade-in-up">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Update Consultation</h3>
              <p class="text-xs text-slate-400">{{ selectedAppointmentToUpdate.patientFullName }}</p>
            </div>
            <button @click="selectedAppointmentToUpdate = null" class="p-1 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="submitAppointmentUpdate" class="flex flex-col gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Queue Token Number</label>
              <input 
                v-model.number="appointmentUpdateForm.tokenNumber" 
                type="number" 
                min="1"
                class="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select 
                v-model="appointmentUpdateForm.status"
                class="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div class="flex items-center gap-3 mt-3">
              <button 
                type="button" 
                @click="selectedAppointmentToUpdate = null" 
                class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="isUpdatingAppointment"
                class="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {{ isUpdatingAppointment ? 'Saving...' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ClinicService } from '@/services/clinic.service';
import { formatDateDDMMYYYY } from '@/utils/date';

const authStore = useAuthStore();

// State
const isLoading = ref(true);
const errorMessage = ref('');
const dataSource = ref('Loading...');
const clinicProfile = ref(null);

const stats = ref({
  todayAppointmentsCount: 0,
  totalPatients: 0,
  activeDoctorsCount: 0,
  pendingAffiliationsCount: 0,
  totalAppointments: 0
});

const todayAppointments = ref([]);
const activeAffiliations = ref([]);
const pendingAffiliations = ref([]);
const recentPatients = ref([]);
const showAllPatients = ref(false);
const displayedPatients = computed(() =>
  showAllPatients.value ? recentPatients.value : recentPatients.value.slice(0, 5)
);

// Filter State
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const statusFilter = ref('ALL');
const statusDropdownOpen = ref(false);
const statusDropdownRef = ref(null);

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const statusFilterLabel = computed(() => statusOptions.find(o => o.value === statusFilter.value)?.label || 'All Status');

// Modals
const openAffiliateDoctorModal = ref(false);
const openEditProfileModal = ref(false);
const selectedAppointmentToUpdate = ref(null);

// Form States
const isSubmittingAffiliation = ref(false);
const affiliationError = ref('');
const affiliationForm = ref({
  targetId: '',
  charge: 500,
  patientLimits: 30,
  joiningDate: new Date().toISOString().split('T')[0]
});

const isUpdatingProfile = ref(false);
const profileUpdateError = ref('');
const profileForm = ref({
  name: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  website: '',
  phoneNumbers: []
});

const isUpdatingAppointment = ref(false);
const appointmentUpdateForm = ref({
  tokenNumber: 1,
  status: 'SCHEDULED'
});

// Default opening hours if object empty
const defaultOpeningHours = computed(() => {
  if (clinicProfile.value?.openingHours && Object.keys(clinicProfile.value.openingHours).length > 0) {
    return clinicProfile.value.openingHours;
  }
  return {
    Monday: '09:00 - 18:00',
    Tuesday: '09:00 - 18:00',
    Wednesday: '09:00 - 18:00',
    Thursday: '09:00 - 18:00',
    Friday: '09:00 - 18:00',
    Saturday: '10:00 - 16:00',
    Sunday: 'Closed'
  };
});

// Dynamic Greeting
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
});

// Date formatting
const isToday = (dateStr) => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return 'Today';
  return formatDateDDMMYYYY(selectedDate.value);
});

const changeDate = (days) => {
  const current = new Date(selectedDate.value);
  current.setDate(current.getDate() + days);
  selectedDate.value = current.toISOString().split('T')[0];
};

// Filtered Appointments
const filteredAppointments = computed(() => {
  return todayAppointments.value.filter(apt => {
    // Filter by date match if available
    if (apt.appointmentDate && apt.appointmentDate !== selectedDate.value) {
      return false;
    }
    // Filter by status
    if (statusFilter.value !== 'ALL' && apt.status !== statusFilter.value) {
      return false;
    }
    return true;
  });
});

const formatTime = (timeObj) => {
  if (!timeObj) return 'Scheduled';
  if (typeof timeObj === 'string') return timeObj;
  if (typeof timeObj === 'object') {
    const hour = timeObj.hour % 12 || 12;
    const minute = String(timeObj.minute || 0).padStart(2, '0');
    const ampm = timeObj.hour >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
  }
  return 'Scheduled';
};

const formatPhone = (phone) => {
  if (!phone) return '';
  if (typeof phone === 'string') return phone;
  if (phone.mobileNumber) return phone.mobileNumber;
  return String(phone);
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
  }
};

// Fetch Clinic Data
const fetchClinicData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  let clinicId = authStore.user?.userId || authStore.user?.id || localStorage.getItem('userId');
  const username = authStore.user?.username;

  try {
    // If no explicit UUID, look up clinic by name or email
    if (!clinicId && username) {
      try {
        const clinicByName = await ClinicService.getClinicByName(username);
        if (clinicByName?.id) {
          clinicId = clinicByName.id;
          localStorage.setItem('userId', clinicId);
          authStore.updateUser({ userId: clinicId, id: clinicId });
        }
      } catch (err) {
        console.warn('Lookup by name failed, checking email...', err);
      }
    }

    if (clinicId) {
      // 1. Fetch live aggregated Clinic Dashboard via /api/clinics/{id}/dashboard
      const dashData = await ClinicService.getClinicDashboard(clinicId);

      if (dashData) {
        dataSource.value = 'Live API';
        clinicProfile.value = dashData.profile || authStore.user;
        stats.value = {
          todayAppointmentsCount: dashData.todayAppointmentsCount ?? (dashData.todayAppointments?.length || 0),
          totalPatients: dashData.totalPatients ?? (dashData.recentPatients?.length || 0),
          activeDoctorsCount: dashData.activeDoctorsCount ?? (dashData.activeAffiliations?.length || 0),
          pendingAffiliationsCount: dashData.pendingAffiliationsCount ?? (dashData.pendingAffiliations?.length || 0),
          totalAppointments: dashData.totalAppointments ?? 0
        };

        todayAppointments.value = dashData.todayAppointments || [];
        activeAffiliations.value = dashData.activeAffiliations || [];
        pendingAffiliations.value = dashData.pendingAffiliations || [];
        recentPatients.value = dashData.recentPatients || [];

        // Pre-fill profile update form
        if (clinicProfile.value) {
          profileForm.value = {
            name: clinicProfile.value.name || '',
            street: clinicProfile.value.street || '',
            city: clinicProfile.value.city || '',
            state: clinicProfile.value.state || '',
            pinCode: clinicProfile.value.pinCode || '',
            website: clinicProfile.value.website || '',
            phoneNumbers: clinicProfile.value.phoneNumbers || []
          };
        }
      }
    } else {
      // Clean Zero State if not yet loaded or unlinked
      dataSource.value = 'Offline';
      populateEmptyClinicState();
    }
  } catch (err) {
    console.warn('Failed to fetch clinic data:', err);
    errorMessage.value = err.response?.data?.message || 'Could not load live clinic dashboard. Showing local state.';
    dataSource.value = 'Offline';
    populateEmptyClinicState();
  } finally {
    isLoading.value = false;
  }
};

const populateEmptyClinicState = () => {
  clinicProfile.value = {
    name: authStore.user?.clinicName || authStore.user?.username || 'Clinic Facility',
    street: authStore.user?.street || '',
    city: authStore.user?.city || '',
    state: authStore.user?.state || '',
    pinCode: authStore.user?.pinCode || '',
    country: authStore.user?.country || 'India',
    emailId: authStore.user?.emailId || authStore.user?.email || '',
    phoneNumbers: authStore.user?.primaryMobile ? [authStore.user.primaryMobile] : [],
    website: authStore.user?.website || ''
  };

  stats.value = {
    todayAppointmentsCount: 0,
    totalPatients: 0,
    activeDoctorsCount: 0,
    pendingAffiliationsCount: 0,
    totalAppointments: 0
  };

  todayAppointments.value = [];
  activeAffiliations.value = [];
  pendingAffiliations.value = [];
  recentPatients.value = [];
};

// Handlers
const handleAffiliationResponse = async (aff, action) => {
  try {
    const statusAction = action === 'APPROVE' || action === 'ACCEPT' ? 'ACCEPT' : action;
    await ClinicService.updateAffiliation({
      affiliationId: aff.affiliationId,
      statusAction: statusAction,
      charge: aff.doctorCharge || aff.clinicCharge || 500,
      patientLimits: aff.patientLimits || 25
    });
    // Remove from pending
    pendingAffiliations.value = pendingAffiliations.value.filter(a => a.affiliationId !== aff.affiliationId);
    if (statusAction === 'ACCEPT') {
      activeAffiliations.value.unshift({ ...aff, status: 'APPROVED' });
      stats.value.activeDoctorsCount++;
    }
    stats.value.pendingAffiliationsCount = Math.max(0, stats.value.pendingAffiliationsCount - 1);
  } catch (err) {
    console.error('Failed to update affiliation:', err);
    alert(err.response?.data?.message || 'Could not update affiliation');
  }
};

const submitDoctorAffiliation = async () => {
  isSubmittingAffiliation.value = true;
  affiliationError.value = '';
  try {
    await ClinicService.createAffiliationRequest({
      targetId: affiliationForm.value.targetId,
      charge: affiliationForm.value.charge,
      patientLimits: affiliationForm.value.patientLimits,
      joiningDate: affiliationForm.value.joiningDate,
      shiftDetails: {
        MONDAY: '09:00 - 17:00',
        TUESDAY: '09:00 - 17:00',
        WEDNESDAY: '09:00 - 17:00',
        THURSDAY: '09:00 - 17:00',
        FRIDAY: '09:00 - 17:00',
        SATURDAY: '10:00 - 14:00',
        SUNDAY: 'OFF'
      }
    });
    openAffiliateDoctorModal.value = false;
    stats.value.pendingAffiliationsCount++;
    alert('Affiliation request dispatched successfully!');
  } catch (err) {
    console.error('Affiliation request error:', err);
    affiliationError.value = err.response?.data?.message || 'Failed to send affiliation request';
  } finally {
    isSubmittingAffiliation.value = false;
  }
};

const submitProfileUpdate = async () => {
  isUpdatingProfile.value = true;
  profileUpdateError.value = '';
  const clinicId = clinicProfile.value?.id || authStore.user?.userId;
  if (!clinicId) {
    profileUpdateError.value = 'Clinic ID not found';
    isUpdatingProfile.value = false;
    return;
  }

  try {
    const updated = await ClinicService.updateClinic(clinicId, profileForm.value);
    clinicProfile.value = { ...clinicProfile.value, ...updated };
    openEditProfileModal.value = false;
  } catch (err) {
    console.error('Profile update error:', err);
    profileUpdateError.value = err.response?.data?.message || 'Failed to update clinic profile';
  } finally {
    isUpdatingProfile.value = false;
  }
};

const promptUpdateAppointment = (apt) => {
  selectedAppointmentToUpdate.value = apt;
  appointmentUpdateForm.value = {
    tokenNumber: apt.tokenNumber || 1,
    status: apt.status || 'SCHEDULED'
  };
};

const submitAppointmentUpdate = async () => {
  if (!selectedAppointmentToUpdate.value) return;
  isUpdatingAppointment.value = true;
  try {
    await ClinicService.updateAppointment(selectedAppointmentToUpdate.value.id, {
      tokenNumber: appointmentUpdateForm.value.tokenNumber,
      status: appointmentUpdateForm.value.status
    });
    // Update local state
    selectedAppointmentToUpdate.value.tokenNumber = appointmentUpdateForm.value.tokenNumber;
    selectedAppointmentToUpdate.value.status = appointmentUpdateForm.value.status;
    selectedAppointmentToUpdate.value = null;
  } catch (err) {
    console.error('Appointment update error:', err);
    alert(err.response?.data?.message || 'Failed to update appointment');
  } finally {
    isUpdatingAppointment.value = false;
  }
};

const handleClickOutside = (e) => {
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(e.target)) {
    statusDropdownOpen.value = false;
  }
};

onMounted(() => {
  fetchClinicData();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

/* Custom Dropdown Styling consistent with DoctorClinicsView */
.custom-dropdown {
  position: relative;
  user-select: none;
}

.dropdown-button {
  white-space: nowrap;
}

.dropdown-button.active {
  border-color: #6366f1;
  background-color: #ffffff;
}

.custom-dropdown-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-dropdown-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 9999px;
  margin: 4px 0;
}

.custom-dropdown-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
  transition: background 0.2s ease;
}

.custom-dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.custom-dropdown-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f8fafc;
}
</style>
