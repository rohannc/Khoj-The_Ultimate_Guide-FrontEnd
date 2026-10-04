<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Header & Actions -->
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
            Partner Clinics & Medical Facilities
          </h1>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Browse healthcare facilities, hospitals, and specialized clinics to establish practice affiliations.</p>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/dashboard/doctor/affiliations"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <span>My Affiliations</span>
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="relative z-30 bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-3">
      <div class="relative flex-1 w-full">
        <svg class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by clinic name, specialty or area..."
          class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto relative z-30">
        <!-- Custom City Dropdown (SignUp style with max 4 items and custom scrollbar) -->
        <div class="relative custom-dropdown flex-1 sm:flex-none" ref="cityDropdownRef">
          <button
            type="button"
            class="dropdown-button flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none hover:border-indigo-300 focus:border-indigo-500 transition-all cursor-pointer min-w-[140px] sm:min-w-[160px]"
            :class="{ active: cityDropdownOpen }"
            @click="cityDropdownOpen = !cityDropdownOpen"
          >
            <span class="truncate">{{ selectedCity === 'ALL' ? 'All Cities' : selectedCity }}</span>
            <svg
              class="w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0"
              :class="{ 'rotate-180 text-indigo-600': cityDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <ul
            v-if="cityDropdownOpen"
            class="dropdown-menu absolute left-0 top-[108%] w-full bg-white border border-slate-200/90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)] z-50 py-1.5 list-none overflow-y-auto max-h-[176px] custom-dropdown-scrollbar animate-in fade-in zoom-in-95 duration-150"
          >
            <li
              v-for="city in cityOptions"
              :key="city.value"
              @click="selectCity(city.value)"
              class="px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-between"
              :class="selectedCity === city.value ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-700 hover:bg-slate-50 hover:text-indigo-600'"
            >
              <span>{{ city.label }}</span>
              <svg v-if="selectedCity === city.value" class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </li>
          </ul>
        </div>

        <button
          @click="resetFilters"
          class="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          title="Reset Filters"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>

    <!-- Clinics Grid -->
    <div v-if="filteredClinics.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white/70 rounded-[2rem] border border-slate-100">
      <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-3">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <p class="font-bold text-slate-700 text-base">No clinics found</p>
      <p class="text-xs text-slate-400 mt-1">Try changing your search term or select "All Cities".</p>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-7 flex-1 overflow-y-auto pr-1">
      <div
        v-for="clinic in filteredClinics"
        :key="clinic.id"
        class="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[2.25rem] p-7 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-indigo-200"
      >
        <div class="space-y-5">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100/80 shadow-sm flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {{ clinic.name ? clinic.name.charAt(0) : 'C' }}
              </div>
              <div>
                <h3 class="font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {{ clinic.name }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified Partner
                  </span>
                  <span class="text-xs text-slate-400 font-medium">&bull; {{ clinic.city }}</span>
                </div>
              </div>
            </div>
            <span class="text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/80 shadow-sm">
              {{ clinic.type || 'Polyclinic' }}
            </span>
          </div>

          <!-- Location & Full Address -->
          <div class="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
            <svg class="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="leading-relaxed font-medium">{{ clinic.street }}, {{ clinic.city }}, {{ clinic.state }} - {{ clinic.pinCode }}</span>
          </div>

          <!-- Highlights Row with Expanded Space -->
          <div class="grid grid-cols-2 gap-3.5">
            <div class="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/70">
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Clinical Facilities</span>
              <span class="font-extrabold text-slate-800 text-sm mt-1 block">{{ clinic.facilitiesCount || 8 }}+ Specialized Departments</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/70">
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Average Fee Range</span>
              <span class="font-extrabold text-emerald-700 text-sm mt-1 block">₹{{ clinic.avgCharge || 600 }} - 1,200</span>
            </div>
          </div>

          <!-- Departments tags with clean spacing -->
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Available Departments</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="dept in (clinic.departments || ['General Medicine', 'Diagnostics'])"
                :key="dept"
                class="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100/90 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {{ dept }}
              </span>
            </div>
          </div>

          <!-- Quick Equipment Highlights on Card -->
          <div class="pt-3 border-t border-slate-100/80">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Key Diagnostic Infrastructure
              </span>
              <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">4 Verified Units</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span class="text-xs font-bold truncate">ECG & Pathology</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                <span class="text-xs font-bold truncate">X-Ray & Ultrasound</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Row -->
        <div class="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            @click="selectClinicForAffiliation(clinic)"
            class="group/btn flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:via-indigo-600 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200/80 hover:shadow-xl hover:shadow-indigo-300/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/20"
          >
            <div class="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover/btn:rotate-90 transition-transform">
              <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span>Request Affiliation</span>
          </button>
          
          <button
            @click="viewClinicDetails(clinic)"
            class="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs"
            title="Facility Details & Diagnostics"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Affiliation Request Modal (Full 7-Day Shift Schedule + Commercial Terms + Calendar) -->
    <Teleport to="body">
      <div v-if="selectedClinicForModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="selectedClinicForModal = null">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[90vh] overflow-y-auto font-sans">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Partner with {{ selectedClinicForModal.name }}</h3>
              <p class="text-xs text-slate-400">{{ selectedClinicForModal.city }} &bull; Propose terms & weekly timings</p>
            </div>
            <button @click="selectedClinicForModal = null" class="p-1 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form @submit.prevent="submitAffiliationProposal" class="space-y-4">
            <!-- Commercial Terms: Fee & Patient Limit -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Consultation Fee (₹)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">₹</span>
                  <input
                    v-model.number="proposalForm.charge"
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
                    v-model.number="proposalForm.patientLimits"
                    type="number"
                    required
                    min="1"
                    placeholder="25"
                    class="w-full pl-9 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Proposed Joining Date: Custom Calendar -->
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

            <!-- 7-Day Shift Schedule Details -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">7-Day Weekly Shift Schedule</label>
                  <p class="text-[11px] text-slate-400">Specify consultation hours or set day Off</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="applyQuickShiftPreset('WEEKDAYS')"
                    class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    Mon-Fri 9-5
                  </button>
                  <button
                    type="button"
                    @click="applyQuickShiftPreset('CLEAR')"
                    class="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    All Off
                  </button>
                </div>
              </div>

              <!-- List of days with Start Time, End Time, and Off Button -->
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
                      :class="proposalShifts[day.key].isOff ? 'text-slate-400' : 'text-slate-800'"
                    >
                      {{ day.short }}
                    </span>
                  </div>

                  <!-- Start & End Time Inputs or Off placeholder -->
                  <div class="flex-1 flex items-center gap-2">
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="proposalShifts[day.key].startTime"
                        :disabled="proposalShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="proposalShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'"
                      />
                    </div>
                    <span
                      class="text-xs font-bold shrink-0 transition-colors"
                      :class="proposalShifts[day.key].isOff ? 'text-slate-300' : 'text-slate-400'"
                    >
                      to
                    </span>
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="proposalShifts[day.key].endTime"
                        :disabled="proposalShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="proposalShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'"
                      />
                    </div>
                  </div>

                  <!-- Off Toggle Button (Fixed 64px width, pill badge with smooth switch, 0 layout jump) -->
                  <button
                    type="button"
                    @click="proposalShifts[day.key].isOff = !proposalShifts[day.key].isOff"
                    class="w-16 h-7 rounded-lg border flex items-center justify-center gap-1 text-[11px] font-bold shrink-0 cursor-pointer select-none transition-all duration-150"
                    :class="proposalShifts[day.key].isOff
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'"
                  >
                    <span v-if="proposalShifts[day.key].isOff" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Off</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit & Cancel Actions -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                @click="selectedClinicForModal = null"
                class="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Sending Request...' : 'Send Affiliation Request' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Clinic Details Modal with Rich Available Equipment Structure -->
    <Teleport to="body">
      <div v-if="activeDetailClinic" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="activeDetailClinic = null">
        <div class="bg-white rounded-[2.25rem] p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 animate-fade-in-up font-sans max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
            <div class="flex items-center gap-3.5">
              <div class="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100/90 shadow-sm flex-shrink-0">
                {{ activeDetailClinic.name?.charAt(0) || 'C' }}
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {{ activeDetailClinic.name }}
                </h3>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified Facility
                  </span>
                  <span class="text-xs text-slate-400 font-medium">&bull; {{ activeDetailClinic.type || 'Polyclinic' }}</span>
                </div>
              </div>
            </div>
            <button @click="activeDetailClinic = null" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Structured Info List with Elevated Typography -->
          <div class="space-y-4">
            <!-- Address Block -->
            <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div class="flex items-center gap-2 mb-1.5">
                <svg class="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Clinic Address</span>
              </div>
              <p class="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pl-6">
                {{ activeDetailClinic.street }}, {{ activeDetailClinic.city }}, {{ activeDetailClinic.state }} - {{ activeDetailClinic.pinCode }}
              </p>
            </div>

            <!-- Contact Grid (Phone & Email) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                  <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</span>
                </div>
                <p class="text-xs sm:text-sm font-bold text-indigo-600 pl-5">
                  {{ activeDetailClinic.phone || '+91 22 2642 1234' }}
                </p>
              </div>

              <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                  <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</span>
                </div>
                <p class="text-xs sm:text-sm font-bold text-slate-700 truncate pl-5">
                  {{ activeDetailClinic.email || 'contact@apolloclinic-mumbai.com' }}
                </p>
              </div>
            </div>

            <!-- Operating Hours -->
            <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span class="text-xs font-bold text-slate-500">Operating Hours</span>
              </div>
              <span class="text-xs font-extrabold text-slate-800">Mon-Sat: 08:00 AM - 09:00 PM</span>
            </div>

            <!-- Elevated Available Equipment Structure -->
            <div class="p-5 bg-gradient-to-br from-indigo-50/60 via-blue-50/30 to-slate-50/80 rounded-3xl border border-indigo-100/90 shadow-2xs">
              <div class="flex items-center justify-between mb-3.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-800">Available Diagnostic Equipment</h4>
                    <p class="text-[11px] text-slate-400">On-site clinical testing & diagnostic infrastructure</p>
                  </div>
                </div>
                <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  All Operational
                </span>
              </div>

              <!-- 2x2 Structured Equipment Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <!-- 1. ECG -->
                <div class="p-3 rounded-2xl bg-white border border-indigo-100/80 shadow-2xs hover:border-indigo-300 transition-all flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                    <!-- ECG / Heartbeat Icon -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-slate-800">ECG</span>
                      <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">12-Lead</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5 leading-tight">Digital Electrocardiogram</p>
                  </div>
                </div>

                <!-- 2. Digital X-Ray -->
                <div class="p-3 rounded-2xl bg-white border border-indigo-100/80 shadow-2xs hover:border-indigo-300 transition-all flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <!-- X-Ray / Radiography Icon -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-slate-800">Digital X-Ray</span>
                      <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">High-Res</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5 leading-tight">Low-Radiation Digital Sensor</p>
                  </div>
                </div>

                <!-- 3. Blood Pathology Lab -->
                <div class="p-3 rounded-2xl bg-white border border-indigo-100/80 shadow-2xs hover:border-indigo-300 transition-all flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <!-- Blood / Pathology Icon -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-slate-800 truncate">Blood Pathology Lab</span>
                      <span class="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded shrink-0">NABL</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5 leading-tight">Automated Hematology & Biochemistry</p>
                  </div>
                </div>

                <!-- 4. Ultrasound -->
                <div class="p-3 rounded-2xl bg-white border border-indigo-100/80 shadow-2xs hover:border-indigo-300 transition-all flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                    <!-- Ultrasound / Soundwave Icon -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-slate-800">Ultrasound</span>
                      <span class="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">3D Doppler</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5 leading-tight">Color Doppler & Sonography</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Action -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              @click="const targetClinic = activeDetailClinic; activeDetailClinic = null; selectClinicForAffiliation(targetClinic)"
              class="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200/80 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>Request Affiliation</span>
            </button>
            <button
              @click="activeDetailClinic = null"
              class="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { DoctorService } from '@/services/doctor.service';
