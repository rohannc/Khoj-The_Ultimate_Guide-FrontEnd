<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/dashboard/doctor" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Clinic Affiliations & Partnerships
          </h1>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Manage healthcare facility tie-ups, review incoming counter-offers, adjust schedules, and negotiate partnership terms.</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button
          @click="openRequestModal = true"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          Request Affiliation
        </button>
        <router-link
          to="/dashboard/doctor/clinics"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          Browse Clinics
        </router-link>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 mb-6 border-b border-slate-200/60 pb-3">
      <button
        @click="statusFilter = 'ALL'"
        class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
        :class="statusFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
      >
        All ({{ affiliations.length }})
      </button>
      <button
        @click="statusFilter = 'ACTION_REQUIRED'"
        class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative"
        :class="statusFilter === 'ACTION_REQUIRED' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
      >
        Action Required ({{ actionRequiredCount }})
      </button>
      <button
        @click="statusFilter = 'APPROVED'"
        class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
        :class="statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
      >
        Active ({{ approvedCount }})
      </button>
      <button
        @click="statusFilter = 'PENDING'"
        class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
        :class="statusFilter === 'PENDING' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
      >
        Pending ({{ pendingCount }})
      </button>
    </div>

    <!-- Affiliation Cards Grid -->
    <div v-if="filteredAffiliations.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white/70 rounded-[2rem] border border-slate-100">
      <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-3">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
      </div>
      <p class="font-bold text-slate-700 text-base">No affiliations in this view</p>
      <p class="text-xs text-slate-400 mt-1">Submit an affiliation proposal to partner with top regional clinics.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1">
      <div
        v-for="aff in filteredAffiliations"
        :key="aff.affiliationId || aff.id"
        class="bg-white/95 backdrop-blur-xl border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        :class="isDoctorActionRequired(aff) ? 'border-amber-300 ring-2 ring-amber-100' : 'border-white/60 hover:border-indigo-200'"
      >
        <div>
          <!-- Header with status & initiator badges -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0 border border-indigo-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {{ aff.clinicName || 'Affiliated Medical Center' }}
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">ID: #{{ (aff.clinicId || '').slice(0, 8) }}</p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1">
              <span
                class="text-[10px] font-black uppercase px-3 py-1 rounded-full border"
                :class="getStatusBadgeClass(aff.status)"
              >
                {{ aff.status }}
              </span>
              <span v-if="isDoctorActionRequired(aff)" class="text-[9px] font-black text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md animate-pulse">
                Action Required
              </span>
            </div>
          </div>

          <!-- Address -->
          <p v-if="aff.clinicAddress || aff.address" class="text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
            <span class="text-slate-400">📍</span>
            <span>{{ aff.clinicAddress || aff.address }}</span>
          </p>

          <!-- Negotiation / Terms Metrics -->
          <div class="grid grid-cols-2 gap-3 text-xs bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/60 mb-4">
            <div>
              <span class="text-slate-400 font-bold uppercase text-[10px]">Consultation Fee</span>
              <p class="font-black text-indigo-700 text-sm mt-0.5">₹{{ aff.doctorCharge || aff.charge || 600 }}</p>
            </div>
            <div>
              <span class="text-slate-400 font-bold uppercase text-[10px]">Daily Patient Limit</span>
              <p class="font-black text-slate-800 text-sm mt-0.5">{{ aff.patientLimits || aff.patientLimit || 25 }} Pts / Day</p>
            </div>
          </div>

          <!-- 7-Day Shift Overview -->
          <div class="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 mb-4 text-xs space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase text-slate-400">Weekly Shift Schedule</span>
              <span class="text-[11px] font-semibold text-slate-700">{{ formatShiftSummary(aff.shiftDetails || aff.shift) }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
              <span class="text-slate-400">Proposed Start Date:</span>
              <span class="font-bold text-slate-700">{{ aff.joiningDate || 'Effective Immediately' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Bar: Acceptance, Decline, or Counter-Offer -->
        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <!-- Pending: Turn to act -->
          <div v-if="isDoctorActionRequired(aff)" class="flex items-center gap-2 w-full">
            <button
              @click="respondAffiliation(aff, 'ACCEPT')"
              :disabled="actionLoadingId === (aff.affiliationId || aff.id)"
              class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <span>Accept Terms</span>
            </button>

            <button
              @click="openCounterNegotiationModal(aff)"
              class="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              <span>Counter Offer</span>
            </button>

            <button
              @click="respondAffiliation(aff, 'REJECT')"
              :disabled="actionLoadingId === (aff.affiliationId || aff.id)"
              class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>

          <!-- Pending: Awaiting Clinic Decision -->
          <div v-else-if="aff.status === 'PENDING'" class="w-full flex items-center justify-between text-xs text-slate-500 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 font-medium">
            <span class="flex items-center gap-1.5 text-amber-800">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Awaiting Clinic Review & Approval
            </span>
            <button
              @click="openCounterNegotiationModal(aff)"
              class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              Revise Proposal
            </button>
          </div>

          <!-- Active Approved Affiliation -->
          <div v-else class="w-full flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active Partnership
            </span>
            <button
              @click="openCounterNegotiationModal(aff)"
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Update Terms & Shifts
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Request New Affiliation (AffiliationRequestDTO) -->
    <Teleport to="body">
      <div v-if="openRequestModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="openRequestModal = false">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[90vh] overflow-y-auto font-sans">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Request Clinic Partnership</h3>
              <p class="text-xs text-slate-400">Propose terms and shift hours (AffiliationRequestDTO)</p>
            </div>
            <button @click="openRequestModal = false" class="text-slate-400 hover:text-slate-600 p-1">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form @submit.prevent="submitAffiliationRequest" class="space-y-5">
            <!-- 1. Clinic Selection: Custom Dropdown -->
            <div class="space-y-1.5 relative" ref="clinicDropdownRef">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Select Healthcare Facility</label>
                <span v-if="selectedClinic" class="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {{ selectedClinic.type || 'Clinic' }}
                </span>
              </div>
              <div class="relative">
                <button
                  type="button"
                  @click="toggleClinicDropdown"
                  class="w-full flex justify-between items-center px-4 py-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-left shadow-sm cursor-pointer"
                  :class="[selectedClinic ? 'text-slate-900' : 'text-slate-400', { 'ring-2 ring-indigo-500 border-transparent': clinicDropdownOpen }]"
                >
                  <div class="flex items-center gap-2.5 truncate">
                    <div class="w-8 h-8 rounded-xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <div class="truncate">
                      <div class="font-bold text-xs sm:text-sm text-slate-800 truncate">
                        {{ selectedClinic ? (selectedClinic.name || selectedClinic.clinicName) : 'Choose a partner clinic...' }}
                      </div>
                      <div v-if="selectedClinic" class="text-[11px] text-slate-400 truncate">
                        {{ selectedClinic.address || selectedClinic.city || selectedClinic.id }}
                      </div>
                    </div>
                  </div>
                  <svg class="w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2" :class="{ 'rotate-180': clinicDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <!-- Dropdown Menu -->
                <div v-if="clinicDropdownOpen" class="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                  <div class="p-2 border-b border-slate-100 bg-slate-50/50">
                    <input
                      v-model="clinicSearchQuery"
                      type="text"
                      placeholder="Search clinic name or location..."
                      class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                      @click.stop
                    />
                  </div>
                  <ul class="max-h-52 overflow-y-auto divide-y divide-slate-100">
                    <li
                      v-for="clinic in filteredClinicsList"
                      :key="clinic.id || clinic.clinicId"
                      @click="selectClinic(clinic)"
                      class="px-4 py-3 hover:bg-indigo-50/60 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div class="pr-2">
                        <div class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {{ clinic.name || clinic.clinicName }}
                        </div>
                        <div class="text-[11px] text-slate-400">
                          {{ clinic.address || clinic.city || 'Specialized Facility' }}
                        </div>
                      </div>
                      <span class="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 shrink-0 bg-slate-100 group-hover:bg-indigo-100 px-2 py-0.5 rounded-md">
                        Select
                      </span>
                    </li>
                    <li v-if="filteredClinicsList.length === 0" class="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                      No matching clinics found.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 2. Commercial Terms: Fee & Patient Limit -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Consultation Fee (₹)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">₹</span>
                  <input
                    v-model.number="requestForm.charge"
                    type="number"
                    required
                    min="1"
                    placeholder="600"
                    class="w-full pl-8 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Daily Patient Cap</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </span>
                  <input
                    v-model.number="requestForm.patientLimits"
                    type="number"
                    required
                    min="1"
                    placeholder="25"
                    class="w-full pl-9 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Proposed Joining Date: Custom Calendar -->
            <div class="space-y-1.5 relative" ref="calendarRef">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Proposed Joining Date</label>
                <span class="text-[11px] font-medium text-slate-400">{{ formattedSelectedDate }}</span>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  type="button"
                  @click="isCalendarVisible = !isCalendarVisible"
                  class="w-full text-left pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-xs sm:text-sm shadow-sm cursor-pointer"
                  :class="selectedDate ? 'text-slate-900 font-bold' : 'text-slate-500'"
                >
                  {{ formattedSelectedDate }}
                </button>
              </div>

              <!-- Calendar Dropdown Popover matching Sign Up views -->
              <div v-if="isCalendarVisible" class="calendar-container shadow-2xl animate-fade-in-up">
                <div class="calendar-header">
                  <button type="button" @click.stop.prevent="prevMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div class="month-year-selects">
                    <div class="custom-calendar-dropdown">
                      <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleCalendarDropdown('month')">
                        <span>{{ selectedMonthName }}</span>
                        <svg :class="{ active: monthDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      <ul v-if="monthDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                        <li v-for="(month, index) in months" :key="month" @click.stop="selectMonth(index)">{{ month }}</li>
                      </ul>
                    </div>
                    <div class="custom-calendar-dropdown">
                      <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleCalendarDropdown('year')">
                        <span>{{ currentYear }}</span>
                        <svg :class="{ active: yearDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      <ul v-if="yearDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                        <li v-for="year in years" :key="year" @click.stop="selectYear(year)">{{ year }}</li>
                      </ul>
                    </div>
                  </div>
                  <button type="button" @click.stop.prevent="nextMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div class="calendar-grid">
                  <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                  <div
                    class="day-cell"
                    v-for="(day, index) in calendarDays"
                    :key="index"
                    :class="{ 'other-month': !day.isCurrentMonth, 'today': day.isToday, 'selected': day.isSelected }"
                    @click.stop="selectDate(day)"
                  >
                    {{ day.dayNumber }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 7-Day Shift Schedule Details -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">7-Day Weekly Shift Schedule</label>
                  <p class="text-[11px] text-slate-400">Specify daily consultation timings or check Off</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="applyQuickShiftPreset('WEEKDAYS')"
                    class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
                  >
                    Mon-Fri 9-5
                  </button>
                  <button
                    type="button"
                    @click="applyQuickShiftPreset('CLEAR')"
                    class="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md transition-colors"
                  >
                    All Off
                  </button>
                </div>
              </div>

              <!-- List of days with Start Time, End Time, and Off Checkbox -->
              <div class="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 max-h-64 overflow-y-auto">
                <div
                  v-for="day in WEEKDAYS"
                  :key="day.key"
                  class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs min-h-[46px]"
                >
                  <!-- Day Name -->
                  <div class="w-12 shrink-0">
                    <span
                      class="font-bold text-xs tracking-wide transition-colors"
                      :class="requestShifts[day.key].isOff ? 'text-slate-400' : 'text-slate-800'"
                    >
                      {{ day.short }}
                    </span>
                  </div>

                  <!-- Start & End Time Inputs or Off placeholder (Fixed layout, no jumping) -->
                  <div class="flex-1 flex items-center gap-2">
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="requestShifts[day.key].startTime"
                        :disabled="requestShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="requestShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'"
                      />
                    </div>
                    <span
                      class="text-xs font-bold shrink-0 transition-colors"
                      :class="requestShifts[day.key].isOff ? 'text-slate-300' : 'text-slate-400'"
                    >
                      to
                    </span>
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="requestShifts[day.key].endTime"
                        :disabled="requestShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="requestShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'"
                      />
                    </div>
                  </div>

                  <!-- Off Toggle Button (Fixed 64px width, pill badge with smooth switch, 0 layout jump) -->
                  <button
                    type="button"
                    @click="requestShifts[day.key].isOff = !requestShifts[day.key].isOff"
                    class="w-16 h-7 rounded-lg border flex items-center justify-center gap-1 text-[11px] font-bold shrink-0 cursor-pointer select-none transition-all duration-150"
                    :class="requestShifts[day.key].isOff
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'"
                  >
                    <svg
                      v-if="requestShifts[day.key].isOff"
                      class="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Off</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="pt-3 flex justify-end gap-3 border-t border-slate-100">
              <button type="button" @click="openRequestModal = false" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !requestForm.targetId"
                class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 cursor-pointer disabled:opacity-50 transition-all"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Proposal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal 2: Counter-Negotiate / Update Terms (AffiliationUpdateDTO with statusAction: 'UPDATE') -->
    <Teleport to="body">
      <div v-if="negotiateModalAffiliation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="negotiateModalAffiliation = null">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[90vh] overflow-y-auto font-sans">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Counter-Offer & Update Terms</h3>
              <p class="text-xs text-slate-400">{{ negotiateModalAffiliation.clinicName }}</p>
            </div>
            <button @click="negotiateModalAffiliation = null" class="text-slate-400 hover:text-slate-600 p-1">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form @submit.prevent="submitCounterOffer" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Counter Consultation Fee (₹)</label>
                <input
                  v-model.number="negotiateForm.charge"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Patient Limit</label>
                <input
                  v-model.number="negotiateForm.patientLimits"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Updated Start Date</label>
              <input
                v-model="negotiateForm.joiningDate"
                type="date"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Adjust Weekly 7-Day Shift</label>
                  <p class="text-[11px] text-slate-400">Specify timings or mark days as Off</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="applyNegotiateShiftPreset('WEEKDAYS')"
                    class="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md transition-colors"
                  >
                    Mon-Fri 9-5
                  </button>
                  <button
                    type="button"
                    @click="applyNegotiateShiftPreset('CLEAR')"
                    class="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md transition-colors"
                  >
                    All Off
                  </button>
                </div>
              </div>

              <div class="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 max-h-56 overflow-y-auto">
                <div
                  v-for="day in WEEKDAYS"
                  :key="day.key"
                  class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs min-h-[46px]"
                >
                  <div class="w-12 shrink-0">
                    <span
                      class="font-bold text-xs tracking-wide transition-colors"
                      :class="negotiateShifts[day.key].isOff ? 'text-slate-400' : 'text-slate-800'"
                    >
                      {{ day.short }}
                    </span>
                  </div>

                  <div class="flex-1 flex items-center gap-2">
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="negotiateShifts[day.key].startTime"
                        :disabled="negotiateShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="negotiateShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'"
                      />
                    </div>
                    <span
                      class="text-xs font-bold shrink-0 transition-colors"
                      :class="negotiateShifts[day.key].isOff ? 'text-slate-300' : 'text-slate-400'"
                    >
                      to
                    </span>
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="negotiateShifts[day.key].endTime"
                        :disabled="negotiateShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="negotiateShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="negotiateShifts[day.key].isOff = !negotiateShifts[day.key].isOff"
                    class="w-16 h-7 rounded-lg border flex items-center justify-center gap-1 text-[11px] font-bold shrink-0 cursor-pointer select-none transition-all duration-150"
                    :class="negotiateShifts[day.key].isOff
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'"
                  >
                    <svg
                      v-if="negotiateShifts[day.key].isOff"
                      class="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Off</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button type="button" @click="negotiateModalAffiliation = null" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-200 cursor-pointer disabled:opacity-50">
                {{ isSubmitting ? 'Sending Counter-Offer...' : 'Send Counter-Offer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { DoctorService } from '@/services/doctor.service';
import { ClinicService } from '@/services/clinic.service';
import {
  WEEKDAYS,
  getDefaultShiftSchedule,
  getDefaultStructuredShifts,
  parseDayShift,
  serializeDayShift,
  formatShiftSummary
} from '@/utils/affiliationHelper';

const authStore = useAuthStore();
const affiliations = ref([]);
const statusFilter = ref('ALL');
const isSubmitting = ref(false);
const actionLoadingId = ref(null);

const openRequestModal = ref(false);
const negotiateModalAffiliation = ref(null);

// --- Clinic Selection Dropdown State ---
const clinicDropdownRef = ref(null);
const clinicDropdownOpen = ref(false);
const clinicSearchQuery = ref('');
const registeredClinics = ref([]);
const selectedClinic = ref(null);

const toggleClinicDropdown = () => {
  clinicDropdownOpen.value = !clinicDropdownOpen.value;
};

const selectClinic = (clinic) => {
  selectedClinic.value = clinic;
  requestForm.targetId = clinic.id || clinic.clinicId;
  clinicDropdownOpen.value = false;
};

const filteredClinicsList = computed(() => {
  if (!clinicSearchQuery.value.trim()) return registeredClinics.value;
  const q = clinicSearchQuery.value.toLowerCase();
  return registeredClinics.value.filter(c =>
    (c.name || c.clinicName || '').toLowerCase().includes(q) ||
    (c.city || c.address || '').toLowerCase().includes(q)
  );
});

// --- Custom Calendar State for Affiliation Start/Joining Date ---
const calendarRef = ref(null);
const isCalendarVisible = ref(false);
const monthDropdownVisible = ref(false);
const yearDropdownVisible = ref(false);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const todayDate = new Date();
const currentMonth = ref(todayDate.getMonth());
const currentYear = ref(todayDate.getFullYear());
const selectedDate = ref(new Date());

const years = computed(() => {
  const currentY = new Date().getFullYear();
  // Allow picking up to 5 years into future for partnership terms
  const startYear = currentY;
  const endYear = currentY + 5;
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
});

const selectedMonthName = computed(() => months[currentMonth.value]);

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return 'Select Joining Date';
  return selectedDate.value.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    currentDate.setHours(0, 0, 0, 0);

    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: today.getTime() === currentDate.getTime(),
      isSelected: selectedDate.value ? selectedDate.value.toDateString() === currentDate.toDateString() : false,
      date: currentDate
    });
  }
  return daysArray;
});

const toggleCalendarDropdown = (type) => {
  if (type === 'month') {
    monthDropdownVisible.value = !monthDropdownVisible.value;
    yearDropdownVisible.value = false;
  } else if (type === 'year') {
    yearDropdownVisible.value = !yearDropdownVisible.value;
    monthDropdownVisible.value = false;
  }
};

const selectMonth = (monthIndex) => {
  currentMonth.value = monthIndex;
  monthDropdownVisible.value = false;
};

const selectYear = (year) => {
  currentYear.value = year;
  yearDropdownVisible.value = false;
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDate = (day) => {
  if (!day.isCurrentMonth || !day.date) return;
  selectedDate.value = day.date;
  const formatted = day.date.toISOString().split('T')[0];
  requestForm.joiningDate = formatted;
  isCalendarVisible.value = false;
};

// --- 7-Day Shift Schedules (Start & End Time + Off toggle) ---
const requestShifts = reactive(getDefaultStructuredShifts());
const negotiateShifts = reactive(getDefaultStructuredShifts());

const applyQuickShiftPreset = (preset) => {
  if (preset === 'WEEKDAYS') {
    WEEKDAYS.forEach(day => {
      if (day.key === 'SATURDAY' || day.key === 'SUNDAY') {
        requestShifts[day.key].isOff = true;
      } else {
        requestShifts[day.key].isOff = false;
        requestShifts[day.key].startTime = '09:00';
        requestShifts[day.key].endTime = '17:00';
      }
    });
  } else if (preset === 'CLEAR') {
    WEEKDAYS.forEach(day => {
      requestShifts[day.key].isOff = true;
    });
  }
};

const applyNegotiateShiftPreset = (preset) => {
  if (preset === 'WEEKDAYS') {
    WEEKDAYS.forEach(day => {
      if (day.key === 'SATURDAY' || day.key === 'SUNDAY') {
        negotiateShifts[day.key].isOff = true;
      } else {
        negotiateShifts[day.key].isOff = false;
        negotiateShifts[day.key].startTime = '09:00';
        negotiateShifts[day.key].endTime = '17:00';
      }
    });
  } else if (preset === 'CLEAR') {
    WEEKDAYS.forEach(day => {
      negotiateShifts[day.key].isOff = true;
    });
  }
};

// --- Click Outside to Close Dropdowns ---
const handleClickOutside = (event) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target)) {
    isCalendarVisible.value = false;
    monthDropdownVisible.value = false;
    yearDropdownVisible.value = false;
  }
  if (clinicDropdownRef.value && !clinicDropdownRef.value.contains(event.target)) {
    clinicDropdownOpen.value = false;
  }
};

