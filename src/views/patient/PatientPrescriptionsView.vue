<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40">
    <!-- Header with Back & Search -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/dashboard/patient" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Prescriptions
          </h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/70 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            {{ filteredPrescriptions.length }} Active
          </span>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Review your active medications, dosages, schedule timelines, and prescribing physicians.</p>
      </div>

      <!-- Controls & Search -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search medicine or doctor..."
            class="pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700 placeholder-slate-400 w-44 sm:w-60"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Custom Luxury Interactive Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            type="button"
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center gap-2.5 pl-3.5 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200/80 bg-white/95 text-slate-700 shadow-sm hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all cursor-pointer backdrop-blur-md group"
            :class="{ 'ring-2 ring-indigo-500/20 border-indigo-500 shadow-indigo-500/10': isDropdownOpen }"
          >
            <span class="w-2 h-2 rounded-full" :class="selectedStatusColor"></span>
            <span class="text-slate-700">{{ selectedStatusLabel }}</span>
            <svg
              class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200"
              :class="{ 'rotate-180 text-indigo-600': isDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Popover Menu -->
          <transition
            enter-active-class="transition duration-150 ease-out origin-top-right"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in origin-top-right"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-900/10 p-1.5 z-30 space-y-0.5"
            >
              <button
                v-for="opt in statusOptions"
                :key="opt.value"
                @click="selectStatus(opt.value)"
                type="button"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left group"
                :class="statusFilter === opt.value ? 'bg-indigo-50/80 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
              >
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full" :class="opt.dotClass"></span>
                  <span>{{ opt.label }}</span>
                </div>
                <svg
                  v-if="statusFilter === opt.value"
                  class="w-4 h-4 text-indigo-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Error Message Banner -->
    <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-semibold">{{ errorMessage }}</span>
      </div>
      <button @click="loadPrescriptions" class="text-xs font-bold underline hover:text-rose-900 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-28 bg-white/60 animate-pulse rounded-2xl border border-slate-200/60"></div>
    </div>

    <!-- Prescriptions Content -->
    <div v-else-if="filteredPrescriptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="med in filteredPrescriptions"
        :key="med.id"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
      >
        <div>
          <!-- Header: Icon, Name, Dosage & Actions -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 flex-shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {{ med.name }}
                </h3>
                <p class="text-xs font-semibold text-slate-500">
                  {{ med.dosage }} &bull; {{ med.frequency }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Quick Date Picker Trigger next to each medication card -->
              <button
                type="button"
                @click="openStartDateModal(med)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/90 rounded-lg transition-all border border-indigo-200/80 shadow-xs"
                :title="med.startedAt ? 'Change start date' : 'Set medication start date'"
              >
                <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ med.startedAt ? 'Date' : 'Start Date' }}</span>
              </button>
            </div>
          </div>

          <!-- Prescription Details Grid -->
          <div class="grid grid-cols-2 gap-2 mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Prescribed By</p>
              <p class="font-bold text-slate-700 mt-0.5 truncate">{{ med.doctorName || 'Attending Physician' }}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</p>
              <p class="font-bold text-slate-700 mt-0.5">
                {{ formatDuration(med.durationValue, med.durationUnit) }}
              </p>
            </div>
          </div>

          <!-- Interactive "Log Start Date" Prompt if not yet started -->
          <div
            v-if="!med.startedAt"
            class="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 text-xs text-amber-800 font-medium">
              <svg class="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>When did you start taking this medicine?</span>
            </div>
            <button
              @click="openStartDateModal(med)"
              class="px-2.5 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-sm flex-shrink-0"
            >
              Log Start Date
            </button>
          </div>

          <!-- Schedule Timetable if Start Date is logged: Two Divided Portions -->
          <div v-else class="mt-3.5 grid grid-cols-2 gap-2">
            <!-- Started Date Portion (Editable) -->
            <div class="relative flex flex-col justify-between p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group/date">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Started
                </span>
                <button
                  type="button"
                  @click="openStartDateModal(med)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white rounded-lg border border-slate-200 hover:border-indigo-600 shadow-sm transition-all duration-200 group/btn"
                  title="Edit Start Date"
                >
                  <svg class="w-3 h-3 text-indigo-500 group-hover/btn:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit</span>
                </button>
              </div>
              <p class="font-extrabold text-xs text-slate-800 mt-1">
                {{ new Date(med.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </p>
            </div>

            <!-- Ends Date Portion (Calculated) -->
            <div class="flex flex-col justify-between p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Ends
              </span>
              <p class="font-extrabold text-xs text-slate-800 mt-1">
                {{ med.endDate ? new Date(med.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Card Footer with Dynamic Live Adherence Badge -->
        <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
          <span>Issued: {{ med.issuedAt ? new Date(med.issuedAt).toLocaleDateString() : 'Active' }}</span>
          
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm"
              :class="getAdherenceStatus(med).badgeClass"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="getAdherenceStatus(med).dotClass"></span>
              <span>{{ getAdherenceStatus(med).label }}</span>
              <span v-if="getAdherenceStatus(med).subText && getAdherenceStatus(med).code === 'ACTIVE'" class="text-[10px] opacity-75 font-medium ml-0.5">
                ({{ getAdherenceStatus(med).subText }})
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 px-4 my-auto">
      <div class="w-16 h-16 bg-teal-100/70 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-200/60 shadow-sm">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800">No prescriptions found</h3>
      <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
        {{ searchQuery ? 'No prescriptions match your search term.' : 'You have no active medications or prescriptions recorded.' }}
      </p>
      <router-link
        to="/dashboard/patient"
        class="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all"
      >
        Back to Dashboard
      </router-link>
    </div>

    <!-- Log Start Date Interactive Modal Dialog (Teleported to body with high z-index to place navbar in background) -->
    <Teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showStartDateModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
          @click.self="closeStartDateModal"
        >
          <div class="bg-white rounded-[2rem] p-6 sm:p-7 max-w-md w-full shadow-2xl shadow-indigo-950/30 border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80 shadow-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-slate-800">Edit Start Date</h3>
                  <p class="text-[11px] font-semibold text-slate-400">Medication Course Schedule</p>
                </div>
              </div>
              <button
                @click="closeStartDateModal"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Medication Context Card -->
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-extrabold text-slate-800">{{ activeMedToLog?.name }}</p>
                <p class="text-[11px] text-slate-500 font-medium">{{ activeMedToLog?.dosage }} &bull; {{ activeMedToLog?.frequency }}</p>
              </div>
              <div v-if="activeMedToLog?.durationValue" class="text-right">
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Duration</span>
                <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {{ formatDuration(activeMedToLog.durationValue, activeMedToLog.durationUnit) }}
                </span>
              </div>
            </div>

            <!-- Custom Modern Calendar Date Picker -->
            <div class="space-y-3">
              <!-- Calendar Month Navigator Header -->
              <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-extrabold text-slate-800 tracking-tight">
                    {{ currentCalendarMonthName }} {{ currentCalendarYear }}
                  </span>
                  <button
                    type="button"
                    @click="goToToday"
                    class="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200/60 transition-colors"
                  >
                    Today
                  </button>
                </div>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="prevMonth"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/70 transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="nextMonth"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/70 transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Calendar Grid Container -->
              <div class="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80">
                <!-- Day of week headers -->
                <div class="grid grid-cols-7 gap-1 text-center mb-1.5">
                  <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d" class="text-[10px] font-bold text-slate-400 uppercase">
                    {{ d }}
                  </span>
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                  <button
                    v-for="(day, idx) in calendarDays"
                    :key="idx"
                    type="button"
                    :disabled="!day.inCurrentMonth"
                    @click="selectDate(day.dateStr)"
                    class="h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all relative"
                    :class="[
                      !day.inCurrentMonth ? 'text-slate-300 opacity-25 cursor-not-allowed pointer-events-none' : '',
                      selectedStartDate === day.dateStr 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300 scale-105' 
                        : (day.isToday ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100' : 'text-slate-700 hover:bg-white hover:shadow-sm')
                    ]"
                  >
                    <span>{{ day.dayNumber }}</span>
                    <span v-if="day.isToday && selectedStartDate !== day.dateStr" class="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600"></span>
                  </button>
                </div>
              </div>

              <!-- Quick Selection Pills -->
              <div class="flex items-center gap-2 pt-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick set:</span>
                <button
                  type="button"
                  @click="setQuickDate(0)"
                  class="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all"
                  :class="isQuickSelected(0) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                >
                  Today
                </button>
                <button
                  type="button"
                  @click="setQuickDate(-1)"
                  class="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all"
                  :class="isQuickSelected(-1) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  @click="setQuickDate(-2)"
                  class="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all"
                  :class="isQuickSelected(-2) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                >
                  2 days ago
                </button>
              </div>

              <!-- Selected Date Preview & Calculation Preview -->
              <div class="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <div>
                  <span class="text-slate-500 font-medium block text-[10px]">Selected Start:</span>
                  <span class="font-extrabold text-indigo-900">
                    {{ new Date(selectedStartDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </span>
                </div>
                <div v-if="previewCalculatedEndDate" class="text-right">
                  <span class="text-slate-500 font-medium block text-[10px]">Recalculated End:</span>
                  <span class="font-extrabold text-indigo-900">
                    {{ new Date(previewCalculatedEndDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                @click="closeStartDateModal"
                class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="saveStartDate"
                :disabled="isSavingStartDate"
                class="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
              >
                <svg v-if="isSavingStartDate" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>{{ isSavingStartDate ? 'Updating...' : 'Update & Save' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { PatientService } from '@/services/patient.service';

const authStore = useAuthStore();
const isLoading = ref(true);
const prescriptions = ref([]);
const searchQuery = ref('');
const statusFilter = ref('ALL');
const errorMessage = ref('');

// Custom Dropdown State & Options
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const statusOptions = [
  { value: 'ALL', label: 'All Status', dotClass: 'bg-indigo-500' },
  { value: 'ACTIVE', label: 'Active Courses', dotClass: 'bg-emerald-500' },
  { value: 'NOT_STARTED', label: 'Not Started', dotClass: 'bg-slate-400' },
  { value: 'COMPLETED', label: 'Completed', dotClass: 'bg-blue-500' }
];

const selectedStatusOption = computed(() => {
  return statusOptions.find(o => o.value === statusFilter.value) || statusOptions[0];
});

const selectedStatusLabel = computed(() => selectedStatusOption.value.label);
const selectedStatusColor = computed(() => selectedStatusOption.value.dotClass);

const selectStatus = (val) => {
  statusFilter.value = val;
  isDropdownOpen.value = false;
};

// Outside click handler to close dropdown
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

/**
 * 1. Display Format / Pluralization Helper
 */
function formatDuration(value, unit) {
  if (!unit || unit === 'ONGOING') return 'Ongoing';
  if (!value) return '';
  const isPlural = Number(value) > 1;
  const labels = {
    DAY: isPlural ? 'Days' : 'Day',
    WEEK: isPlural ? 'Weeks' : 'Week',
    MONTH: isPlural ? 'Months' : 'Month',
    YEAR: isPlural ? 'Years' : 'Year'
  };
  return `${value} ${labels[unit] || unit}`;
}

/**
 * Helper to compute calculated End Date from start date and duration
 */
function computeEndDate(startDateStr, durationValue, durationUnit) {
  if (!startDateStr || !durationValue || !durationUnit || durationUnit === 'ONGOING') return null;
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return null;

  const end = new Date(start);
  const val = Number(durationValue);
  if (durationUnit === 'DAY') end.setDate(end.getDate() + val);
  else if (durationUnit === 'WEEK') end.setDate(end.getDate() + (val * 7));
  else if (durationUnit === 'MONTH') end.setMonth(end.getMonth() + val);
  else if (durationUnit === 'YEAR') end.setFullYear(end.getFullYear() + val);
  
  return end.toISOString().split('T')[0];
}

/**
 * 2. Dynamic isActive and Status Badge computation
 */
function getAdherenceStatus(med) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startedAt = med.startedAt ? new Date(med.startedAt) : null;
  if (startedAt) startedAt.setHours(0, 0, 0, 0);

  const effectiveEndDateStr = med.endDate || (startedAt ? computeEndDate(med.startedAt, med.durationValue, med.durationUnit) : null);
  const endDate = effectiveEndDateStr ? new Date(effectiveEndDateStr) : null;
  if (endDate) endDate.setHours(23, 59, 59, 999);

  // 1. Not Started Yet: If today < startedAt (or startedAt is not yet logged)
  if (!startedAt) {
    return {
      code: 'NOT_STARTED',
      label: 'Not Started',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      dotClass: 'bg-slate-400',
      subText: 'Requires start date'
    };
  }

  if (today < startedAt) {
    const startFormatted = startedAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      code: 'STARTS_SOON',
      label: `Starts on ${startFormatted}`,
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotClass: 'bg-amber-500',
      subText: 'Scheduled'
    };
  }

  // 2. Completed / Expired: If endDate && today > endDate
  if (endDate && today > endDate) {
    return {
      code: 'COMPLETED',
      label: 'Course Completed',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      dotClass: 'bg-blue-500',
      subText: 'Completed'
    };
  }

  // 3. Currently Active: If today >= startedAt && (!endDate || today <= endDate)
  let remainingText = '';
  if (endDate) {
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 14) {
      const weeks = Math.round(diffDays / 7);
      remainingText = `${weeks} ${weeks > 1 ? 'weeks' : 'week'} left`;
    } else {
      remainingText = `${diffDays} ${diffDays !== 1 ? 'days' : 'day'} left`;
    }
  }

  return {
    code: 'ACTIVE',
    label: 'Active',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500 animate-pulse',
    subText: remainingText ? `${remainingText}` : 'Ongoing course'
  };
}

/**
 * 3. Patient "Log Start Date" Action & Interactive Calendar State
 */
const showStartDateModal = ref(false);
const activeMedToLog = ref(null);
const selectedStartDate = ref(new Date().toISOString().split('T')[0]);
const isSavingStartDate = ref(false);

// Interactive Calendar Month Navigation
const calendarCurrentDate = ref(new Date());

const currentCalendarYear = computed(() => calendarCurrentDate.value.getFullYear());
const currentCalendarMonth = computed(() => calendarCurrentDate.value.getMonth());

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentCalendarMonthName = computed(() => monthNames[currentCalendarMonth.value]);

const prevMonth = () => {
  const d = new Date(calendarCurrentDate.value);
  d.setMonth(d.getMonth() - 1);
  calendarCurrentDate.value = d;
};

const nextMonth = () => {
  const d = new Date(calendarCurrentDate.value);
  d.setMonth(d.getMonth() + 1);
  calendarCurrentDate.value = d;
};

const goToToday = () => {
  calendarCurrentDate.value = new Date();
  selectDate(new Date().toISOString().split('T')[0]);
};

// Generate 42 calendar grid cells (prev month padding, current month days, next month padding)
const calendarDays = computed(() => {
  const year = currentCalendarYear.value;
  const month = currentCalendarMonth.value;

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];
  const days = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = prevDate.toISOString().split('T')[0];
    days.push({
      dayNumber: dayNum,
      dateStr,
      inCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(year, month, d);
    const yyyy = currDate.getFullYear();
    const mm = String(currDate.getMonth() + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    days.push({
      dayNumber: d,
      dateStr,
      inCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Next month leading days to complete the 35 or 42 grid cells
  const remainingCells = 42 - days.length;
  for (let n = 1; n <= remainingCells; n++) {
    const nextDate = new Date(year, month + 1, n);
    const dateStr = nextDate.toISOString().split('T')[0];
    days.push({
      dayNumber: n,
      dateStr,
      inCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  return days;
});

const selectDate = (dateStr) => {
  selectedStartDate.value = dateStr;
};

// Quick Date Selection Helpers
const getOffsetDateStr = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const setQuickDate = (offsetDays) => {
  const targetStr = getOffsetDateStr(offsetDays);
  selectedStartDate.value = targetStr;
  calendarCurrentDate.value = new Date(targetStr);
};

const isQuickSelected = (offsetDays) => {
  return selectedStartDate.value === getOffsetDateStr(offsetDays);
};

// Preview of Recalculated End Date in the modal
const previewCalculatedEndDate = computed(() => {
  if (!activeMedToLog.value || !selectedStartDate.value) return null;
  return computeEndDate(
    selectedStartDate.value,
    activeMedToLog.value.durationValue,
    activeMedToLog.value.durationUnit
  );
});

const openStartDateModal = (med) => {
  activeMedToLog.value = med;
  const initialDate = med.startedAt || new Date().toISOString().split('T')[0];
  selectedStartDate.value = initialDate;
  calendarCurrentDate.value = new Date(initialDate);
  showStartDateModal.value = true;
};

const closeStartDateModal = () => {
  showStartDateModal.value = false;
  activeMedToLog.value = null;
};

const saveStartDate = async () => {
  if (!activeMedToLog.value || !selectedStartDate.value) return;
  isSavingStartDate.value = true;

  try {
    const med = activeMedToLog.value;
    const startStr = selectedStartDate.value;

    // Call service to persist to backend: PATCH /api/prescriptions/${prescription.id}/start-date
    // The server recalculates and returns endDate directly in the response
    const response = await PatientService.logPrescriptionStartDate(med.id, startStr);

    // Immediate Feedback: Use response.endDate directly if returned by server
    const serverEndDate = response?.endDate || response?.data?.endDate;
    const finalEndDate = serverEndDate || computeEndDate(startStr, med.durationValue, med.durationUnit);

    // Update in-memory local state immediately
    med.startedAt = startStr;
    if (finalEndDate) {
      med.endDate = finalEndDate;
    }

    // Persist in local storage cache so it remains consistent across views/refreshes
    const cachedStartDates = JSON.parse(localStorage.getItem('khoj_prescriptions_started_at') || '{}');
    cachedStartDates[med.id] = { startedAt: startStr, endDate: finalEndDate };
    localStorage.setItem('khoj_prescriptions_started_at', JSON.stringify(cachedStartDates));

    closeStartDateModal();
  } catch (err) {
    console.warn('Error saving start date:', err);
  } finally {
    isSavingStartDate.value = false;
  }
};

const filteredPrescriptions = computed(() => {
  return prescriptions.value.filter(med => {
    const matchesSearch = !searchQuery.value ||
      (med.name && med.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (med.doctorName && med.doctorName.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const statusObj = getAdherenceStatus(med);

    const matchesStatus = statusFilter.value === 'ALL' ||
      (statusFilter.value === 'ACTIVE' && statusObj.code === 'ACTIVE') ||
      (statusFilter.value === 'NOT_STARTED' && (statusObj.code === 'NOT_STARTED' || statusObj.code === 'STARTS_SOON')) ||
      (statusFilter.value === 'COMPLETED' && statusObj.code === 'COMPLETED');

    return matchesSearch && matchesStatus;
  });
});

const loadPrescriptions = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const patientId = authStore.user?.userId || authStore.user?.id || '';
    const username = authStore.user?.username || '';
    
    let list = await PatientService.getPrescriptions(patientId, username);

    if (!list || list.length === 0) {
      const dash = await PatientService.getDashboardData(patientId, username);
      list = dash.activePrescriptions || [];
    }

    // Merge any locally logged start dates from localStorage
    const cachedStartDates = JSON.parse(localStorage.getItem('khoj_prescriptions_started_at') || '{}');
    (list || []).forEach(item => {
      if (cachedStartDates[item.id]) {
        if (!item.startedAt) item.startedAt = cachedStartDates[item.id].startedAt;
        if (!item.endDate && cachedStartDates[item.id].endDate) item.endDate = cachedStartDates[item.id].endDate;
      }
    });

    prescriptions.value = list || [];
  } catch (err) {
    console.warn('Error loading prescriptions:', err);
    errorMessage.value = err.message || 'Unable to load prescriptions from server.';
    prescriptions.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadPrescriptions();
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