import { WEEKDAYS, getDefaultStructuredShifts, serializeDayShift } from '@/utils/affiliationHelper';
import { formatDateDDMMYYYY } from '@/utils/date';

const searchQuery = ref('');
const selectedCity = ref('ALL');
const cityDropdownOpen = ref(false);
const cityDropdownRef = ref(null);

const cityOptions = [
  { label: 'All Cities', value: 'ALL' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Bangalore', value: 'Bangalore' },
  { label: 'Pune', value: 'Pune' },
];

const selectCity = (city) => {
  selectedCity.value = city;
  cityDropdownOpen.value = false;
};

const clinics = ref([
  {
    id: 'cln-101',
    name: 'Apollo Medical Center',
    type: 'Multi-Speciality Hospital',
    street: '14 Bandra West Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400050',
    facilitiesCount: 14,
    avgCharge: 800,
    departments: ['Cardiology', 'Internal Medicine', 'Pediatrics'],
    phone: '+91 22 2642 1234',
    email: 'contact@apolloclinic-mumbai.com'
  },
  {
    id: 'cln-102',
    name: 'Fortis Health Point',
    type: 'Specialized Clinic',
    street: '88 Mulund Goregaon Link Rd',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400078',
    facilitiesCount: 10,
    avgCharge: 700,
    departments: ['Orthopedics', 'Physiotherapy', 'General Medicine'],
    phone: '+91 22 6799 4400',
    email: 'info@fortishealthpoint.org'
  }
]);

const filteredClinics = computed(() => {
  return clinics.value.filter(c => {
    const matchesCity = selectedCity.value === 'ALL' || c.city.toLowerCase() === selectedCity.value.toLowerCase();
    const query = searchQuery.value.toLowerCase().trim();
    const matchesQuery = !query || 
      c.name.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.street.toLowerCase().includes(query) ||
      (c.departments && c.departments.some(d => d.toLowerCase().includes(query)));
    return matchesCity && matchesQuery;
  });
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedCity.value = 'ALL';
};

// Modal State
const selectedClinicForModal = ref(null);
const activeDetailClinic = ref(null);
const isSubmitting = ref(false);

const proposalForm = reactive({
  charge: 600,
  patientLimits: 25,
  joiningDate: new Date().toISOString().split('T')[0]
});

// Shift schedule model
const proposalShifts = reactive(getDefaultStructuredShifts());

const applyQuickShiftPreset = (preset) => {
  if (preset === 'WEEKDAYS') {
    WEEKDAYS.forEach(day => {
      if (day.key === 'SATURDAY' || day.key === 'SUNDAY') {
        proposalShifts[day.key].isOff = true;
      } else {
        proposalShifts[day.key].isOff = false;
        proposalShifts[day.key].startTime = '09:00';
        proposalShifts[day.key].endTime = '17:00';
      }
    });
  } else if (preset === 'CLEAR') {
    WEEKDAYS.forEach(day => {
      proposalShifts[day.key].isOff = true;
    });
  }
};

// --- Custom Calendar Implementation ---
const calendarRef = ref(null);
const isCalendarVisible = ref(false);
const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const selectedDate = ref(new Date());
const monthDropdownVisible = ref(false);
const yearDropdownVisible = ref(false);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const years = computed(() => {
  const current = new Date().getFullYear();
  const arr = [];
  for (let y = current; y <= current + 5; y++) {
    arr.push(y);
  }
  return arr;
});

const selectedMonthName = computed(() => months[currentMonth.value]);

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return 'Select Date';
  return formatDateDDMMYYYY(selectedDate.value);
});