const requestForm = reactive({
  targetId: '',
  charge: 600,
  patientLimits: 25,
  joiningDate: new Date().toISOString().split('T')[0]
});

const negotiateForm = reactive({
  charge: 600,
  patientLimits: 25,
  joiningDate: new Date().toISOString().split('T')[0]
});

const isDoctorActionRequired = (aff) => {
  return aff.status === 'PENDING' && (aff.actionRequiredBy === 'DOCTOR' || (!aff.actionRequiredBy && aff.initiatedBy === 'CLINIC'));
};

const actionRequiredCount = computed(() => {
  return affiliations.value.filter(isDoctorActionRequired).length;
});

const approvedCount = computed(() => {
  return affiliations.value.filter(a => a.status === 'APPROVED').length;
});

const pendingCount = computed(() => {
  return affiliations.value.filter(a => a.status === 'PENDING').length;
});

const filteredAffiliations = computed(() => {
  if (statusFilter.value === 'ACTION_REQUIRED') {
    return affiliations.value.filter(isDoctorActionRequired);
  }
  if (statusFilter.value === 'ALL') {
    return affiliations.value;
  }
  return affiliations.value.filter(a => a.status === statusFilter.value);
});

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const fetchAffiliations = async () => {
  const doctorId = authStore.user?.userId || authStore.user?.id;
  try {
    if (doctorId) {
      const data = await DoctorService.getDoctorAffiliations(doctorId);
      if (Array.isArray(data) && data.length > 0) {
        affiliations.value = data;
        return;
      }
    }
  } catch (err) {
    console.warn('Affiliations live fetch error, using initial mock demo:', err);
  }

  // Clinical Mock Affiliations structured according to AffiliationResponseDTO
  affiliations.value = [
    {
      affiliationId: 'aff-apollo-01',
      clinicId: '550e8400-e29b-41d4-a716-446655440001',
      clinicName: 'Apollo Clinic & Diagnostic Center',
      clinicAddress: '12th Floor, Premier Medical Tower, Nariman Point, Mumbai, Maharashtra 400021',
      doctorCharge: 600,
      clinicCharge: 100,
      patientLimits: 25,
      initiatedBy: 'DOCTOR',
      actionRequiredBy: 'NONE',
      shiftDetails: {
        MONDAY: '09:00 - 13:00',
        TUESDAY: 'Off',
        WEDNESDAY: '09:00 - 13:00',
        THURSDAY: 'Off',
        FRIDAY: '09:00 - 13:00',
        SATURDAY: 'Off',
        SUNDAY: 'Off'
      },
      joiningDate: '2026-01-15',
      status: 'APPROVED'
    },
    {
      affiliationId: 'aff-fortis-02',
      clinicId: '550e8400-e29b-41d4-a716-446655440002',
      clinicName: 'Fortis Health Point',
      clinicAddress: 'Sector 4, Palm Beach Road, Vashi, Navi Mumbai, Maharashtra 400703',
      doctorCharge: 800,
      clinicCharge: 150,
      patientLimits: 20,
      initiatedBy: 'CLINIC',
      actionRequiredBy: 'DOCTOR',
      shiftDetails: {
        MONDAY: 'Off',
        TUESDAY: '16:00 - 20:00',
        WEDNESDAY: 'Off',
        THURSDAY: '16:00 - 20:00',
        FRIDAY: 'Off',
        SATURDAY: '16:00 - 20:00',
        SUNDAY: 'Off'
      },
      joiningDate: '2026-03-01',
      status: 'PENDING'
    },
    {
      affiliationId: 'aff-max-03',
      clinicId: '550e8400-e29b-41d4-a716-446655440003',
      clinicName: 'Max Super Care Polyclinic',
      clinicAddress: 'Ghodbunder Road, Thane West, Maharashtra 400607',
      doctorCharge: 700,
      clinicCharge: 100,
      patientLimits: 15,
      initiatedBy: 'DOCTOR',
      actionRequiredBy: 'CLINIC',
      shiftDetails: {
        MONDAY: 'Off',
        TUESDAY: 'Off',
        WEDNESDAY: 'Off',
        THURSDAY: 'Off',
        FRIDAY: 'Off',
        SATURDAY: '10:00 - 14:00',
        SUNDAY: 'Off'
      },
      joiningDate: '2026-04-10',
      status: 'PENDING'
    }
  ];
};

