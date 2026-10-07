<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Greeting & Live Status Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100/80 text-indigo-800 border border-indigo-200/60">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Practice Dashboard
          </span>
          <span class="text-xs font-semibold text-slate-400">
            Lic. #{{ doctorProfile?.registrationNumber || 'DOC-REG' }}
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
          {{ greeting }}, <span class="text-indigo-600">Dr. {{ doctorProfile?.lastName || doctorProfile?.firstName || 'Practitioner' }}</span>
        </h1>
        <p class="text-slate-500 mt-1 font-medium text-sm sm:text-base">
          {{ doctorProfile?.specializations || 'Specialist' }} &bull; {{ doctorProfile?.yearsOfExperience || 0 }} Years Experience
        </p>
      </div>

      <!-- Top Header Actions -->
      <div class="flex items-center gap-3">
        <button
          @click="fetchDoctorData"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          title="Refresh Dashboard"
        >
          <svg class="w-4 h-4 text-indigo-500" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
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
      <button @click="fetchDoctorData" class="text-xs font-bold underline hover:text-rose-900 transition-colors">
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
        
        <!-- Today's Appointments -->
        <router-link
          to="/dashboard/doctor/appointments"
          class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all block group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Today's Visits</span>
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.todayAppointmentsCount }}</div>
          <p class="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            <span>Scheduled for today &rarr;</span>
          </p>
        </router-link>

        <!-- Total Patient Count -->
        <router-link
          to="/dashboard/doctor/patients"
          class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all block group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Total Patients</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalPatients }}</div>
          <p class="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>Under your clinical care &rarr;</span>
          </p>
        </router-link>

        <!-- Active Affiliations -->
        <router-link
          to="/dashboard/doctor/affiliations"
          class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all block group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Affiliated Clinics</span>
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.activeAffiliationsCount }}</div>
          <p class="text-xs text-blue-600 font-semibold mt-1">
            {{ stats.pendingAffiliationsCount }} pending &bull; Manage &rarr;
          </p>
        </router-link>

        <!-- Total Prescriptions Issued -->
        <router-link
          to="/dashboard/doctor/prescriptions"
          class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[1.75rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all block group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Prescriptions</span>
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalPrescriptionsIssued }}</div>
          <p class="text-xs text-amber-600 font-semibold mt-1">Issued courses &rarr;</p>
        </router-link>

      </div>

      <!-- Main Two-Column Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Today's Consultation Schedule (2 Cols) -->
        <div class="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 sm:p-7 flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-[1.25rem] bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800 tracking-tight">Today's Appointments Queue</h2>
                <p class="text-xs text-slate-400 font-medium">Real-time consultation list & queue tokens</p>
              </div>
            </div>

            <!-- Upgraded Sleek Calendar Date Filter & View All -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 p-1 rounded-2xl shadow-sm hover:border-indigo-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <button
                  type="button"
                  @click.stop="navigateDate(-1)"
                  class="relative z-10 w-7 h-7 flex items-center justify-center rounded-xl hover:bg-white text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div class="relative flex items-center gap-1.5 px-2 py-0.5">
                  <svg class="w-4 h-4 text-indigo-600 flex-shrink-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs font-bold text-slate-700 min-w-[5rem] text-center select-none pointer-events-none">
                    {{ isTodaySelected ? 'Today' : formattedScheduleDate }}
                  </span>
                  <input
                    v-model="selectedScheduleDate"
                    @change="handleDateChange"
                    type="date"
                    class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-0"
                    title="Choose consultation date"
                  />
                </div>

                <button
                  type="button"
                  @click.stop="navigateDate(1)"
                  class="relative z-10 w-7 h-7 flex items-center justify-center rounded-xl hover:bg-white text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <router-link
                to="/dashboard/doctor/appointments"
                class="hidden sm:inline-flex text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all"
              >
                View All
              </router-link>
            </div>
          </div>

          <!-- Appointments List -->
          <div v-if="todayAppointments.length > 0" class="space-y-3.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
            <div
              v-for="apt in todayAppointments"
              :key="apt.id"
              class="bg-white rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div class="flex items-center gap-3.5">
                <!-- Token badge: Only the number, no 'Token' string -->
                <div class="w-11 h-11 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 font-black flex items-center justify-center transition-all flex-shrink-0 border border-indigo-100/80 shadow-sm text-lg tracking-tight">
                  {{ apt.tokenNumber || '—' }}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {{ apt.patientFullName || 'Patient' }}
                  </h3>
                  <p class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Reason: {{ apt.reason || 'General Consultation' }}</span>
                    <span>&bull;</span>
                    <span class="text-slate-400">{{ apt.clinicName || 'KhojHealth Clinic' }}</span>
                  </p>
                </div>
              </div>

              <!-- Time & Status badge -->
              <div class="flex items-center gap-2.5 self-start sm:self-auto">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200/60">
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ formatAppointmentTime(apt.appointmentTime) }}
                </span>
                <span
                  class="text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider"
                  :class="getStatusBadgeClass(apt.status)"
                >
                  {{ apt.status || 'SCHEDULED' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex-1 flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h4 class="text-sm font-bold text-slate-700">No appointments scheduled</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-xs">You have no upcoming patient consultations registered for this date.</p>
          </div>
        </div>

        <!-- Right: Clinic Affiliations & Approvals (1 Col) -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 sm:p-7 flex flex-col">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800 tracking-tight">Active Affiliations</h2>
                <p class="text-xs text-slate-400 font-medium">Healthcare facilities & shifts</p>
              </div>
            </div>
            <router-link
              to="/dashboard/doctor/affiliations"
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              View All
            </router-link>
          </div>

          <!-- Affiliation List -->
          <div v-if="activeAffiliations.length > 0" class="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            <div
              v-for="aff in activeAffiliations"
              :key="aff.affiliationId"
              class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-emerald-200 transition-all"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="font-bold text-sm text-slate-900">{{ aff.clinicName || 'Affiliated Clinic' }}</h4>
                  <p class="text-xs text-slate-500 mt-0.5">{{ formatAddress(aff.clinicAddress) }}</p>
                </div>
                <span
                  class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border"
                  :class="aff.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                >
                  {{ aff.status }}
                </span>
              </div>

              <!-- Details row -->
              <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Fee: ₹{{ aff.doctorCharge || aff.clinicCharge || 500 }}</span>
                <span>Max: {{ aff.patientLimits || 20 }} patients/day</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex-1 flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p class="text-xs text-slate-400">No active clinic affiliations yet.</p>
            <button
              @click="openAffiliationModal = true"
              class="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              Link a clinic now
            </button>
          </div>
        </div>

      </div>

      <!-- Second Row: Recent Patients & Issued Prescriptions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Recent Patients Widget -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 sm:p-7 flex flex-col">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-[1.25rem] bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800 tracking-tight">Recent Patients</h3>
                <p class="text-xs text-slate-400 font-medium">Patients who attended your consultations</p>
              </div>
            </div>
            <router-link
              to="/dashboard/doctor/patients"
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              View All
            </router-link>
          </div>

          <div v-if="recentPatients.length > 0" class="divide-y divide-slate-100">
            <div
              v-for="p in recentPatients.slice(0, 5)"
              :key="p.id"
              class="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100">
                  {{ p.firstName ? p.firstName.charAt(0) : 'P' }}{{ p.lastName ? p.lastName.charAt(0) : '' }}
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">{{ p.firstName }} {{ p.lastName }}</h4>
                  <p class="text-xs text-slate-400">{{ p.gender || 'Unknown' }} &bull; Blood Group: {{ p.bloodGroup || 'N/A' }}</p>
                </div>
              </div>
              <span class="text-xs font-semibold text-slate-500">{{ p.city || 'Local' }}</span>
            </div>
          </div>
          <div v-else class="py-8 text-center text-xs text-slate-400 font-medium">
            No patient records available yet.
          </div>
        </div>

        <!-- Recent Prescriptions Issued -->
        <div class="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 sm:p-7 flex flex-col">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-[1.25rem] bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800 tracking-tight">Recent Prescriptions</h3>
                <p class="text-xs text-slate-400 font-medium">Medications prescribed during visits</p>
              </div>
            </div>
            <router-link
              to="/dashboard/doctor/prescriptions"
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
            >
              View All
            </router-link>
          </div>

          <div v-if="recentPrescriptions.length > 0" class="space-y-3">
            <div
              v-for="rx in recentPrescriptions.slice(0, 4)"
              :key="rx.id"
              class="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3"
            >
              <div>
                <h4 class="font-bold text-sm text-slate-800">{{ rx.medicationName }}</h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ rx.dosage }} &bull; {{ rx.frequency }} &bull; Patient: {{ rx.patientName || 'Patient' }}
                </p>
              </div>
              <span
                class="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                :class="rx.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
              >
                {{ rx.isActive ? 'ACTIVE' : 'COMPLETED' }}
              </span>
            </div>
          </div>
          <div v-else class="py-8 text-center text-xs text-slate-400 font-medium">
            No recent prescriptions logged.
          </div>
        </div>

      </div>

      <!-- Quick Actions at the very bottom (Positioned just like Patient Dashboard) -->
      <div class="pt-4 border-t border-indigo-100/50">
        <h3 class="text-lg font-bold text-slate-800 mb-4 px-2">Quick Actions</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 1. Find Clinics -->
          <router-link
            to="/dashboard/doctor/clinics"
            class="group relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-6 transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 hover:-translate-y-1 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm bg-blue-50">
              <svg class="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="text-sm font-bold text-slate-800 tracking-wide">Find Clinics</span>
          </router-link>

          <!-- 2. Weekly Schedule -->
          <router-link
            to="/dashboard/doctor/schedule"
            class="group relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-6 transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 hover:-translate-y-1 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm bg-indigo-50">
              <svg class="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-bold text-slate-800 tracking-wide">Weekly Schedule</span>
          </router-link>

          <!-- 3. Issue Rx -->
          <router-link
            to="/dashboard/doctor/prescriptions"
            class="group relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-6 transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-amber-100 hover:-translate-y-1 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm bg-amber-50">
              <svg class="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span class="text-sm font-bold text-slate-800 tracking-wide">Issue Rx</span>
          </router-link>

          <!-- 4. Account Settings -->
          <router-link
            to="/dashboard/doctor/profile"
            class="group relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-6 transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-200 hover:-translate-y-1 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm bg-slate-100">
              <svg class="w-7 h-7 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span class="text-sm font-bold text-slate-800 tracking-wide">Account Settings</span>
          </router-link>
        </div>
      </div>

    </div>

    <!-- Request Affiliation Modal -->
    <Teleport to="body">
      <div
        v-if="openAffiliationModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        @click.self="openAffiliationModal = false"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-extrabold text-slate-900">Request Clinic Affiliation</h3>
            <button @click="openAffiliationModal = false" class="text-slate-400 hover:text-slate-600 p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form @submit.prevent="submitAffiliationRequest" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Target Clinic UUID</label>
              <input
                v-model="affiliationForm.targetId"
                type="text"
                required
                placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Consultation Charge (₹)</label>
                <input
                  v-model.number="affiliationForm.charge"
                  type="number"
                  required
                  min="0"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Patient Limit</label>
                <input
                  v-model.number="affiliationForm.patientLimits"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Joining Date</label>
              <input
                v-model="affiliationForm.joiningDate"
                type="date"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              />
            </div>

            <div class="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="openAffiliationModal = false"
                class="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmittingAffiliation"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 disabled:opacity-50"
              >
                {{ isSubmittingAffiliation ? 'Sending...' : 'Submit Request' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { DoctorService } from '@/services/doctor.service';
import { formatAddress } from '@/utils/address';

const authStore = useAuthStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Hello';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});

const isLoading = ref(true);
const errorMessage = ref('');
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const selectedScheduleDate = ref(formatLocalDate(new Date()));

const isTodaySelected = computed(() => {
  const today = formatLocalDate(new Date());
  return selectedScheduleDate.value === today;
});

const formattedScheduleDate = computed(() => {
  if (!selectedScheduleDate.value) return '';
  const [y, m, d] = selectedScheduleDate.value.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const navigateDate = (dayOffset) => {
  let baseDate = new Date();
  if (selectedScheduleDate.value) {
    const [y, m, d] = selectedScheduleDate.value.split('-').map(Number);
    baseDate = new Date(y, m - 1, d);
  }
  baseDate.setDate(baseDate.getDate() + dayOffset);
  selectedScheduleDate.value = formatLocalDate(baseDate);
  handleDateChange();
};

const doctorProfile = ref(null);
const stats = ref({
  todayAppointmentsCount: 0,
  totalPatients: 0,
  activeAffiliationsCount: 0,
  pendingAffiliationsCount: 0,
  totalPrescriptionsIssued: 0,
});

const todayAppointments = ref([]);
const activeAffiliations = ref([]);
const recentPatients = ref([]);
const recentPrescriptions = ref([]);

// Modal State
const openAffiliationModal = ref(false);
const isSubmittingAffiliation = ref(false);
const affiliationForm = ref({
  targetId: '',
  charge: 500,
  patientLimits: 20,
  joiningDate: new Date().toISOString().split('T')[0],
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

const formatAppointmentTime = (timeObj) => {
  if (!timeObj) return 'Scheduled';
  if (typeof timeObj === 'string') return timeObj;
  if (typeof timeObj === 'object' && timeObj.hour !== undefined) {
    const hour = timeObj.hour % 12 || 12;
    const minute = String(timeObj.minute || 0).padStart(2, '0');
    const ampm = timeObj.hour >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
  }
  return 'Scheduled';
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

const dataSource = ref('Loading...');

const fetchDoctorData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  // Resolve Doctor ID from session, localStorage, or by username
  let doctorId = authStore.user?.userId || authStore.user?.id || localStorage.getItem('userId');
  const username = authStore.user?.username;

  try {
    // If no explicit UUID, look up doctor by username
    if (!doctorId && username) {
      const docByUsername = await DoctorService.getDoctorByUsername(username);
      if (docByUsername?.id) {
        doctorId = docByUsername.id;
        localStorage.setItem('userId', doctorId);
        authStore.updateUser({ userId: doctorId, id: doctorId });
      }
    }

    if (doctorId) {
      // 1. Fetch live aggregated Doctor Dashboard via /api/doctors/{id}/dashboard
      const dashData = await DoctorService.getDoctorDashboard(doctorId);
      
      if (dashData) {
        dataSource.value = 'Live API';
        doctorProfile.value = dashData.profile || authStore.user;
        stats.value = {
          todayAppointmentsCount: dashData.todayAppointmentsCount ?? (dashData.todayAppointments?.length || 0),
          totalPatients: dashData.totalPatients ?? (dashData.recentPatients?.length || 0),
          activeAffiliationsCount: dashData.activeAffiliationsCount ?? (dashData.activeAffiliations?.length || 0),
          pendingAffiliationsCount: dashData.pendingAffiliationsCount ?? (dashData.pendingAffiliations?.length || 0),
          totalPrescriptionsIssued: dashData.totalPrescriptionsIssued ?? (dashData.recentPrescriptions?.length || 0),
        };

        todayAppointments.value = dashData.todayAppointments || [];
        activeAffiliations.value = dashData.activeAffiliations || [];
        recentPatients.value = dashData.recentPatients || [];
        recentPrescriptions.value = dashData.recentPrescriptions || [];

        // Synchronize authStore user fields
        if (dashData.profile) {
          authStore.updateUser({
            userId: doctorId,
            firstName: dashData.profile.firstName,
            lastName: dashData.profile.lastName,
            emailId: dashData.profile.emailId,
            specializations: dashData.profile.specializations,
            qualifications: dashData.profile.qualifications,
            registrationNumber: dashData.profile.registrationNumber,
            yearsOfExperience: dashData.profile.yearsOfExperience
          });
        }
      }
    } else {
      throw new Error('Doctor profile ID not found in session');
    }
  } catch (err) {
    // Provide clean real state based on authStore user
    doctorProfile.value = {
      firstName: authStore.user?.firstName || 'Doctor',
      lastName: authStore.user?.lastName || '',
      specializations: authStore.user?.specializations || 'Consulting Physician',
      yearsOfExperience: authStore.user?.yearsOfExperience || 0,
      registrationNumber: authStore.user?.registrationNumber || ''
    };

    // Clean zero-state dataset
    stats.value = {
      todayAppointmentsCount: 0,
      totalPatients: 0,
      activeAffiliationsCount: 0,
      pendingAffiliationsCount: 0,
      totalPrescriptionsIssued: 0,
    };

    todayAppointments.value = [];
    activeAffiliations.value = [];
    recentPatients.value = [];
    recentPrescriptions.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleDateChange = async () => {
  const doctorId = authStore.user?.userId || authStore.user?.id;
  if (!doctorId || !selectedScheduleDate.value) return;
  try {
    const list = await DoctorService.getDoctorAppointmentsOnDate(doctorId, selectedScheduleDate.value);
    todayAppointments.value = list || [];
  } catch (err) {
    console.warn('Appointments for date fetch error:', err);
  }
};

const submitAffiliationRequest = async () => {
  isSubmittingAffiliation.value = true;
  try {
    await DoctorService.createAffiliationRequest(affiliationForm.value);
    openAffiliationModal.value = false;
    await fetchDoctorData();
  } catch (err) {
    console.error('Affiliation request error:', err);
    alert(err.response?.data?.message || 'Failed to submit affiliation request. Please check the Clinic UUID.');
  } finally {
    isSubmittingAffiliation.value = false;
  }
};

onMounted(() => {
  fetchDoctorData();
});
</script>