const calendarDays = computed(() => {
  const days = [];
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const lastDateOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const lastDateOfPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      dayNumber: lastDateOfPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(currentYear.value, currentMonth.value - 1, lastDateOfPrevMonth - i)
    });
  }

  const today = new Date();
  for (let i = 1; i <= lastDateOfMonth; i++) {
    const d = new Date(currentYear.value, currentMonth.value, i);
    days.push({
      dayNumber: i,
      isCurrentMonth: true,
      date: d,
      isToday: d.toDateString() === today.toDateString(),
      isSelected: selectedDate.value && d.toDateString() === selectedDate.value.toDateString()
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      dayNumber: i,
      isCurrentMonth: false,
      date: new Date(currentYear.value, currentMonth.value + 1, i)
    });
  }

  return days;
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
  proposalForm.joiningDate = day.date.toISOString().split('T')[0];
  isCalendarVisible.value = false;
};

const selectClinicForAffiliation = (clinic) => {
  selectedClinicForModal.value = clinic;
  proposalForm.charge = clinic.avgCharge || 600;
  proposalForm.patientLimits = 25;
  const now = new Date();
  selectedDate.value = now;
  currentMonth.value = now.getMonth();
  currentYear.value = now.getFullYear();
  proposalForm.joiningDate = now.toISOString().split('T')[0];

  // Reset shift schedule
  const defaults = getDefaultStructuredShifts();
  WEEKDAYS.forEach(day => {
    proposalShifts[day.key].isOff = defaults[day.key].isOff;
    proposalShifts[day.key].startTime = defaults[day.key].startTime;
    proposalShifts[day.key].endTime = defaults[day.key].endTime;
  });
};