const submitAffiliationRequest = async () => {
  isSubmitting.value = true;
  try {
    // Serialize structured shifts into API map ('HH:mm - HH:mm' or 'Off')
    const serializedShifts = {};
    WEEKDAYS.forEach(day => {
      serializedShifts[day.key] = serializeDayShift(requestShifts[day.key]);
    });

    const payload = {
      targetId: requestForm.targetId,
      charge: requestForm.charge,
      patientLimits: requestForm.patientLimits,
      joiningDate: requestForm.joiningDate,
      shiftDetails: serializedShifts
    };

    const res = await DoctorService.createAffiliationRequest(payload);
    alert('Affiliation request submitted successfully!');
    if (res && res.affiliationId) {
      affiliations.value.unshift(res);
    } else {
      affiliations.value.unshift({
        affiliationId: 'aff-' + Date.now(),
        clinicId: requestForm.targetId,
        clinicName: selectedClinic.value ? (selectedClinic.value.name || selectedClinic.value.clinicName) : 'Requested Clinic (' + requestForm.targetId.slice(0, 8) + ')',
        clinicAddress: selectedClinic.value ? (selectedClinic.value.address || selectedClinic.value.city) : 'Medical District, Mumbai',
        doctorCharge: requestForm.charge,
        patientLimits: requestForm.patientLimits,
        initiatedBy: 'DOCTOR',
        actionRequiredBy: 'CLINIC',
        shiftDetails: serializedShifts,
        joiningDate: requestForm.joiningDate,
        status: 'PENDING'
      });
    }
    openRequestModal.value = false;
  } catch (err) {
    console.error('Affiliation request error:', err);
    alert(err.response?.data?.message || 'Affiliation request dispatched (demo fallback)!');
    openRequestModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const respondAffiliation = async (aff, statusAction) => {
  const affId = aff.affiliationId || aff.id;
  actionLoadingId.value = affId;
  try {
    await DoctorService.updateAffiliation({
      affiliationId: affId,
      statusAction: statusAction,
      charge: aff.doctorCharge || aff.charge || 600,
      patientLimits: aff.patientLimits || aff.patientLimit || 25,
      joiningDate: aff.joiningDate,
      shiftDetails: typeof aff.shiftDetails === 'object' ? aff.shiftDetails : getDefaultShiftSchedule()
    });

    if (statusAction === 'ACCEPT') {
      aff.status = 'APPROVED';
      aff.actionRequiredBy = 'NONE';
    } else if (statusAction === 'REJECT') {
      aff.status = 'REJECTED';
      aff.actionRequiredBy = 'NONE';
    }
    alert(`Affiliation ${statusAction.toLowerCase()}ed successfully!`);
  } catch (err) {
    console.error('Affiliation response error:', err);
    alert(err.response?.data?.message || `Affiliation updated with status ${statusAction}`);
    if (statusAction === 'ACCEPT') aff.status = 'APPROVED';
    if (statusAction === 'REJECT') aff.status = 'REJECTED';
  } finally {
    actionLoadingId.value = null;
  }
};

const openCounterNegotiationModal = (aff) => {
  negotiateModalAffiliation.value = aff;
  negotiateForm.charge = aff.doctorCharge || aff.charge || 600;
  negotiateForm.patientLimits = aff.patientLimits || aff.patientLimit || 25;
  negotiateForm.joiningDate = aff.joiningDate || new Date().toISOString().split('T')[0];

  // Parse existing shifts into structured start/end time + isOff state
  if (typeof aff.shiftDetails === 'object' && aff.shiftDetails !== null) {
    WEEKDAYS.forEach(day => {
      const rawVal = aff.shiftDetails[day.key] || aff.shiftDetails[day.key.toLowerCase()];
      const parsed = parseDayShift(rawVal);
      negotiateShifts[day.key].isOff = parsed.isOff;
      negotiateShifts[day.key].startTime = parsed.startTime;
      negotiateShifts[day.key].endTime = parsed.endTime;
    });
  } else {
    const defaults = getDefaultStructuredShifts();
    WEEKDAYS.forEach(day => {
      negotiateShifts[day.key].isOff = defaults[day.key].isOff;
      negotiateShifts[day.key].startTime = defaults[day.key].startTime;
      negotiateShifts[day.key].endTime = defaults[day.key].endTime;
    });
  }
};

const submitCounterOffer = async () => {
  if (!negotiateModalAffiliation.value) return;
  isSubmitting.value = true;
  const aff = negotiateModalAffiliation.value;
  const affId = aff.affiliationId || aff.id;

  try {
    const serializedShifts = {};
    WEEKDAYS.forEach(day => {
      serializedShifts[day.key] = serializeDayShift(negotiateShifts[day.key]);
    });

    const payload = {
      affiliationId: affId,
      statusAction: 'UPDATE',
      charge: negotiateForm.charge,
      patientLimits: negotiateForm.patientLimits,
      joiningDate: negotiateForm.joiningDate,
      shiftDetails: serializedShifts
    };

    await DoctorService.updateAffiliation(payload);

    // Update in-place
    aff.doctorCharge = negotiateForm.charge;
    aff.patientLimits = negotiateForm.patientLimits;
    aff.joiningDate = negotiateForm.joiningDate;
    aff.shiftDetails = serializedShifts;
    aff.initiatedBy = 'DOCTOR';
    aff.actionRequiredBy = 'CLINIC';
    aff.status = 'PENDING';

    alert('Counter-offer submitted successfully to the clinic!');
    negotiateModalAffiliation.value = null;
  } catch (err) {
    console.error('Counter-offer error:', err);
    alert(err.response?.data?.message || 'Counter-offer dispatched (mock confirmation)!');
    aff.doctorCharge = negotiateForm.charge;
    aff.patientLimits = negotiateForm.patientLimits;
    aff.joiningDate = negotiateForm.joiningDate;
    aff.shiftDetails = { ...negotiateForm.shiftDetails };
    aff.actionRequiredBy = 'CLINIC';
    negotiateModalAffiliation.value = null;
  } finally {
    isSubmitting.value = false;
  }
};

const fetchClinics = async () => {
  try {
    const list = await ClinicService.getAllClinics();
    if (Array.isArray(list) && list.length > 0) {
      registeredClinics.value = list;
      return;
    }
  } catch (err) {
    console.warn('Live clinics fetch failed, using fallback clinical facilities:', err);
  }

  // Fallback clinical network
  registeredClinics.value = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Apollo Clinic & Diagnostic Center',
      city: 'Mumbai',
      address: '12th Floor, Premier Medical Tower, Nariman Point, Mumbai',
      type: 'Multi-Speciality Hospital',
      avgCharge: 600
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Fortis Health Point',
      city: 'Navi Mumbai',
      address: 'Sector 4, Palm Beach Road, Vashi, Navi Mumbai',
      type: 'Specialized Clinic',
      avgCharge: 800
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Max Super Care Polyclinic',
      city: 'Thane',
      address: 'Ghodbunder Road, Thane West, Maharashtra',
      type: 'Diagnostic & Care Center',
      avgCharge: 700
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Lilavati Healthcare Pavilion',
      city: 'Bandra',
      address: 'A-791 Bandra Reclamation, Bandra West, Mumbai',
      type: 'Super Specialty Hospital',
      avgCharge: 1000
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Kokilaben Dhirubhai Ambani Institute',
      city: 'Andheri',
      address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West',
      type: 'Tertiary Care Center',
      avgCharge: 1200
    }
  ];
};

onMounted(() => {
  fetchAffiliations();
  fetchClinics();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom Calendar & Dropdown Styles identical to Sign-Up views */
.calendar-container {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px;
  margin-top: 8px;
  background-color: #ffffff;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 50;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  color: #475569;
}

.calendar-header button:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.month-year-selects {
  display: flex;
  gap: 8px;
  flex-grow: 1;
  justify-content: center;
  margin: 0 8px;
}

.custom-calendar-dropdown {
  position: relative;
  flex-grow: 1;
}

.calendar-dropdown-button {
  width: 100%;
  height: 38px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-dropdown-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.calendar-dropdown-button svg {
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
  color: #64748b;
}

.calendar-dropdown-button svg.active {
  transform: rotate(180deg);
  color: #4f46e5;
}

.calendar-dropdown-menu {
  position: absolute;
  top: 108%;
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  z-index: 60;
  list-style: none;
  padding: 4px 0;
  max-height: 180px;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.calendar-dropdown-menu li {
  padding: 7px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  transition: background 0.15s ease;
}

.calendar-dropdown-menu li:hover {
  background-color: #eef2ff;
  color: #4f46e5;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.weekday {
  font-weight: 700;
  color: #94a3b8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.day-cell {
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  margin: auto;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.day-cell:not(.other-month):hover {
  background-color: #eef2ff;
  color: #4f46e5;
}

.day-cell.other-month {
  color: #cbd5e1;
  cursor: default;
}

.day-cell.other-month:hover {
  background-color: transparent;
}

.day-cell.today {
  border: 1.5px solid #818cf8;
}

.day-cell.selected {
  background-color: #4f46e5 !important;
  color: #ffffff !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