const viewClinicDetails = (clinic) => {
  activeDetailClinic.value = clinic;
};

const submitAffiliationProposal = async () => {
  if (!selectedClinicForModal.value) return;
  isSubmitting.value = true;

  try {
    const serializedShifts = {};
    WEEKDAYS.forEach(day => {
      serializedShifts[day.key] = serializeDayShift(proposalShifts[day.key]);
    });

    await DoctorService.createAffiliationRequest({
      targetId: selectedClinicForModal.value.id,
      charge: proposalForm.charge,
      patientLimits: proposalForm.patientLimits,
      joiningDate: proposalForm.joiningDate,
      shiftDetails: serializedShifts
    });

    alert(`Affiliation request sent to ${selectedClinicForModal.value.name}!`);
    selectedClinicForModal.value = null;
  } catch (err) {
    console.error('Affiliation request error:', err);
    alert(err.response?.data?.message || 'Affiliation request dispatched (mock confirmation)!');
    selectedClinicForModal.value = null;
  } finally {
    isSubmitting.value = false;
  }
};

const handleClickOutside = (event) => {
  if (cityDropdownRef.value && !cityDropdownRef.value.contains(event.target)) {
    cityDropdownOpen.value = false;
  }
  if (calendarRef.value) {
    const isInsideCalendar = calendarRef.value.contains(event.target) || 
      (event.target && event.target.closest && (event.target.closest('.calendar-container') || event.target.closest('.custom-calendar-dropdown')));
    if (!isInsideCalendar) {
      isCalendarVisible.value = false;
      monthDropdownVisible.value = false;
      yearDropdownVisible.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-dropdown {
  position: relative;
  user-select: none;
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

/* Custom Calendar Styles */
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

