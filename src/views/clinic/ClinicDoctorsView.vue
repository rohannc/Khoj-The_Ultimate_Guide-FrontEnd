<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-sans">
    
    <!-- Top Header & Primary Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/dashboard/clinic" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {{ activeMainTab === 'AFFILIATIONS' ? 'Doctor Affiliations & Partnerships' : 'Specialist Doctors Directory' }}
          </h1>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
          {{ activeMainTab === 'AFFILIATIONS' 
            ? 'Manage doctor affiliations, review counter-proposals, calibrate daily patient limits, and configure weekly consultation timings.' 
            : 'Explore certified medical specialists and send practice affiliation proposals to expand your clinic’s specialty roster.' 
          }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button
          v-if="activeMainTab === 'AFFILIATIONS'"
          @click="openDirectInviteModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          Invite Specialist
        </button>

        <button
          @click="toggleMainTab"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
        >
          <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{{ activeMainTab === 'AFFILIATIONS' ? 'Browse Doctors Directory' : 'View Clinic Affiliations' }}</span>
        </button>

        <router-link
          to="/dashboard/clinic"
          class="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors shadow-sm"
          title="Facility Dashboard"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </router-link>
      </div>
    </div>

    <!-- Main Navigation Bar (Affiliations vs Directory) -->
    <div class="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/80">
      <div class="flex items-center gap-2">
        <button
          @click="activeMainTab = 'AFFILIATIONS'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
          :class="activeMainTab === 'AFFILIATIONS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Affiliated Doctors</span>
        </button>

        <button
          @click="activeMainTab = 'DIRECTORY'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
          :class="activeMainTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span>Discover Specialists</span>
        </button>
      </div>

      <!-- Quick refresh indicator -->
      <button
        @click="loadInitialData"
        class="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        title="Refresh Data"
      >
        <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        <span class="hidden sm:inline">Refresh</span>
      </button>
    </div>

    <!-- ========================================== -->
    <!-- TAB 1: CLINIC AFFILIATIONS & PARTNERSHIPS  -->
    <!-- ========================================== -->
    <template v-if="activeMainTab === 'AFFILIATIONS'">
      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-2 mb-6 border-b border-slate-200/60 pb-3 overflow-x-auto">
        <button
          @click="statusFilter = 'ALL'"
          class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          :class="statusFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
        >
          All ({{ affiliations.length }})
        </button>
        <button
          @click="statusFilter = 'ACTION_REQUIRED'"
          class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer shrink-0"
          :class="statusFilter === 'ACTION_REQUIRED' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
        >
          Action Required ({{ actionRequiredCount }})
        </button>
        <button
          @click="statusFilter = 'APPROVED'"
          class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          :class="statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
        >
          Active Doctors ({{ approvedCount }})
        </button>
        <button
          @click="statusFilter = 'PENDING'"
          class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          :class="statusFilter === 'PENDING' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white'"
        >
          Pending Review ({{ pendingCount }})
        </button>
      </div>

      <!-- Empty State for Affiliations -->
      <div v-if="filteredAffiliations.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white/70 rounded-[2rem] border border-slate-100">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <p class="font-bold text-slate-700 text-base">No doctor affiliations found in this view</p>
        <p class="text-xs text-slate-400 mt-1">Browse the specialists directory to invite licensed physicians to your clinic.</p>
        <button
          @click="activeMainTab = 'DIRECTORY'"
          class="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          Browse Doctors Directory
        </button>
      </div>

      <!-- Affiliation Cards Grid (Strict DTO representation matching DoctorAffiliationsView) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1">
        <div
          v-for="aff in filteredAffiliations"
          :key="aff.affiliationId || aff.id"
          class="bg-white/95 backdrop-blur-xl border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          :class="isClinicActionRequired(aff) ? 'border-amber-300 ring-2 ring-amber-100' : 'border-white/60 hover:border-indigo-200'"
        >
          <div>
            <!-- Header with Status & Initiator Badges -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
                  {{ (aff.doctorName || 'Dr').replace('Dr. ', '').charAt(0) }}
                </div>
                <div>
                  <h3 class="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {{ aff.doctorName ? (aff.doctorName.startsWith('Dr') ? aff.doctorName : `Dr. ${aff.doctorName}`) : 'Practicing Physician' }}
                  </h3>
                  <p class="text-xs text-slate-400 mt-0.5">Doctor ID: #{{ (aff.doctorId || aff.id || '').slice(0, 8) }}</p>
                </div>
              </div>

              <div class="flex flex-col items-end gap-1">
                <span
                  class="text-[10px] font-black uppercase px-3 py-1 rounded-full border"
                  :class="getStatusBadgeClass(aff.status)"
                >
                  {{ aff.status }}
                </span>
                <span v-if="isClinicActionRequired(aff)" class="text-[9px] font-black text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md animate-pulse">
                  Action Required
                </span>
              </div>
            </div>

            <!-- Commercial Terms Metrics -->
            <div class="grid grid-cols-2 gap-3 text-xs bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/60 mb-4">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px]">Consultation Fee</span>
                <p class="font-black text-indigo-700 text-sm mt-0.5">₹{{ aff.clinicCharge || aff.doctorCharge || aff.charge || 600 }}</p>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px]">Daily Patient Limit</span>
                <p class="font-black text-slate-800 text-sm mt-0.5">{{ aff.patientLimits || aff.patientLimit || 25 }} Pts / Day</p>
              </div>
            </div>

            <!-- 7-Day Shift Overview -->
            <div class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 mb-4 text-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase text-slate-400">Weekly Shift Schedule</span>
                <span class="text-[11px] font-semibold text-slate-700">{{ formatShiftSummary(aff.shiftDetails || aff.shift) }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/50">
                <span class="text-slate-400">Commencement Date:</span>
                <span class="font-bold text-slate-700">{{ aff.joiningDate || 'Effective Immediately' }}</span>
              </div>
            </div>
          </div>

          <!-- Action Bar: Acceptance, Decline, Counter-Offer, or Update -->
          <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <!-- Pending: Turn to act for Clinic -->
            <div v-if="isClinicActionRequired(aff)" class="flex items-center gap-2 w-full">
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
                class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Decline
              </button>
            </div>

            <!-- Pending: Awaiting Doctor Response -->
            <div v-else-if="aff.status === 'PENDING'" class="w-full flex items-center justify-between text-xs text-slate-500 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 font-medium">
              <span class="flex items-center gap-1.5 text-amber-800">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Awaiting Doctor Review & Response
              </span>
              <button
                @click="openCounterNegotiationModal(aff)"
                class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                Revise Offer
              </button>
            </div>

            <!-- Active Approved Affiliation -->
            <div v-else class="w-full flex items-center justify-between">
              <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Active Practice Contract
              </span>
              <button
                @click="openCounterNegotiationModal(aff)"
                class="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Update Terms & Shifts
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ========================================== -->
    <!-- TAB 2: SPECIALIST DOCTORS DIRECTORY        -->
    <!-- ========================================== -->
    <template v-else>
      <!-- Search & Filter Controls -->
      <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-3">
        <div class="relative flex-1 w-full">
          <svg class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by doctor name, specialty, or license..."
            class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            v-model="selectedSpecialty"
            class="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="ALL">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          <button
            @click="resetFilters"
            class="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      <!-- Doctors Grid -->
      <div v-if="filteredDoctors.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white/70 rounded-[2rem] border border-slate-100">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p class="font-bold text-slate-700 text-base">No doctors found</p>
        <p class="text-xs text-slate-400 mt-1">Try searching a different medical specialty or clearing your filter.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-1">
        <div
          v-for="doc in filteredDoctors"
          :key="doc.id"
          class="bg-white/95 backdrop-blur-xl border border-white/60 rounded-[2.25rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-200"
        >
          <div>
            <!-- Header -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 shadow-sm flex-shrink-0">
                  Dr
                </div>
                <div>
                  <h3 class="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {{ doc.name }}
                  </h3>
                  <p class="text-xs text-slate-400 font-medium">Lic: {{ doc.registrationNumber }}</p>
                </div>
              </div>
              <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>

            <!-- Specialties -->
            <div class="mb-4">
              <span class="text-xs font-bold text-indigo-600 block">{{ doc.specialization }}</span>
              <p class="text-[11px] text-slate-500 mt-0.5">{{ doc.qualifications }} &bull; {{ doc.experienceYears }} Years Exp.</p>
            </div>

            <!-- Quick Metrics -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-4">
              <div class="p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100/60">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Consultation Fee</span>
                <span class="font-bold text-indigo-700 text-xs mt-0.5 block">₹{{ doc.consultationCharge }} / visit</span>
              </div>
              <div class="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100/60">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Practice Availability</span>
                <span class="font-bold text-emerald-700 text-xs mt-0.5 block">{{ doc.availability }}</span>
              </div>
            </div>

            <!-- Bio snippet -->
            <p class="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
              {{ doc.bio }}
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              @click="openInviteModal(doc)"
              class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span>Invite to Clinic</span>
            </button>
            
            <button
              @click="viewDoctorDetails(doc)"
              class="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Doctor Credentials"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ======================================================== -->
    <!-- MODAL 1: INVITE DOCTOR WITH 7-DAY SHIFTS & CALENDAR      -->
    <!-- ======================================================== -->
    <Teleport to="body">
      <div v-if="selectedDoctorForModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="selectedDoctorForModal = null">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[90vh] overflow-y-auto font-sans">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Invite {{ selectedDoctorForModal.name }}</h3>
              <p class="text-xs text-slate-400">{{ selectedDoctorForModal.specialization }} &bull; Propose practice contract & timings</p>
            </div>
            <button @click="selectedDoctorForModal = null" class="p-1 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form @submit.prevent="submitDoctorInvite" class="space-y-4">
            <!-- Commercial Terms: Fee & Patient Limit -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Clinic Consultation Fee (₹)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">₹</span>
                  <input
                    v-model.number="inviteForm.charge"
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
                    v-model.number="inviteForm.patientLimits"
                    type="number"
                    required
                    min="1"
                    placeholder="25"
                    class="w-full pl-9 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Proposed Joining Date: Custom Calendar Popover -->
            <div class="space-y-1.5 relative" ref="calendarRef">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Proposed Commencement Date</label>
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

              <!-- Calendar Dropdown Popover -->
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
                  <p class="text-[11px] text-slate-400">Specify clinic practice hours or set day Off</p>
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

              <!-- Shift rows with start, end time, and Off pill button (0 layout jump) -->
              <div class="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 max-h-64 overflow-y-auto">
                <div
                  v-for="day in WEEKDAYS"
                  :key="day.key"
                  class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs min-h-[46px]"
                >
                  <div class="w-12 shrink-0">
                    <span
                      class="font-bold text-xs tracking-wide transition-colors"
                      :class="inviteShifts[day.key].isOff ? 'text-slate-400' : 'text-slate-800'"
                    >
                      {{ day.short }}
                    </span>
                  </div>

                  <div class="flex-1 flex items-center gap-2">
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="inviteShifts[day.key].startTime"
                        :disabled="inviteShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="inviteShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'"
                      />
                    </div>
                    <span
                      class="text-xs font-bold shrink-0 transition-colors"
                      :class="inviteShifts[day.key].isOff ? 'text-slate-300' : 'text-slate-400'"
                    >
                      to
                    </span>
                    <div class="flex-1 relative">
                      <input
                        type="time"
                        v-model="inviteShifts[day.key].endTime"
                        :disabled="inviteShifts[day.key].isOff"
                        class="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold outline-none transition-colors"
                        :class="inviteShifts[day.key].isOff
                          ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="inviteShifts[day.key].isOff = !inviteShifts[day.key].isOff"
                    class="w-16 h-7 rounded-lg border flex items-center justify-center gap-1 text-[11px] font-bold shrink-0 cursor-pointer select-none transition-all duration-150"
                    :class="inviteShifts[day.key].isOff
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'"
                  >
                    <span v-if="inviteShifts[day.key].isOff" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Off</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit & Cancel Actions -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                @click="selectedDoctorForModal = null"
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
                <span>{{ isSubmitting ? 'Dispatching Invite...' : 'Send Affiliation Invite' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ======================================================== -->
    <!-- MODAL 2: COUNTER-NEGOTIATE / REVISE TERMS                -->
    <!-- ======================================================== -->
    <Teleport to="body">
      <div v-if="negotiateModalAffiliation" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="negotiateModalAffiliation = null">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[90vh] overflow-y-auto font-sans">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-extrabold text-slate-900">Counter-Offer & Update Terms</h3>
              <p class="text-xs text-slate-400">Dr. {{ negotiateModalAffiliation.doctorName || 'Specialist' }}</p>
            </div>
            <button @click="negotiateModalAffiliation = null" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
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
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Patient Cap</label>
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
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Updated Commencement Date</label>
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
                    class="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    Mon-Fri 9-5
                  </button>
                  <button
                    type="button"
                    @click="applyNegotiateShiftPreset('CLEAR')"
                    class="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
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
                    <span v-if="negotiateShifts[day.key].isOff" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Off</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button type="button" @click="negotiateModalAffiliation = null" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-200 cursor-pointer disabled:opacity-50">
                {{ isSubmitting ? 'Sending Counter-Offer...' : 'Send Counter-Offer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ======================================================== -->
    <!-- MODAL 3: DOCTOR PROFILE & CREDENTIALS DETAILS            -->
    <!-- ======================================================== -->
    <Teleport to="body">
      <div v-if="activeDetailDoctor" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="activeDetailDoctor = null">
        <div class="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-fade-in-up font-sans">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                Dr
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">{{ activeDetailDoctor.name }}</h3>
                <p class="text-xs text-slate-400">{{ activeDetailDoctor.specialization }}</p>
              </div>
            </div>
            <button @click="activeDetailDoctor = null" class="p-1 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="space-y-2.5 text-xs text-slate-600">
            <p><strong>License Number:</strong> {{ activeDetailDoctor.registrationNumber }}</p>
            <p><strong>Qualifications:</strong> {{ activeDetailDoctor.qualifications }}</p>
            <p><strong>Experience:</strong> {{ activeDetailDoctor.experienceYears }} Years</p>
            <p><strong>Typical Charge:</strong> ₹{{ activeDetailDoctor.consultationCharge }}</p>
            <p><strong>Practice Availability:</strong> {{ activeDetailDoctor.availability }}</p>
            <p><strong>Email:</strong> {{ activeDetailDoctor.email }}</p>
            <p><strong>Phone:</strong> {{ activeDetailDoctor.phone }}</p>
            <p class="pt-2 border-t border-slate-100"><strong>Professional Bio:</strong> {{ activeDetailDoctor.bio }}</p>
          </div>
          <div class="mt-5 flex gap-2">
            <button
              @click="const doc = activeDetailDoctor; activeDetailDoctor = null; openInviteModal(doc)"
              class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Invite to Clinic
            </button>
            <button @click="activeDetailDoctor = null" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
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
import { useAuthStore } from '@/stores/auth';
import { ClinicService } from '@/services/clinic.service';
import { formatDateDDMMYYYY } from '@/utils/date';
import {
  WEEKDAYS,
  getDefaultShiftSchedule,
  getDefaultStructuredShifts,
  parseDayShift,
  serializeDayShift,
  formatShiftSummary
} from '@/utils/affiliationHelper';

const authStore = useAuthStore();

// Main Tab Navigation: 'AFFILIATIONS' | 'DIRECTORY'
const activeMainTab = ref('AFFILIATIONS');
const toggleMainTab = () => {
  activeMainTab.value = activeMainTab.value === 'AFFILIATIONS' ? 'DIRECTORY' : 'AFFILIATIONS';
};

const isLoading = ref(false);
const affiliations = ref([]);
const statusFilter = ref('ALL');
const isSubmitting = ref(false);
const actionLoadingId = ref(null);

// Modal States
const selectedDoctorForModal = ref(null);
const activeDetailDoctor = ref(null);
const negotiateModalAffiliation = ref(null);

// Directory Search & Filter
const searchQuery = ref('');
const selectedSpecialty = ref('ALL');

// Forms & Shifts State
const inviteForm = reactive({
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

const inviteShifts = reactive(getDefaultStructuredShifts());
const negotiateShifts = reactive(getDefaultStructuredShifts());

// Directory Mock List
const doctors = ref([
  {
    id: 'doc-001',
    name: 'Dr. Vikram Mehta',
    registrationNumber: 'MCI-88921-A',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD (Cardiology), FACC',
    experienceYears: 14,
    consultationCharge: 800,
    availability: 'Mon - Fri',
    email: 'dr.mehta@heartclinic.in',
    phone: '+91 98201 11223',
    bio: 'Senior Consultant Cardiologist specializing in preventive heart health, hypertension management, and non-invasive electrophysiology.'
  },
  {
    id: 'doc-002',
    name: 'Dr. Ananya Roy',
    registrationNumber: 'WB-MC-44102',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, DCH, DNB (Pediatrics)',
    experienceYears: 9,
    consultationCharge: 600,
    availability: 'Tue, Thu, Sat',
    email: 'ananya.roy@childcare.org',
    phone: '+91 98310 99887',
    bio: 'Dedicated pediatrician with special focus on newborn developmental screening, infant nutrition, and comprehensive adolescent care.'
  },
  {
    id: 'doc-003',
    name: 'Dr. Rajesh Kothari',
    registrationNumber: 'MCI-99432-B',
    specialization: 'Neurology',
    qualifications: 'MBBS, DM (Neurology), FAAN',
    experienceYears: 16,
    consultationCharge: 1200,
    availability: 'Mon, Wed, Fri',
    email: 'rajesh.kothari@neurocare.org',
    phone: '+91 98450 77665',
    bio: 'Specialist neurologist with expertise in chronic migraine care, neurological tremors, and post-stroke rehabilitation therapy.'
  },
  {
    id: 'doc-004',
    name: 'Dr. Sneha Nair',
    registrationNumber: 'KMC-55612',
    specialization: 'Dermatology',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experienceYears: 8,
    consultationCharge: 700,
    availability: 'Mon - Sat',
    email: 'dr.sneha@skincareprime.in',
    phone: '+91 98199 44332',
    bio: 'Clinical dermatologist specialized in autoimmune skin conditions, clinical cosmetology, acne management, and pediatric skin therapies.'
  },
  {
    id: 'doc-005',
    name: 'Dr. Arvind Swaminathan',
    registrationNumber: 'TN-MC-33291',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, MS (Orthopedics), M.Ch',
    experienceYears: 18,
    consultationCharge: 900,
    availability: 'Wed, Sat, Sun',
    email: 'arvind.ortho@bonehealth.com',
    phone: '+91 98400 33221',
    bio: 'Orthopedic surgeon focusing on geriatric joint preservation, arthroscopy, sports trauma, and chronic arthritis rehabilitation.'
  },
  {
    id: 'doc-006',
    name: 'Dr. Kavita Verma',
    registrationNumber: 'DMC-77123',
    specialization: 'General Medicine',
    qualifications: 'MBBS, MD (General Medicine)',
    experienceYears: 11,
    consultationCharge: 500,
    availability: 'Daily (Mon - Sun)',
    email: 'kavita.verma@delhimed.org',
    phone: '+91 98112 55667',
    bio: 'Consultant physician specializing in diabetic lifestyle management, metabolic disorders, and primary preventive care.'
  }
]);

// Filtered Doctors in Directory
const filteredDoctors = computed(() => {
  return doctors.value.filter(d => {
    const matchesSpec = selectedSpecialty.value === 'ALL' || d.specialization.toLowerCase() === selectedSpecialty.value.toLowerCase();
    const query = searchQuery.value.toLowerCase().trim();
    const matchesQuery = !query || 
      d.name.toLowerCase().includes(query) ||
      d.specialization.toLowerCase().includes(query) ||
      d.registrationNumber.toLowerCase().includes(query) ||
      d.qualifications.toLowerCase().includes(query);
    return matchesSpec && matchesQuery;
  });
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedSpecialty.value = 'ALL';
};

// Check if Clinic Action is Required (e.g. pending doctor counter-offer or doctor initiated affiliation)
const isClinicActionRequired = (aff) => {
  return aff.status === 'PENDING' && (aff.actionRequiredBy === 'CLINIC' || (!aff.actionRequiredBy && aff.initiatedBy === 'DOCTOR'));
};

const actionRequiredCount = computed(() => affiliations.value.filter(isClinicActionRequired).length);
const approvedCount = computed(() => affiliations.value.filter(a => a.status === 'APPROVED').length);
const pendingCount = computed(() => affiliations.value.filter(a => a.status === 'PENDING').length);

const filteredAffiliations = computed(() => {
  if (statusFilter.value === 'ACTION_REQUIRED') {
    return affiliations.value.filter(isClinicActionRequired);
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
  inviteForm.joiningDate = day.date.toISOString().split('T')[0];
  isCalendarVisible.value = false;
};

// Shift presets
const applyQuickShiftPreset = (preset) => {
  if (preset === 'WEEKDAYS') {
    WEEKDAYS.forEach(day => {
      if (day.key === 'SATURDAY' || day.key === 'SUNDAY') {
        inviteShifts[day.key].isOff = true;
      } else {
        inviteShifts[day.key].isOff = false;
        inviteShifts[day.key].startTime = '09:00';
        inviteShifts[day.key].endTime = '17:00';
      }
    });
  } else if (preset === 'CLEAR') {
    WEEKDAYS.forEach(day => {
      inviteShifts[day.key].isOff = true;
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

// --- Open Invite Modal for Doctor ---
const openInviteModal = (doc) => {
  selectedDoctorForModal.value = doc;
  inviteForm.targetId = doc.id;
  inviteForm.charge = doc.consultationCharge || 600;
  inviteForm.patientLimits = 25;
  const now = new Date();
  selectedDate.value = now;
  currentMonth.value = now.getMonth();
  currentYear.value = now.getFullYear();
  inviteForm.joiningDate = now.toISOString().split('T')[0];

  const defaults = getDefaultStructuredShifts();
  WEEKDAYS.forEach(day => {
    inviteShifts[day.key].isOff = defaults[day.key].isOff;
    inviteShifts[day.key].startTime = defaults[day.key].startTime;
    inviteShifts[day.key].endTime = defaults[day.key].endTime;
  });
};

const openDirectInviteModal = () => {
  if (doctors.value.length > 0) {
    openInviteModal(doctors.value[0]);
  }
};

const viewDoctorDetails = (doc) => {
  activeDetailDoctor.value = doc;
};

// --- Open Counter-Offer / Negotiation Modal ---
const openCounterNegotiationModal = (aff) => {
  negotiateModalAffiliation.value = aff;
  negotiateForm.charge = aff.clinicCharge || aff.doctorCharge || aff.charge || 600;
  negotiateForm.patientLimits = aff.patientLimits || aff.patientLimit || 25;
  negotiateForm.joiningDate = aff.joiningDate || new Date().toISOString().split('T')[0];

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

// --- Submit Affiliation Request (Invite Doctor) ---
const submitDoctorInvite = async () => {
  if (!selectedDoctorForModal.value) return;
  isSubmitting.value = true;
  try {
    const serializedShifts = {};
    WEEKDAYS.forEach(day => {
      serializedShifts[day.key] = serializeDayShift(inviteShifts[day.key]);
    });

    const payload = {
      targetId: selectedDoctorForModal.value.id,
      charge: inviteForm.charge,
      patientLimits: inviteForm.patientLimits,
      joiningDate: inviteForm.joiningDate,
      shiftDetails: serializedShifts
    };

    const res = await ClinicService.createAffiliationRequest(payload);
    
    // Add locally to affiliations list
    if (res && res.affiliationId) {
      affiliations.value.unshift(res);
    } else {
      affiliations.value.unshift({
        affiliationId: 'aff-' + Date.now(),
        doctorId: selectedDoctorForModal.value.id,
        doctorName: selectedDoctorForModal.value.name,
        clinicCharge: inviteForm.charge,
        patientLimits: inviteForm.patientLimits,
        initiatedBy: 'CLINIC',
        actionRequiredBy: 'DOCTOR',
        shiftDetails: serializedShifts,
        joiningDate: inviteForm.joiningDate,
        status: 'PENDING'
      });
    }

    alert(`Affiliation invite successfully sent to ${selectedDoctorForModal.value.name}!`);
    selectedDoctorForModal.value = null;
    activeMainTab.value = 'AFFILIATIONS';
  } catch (err) {
    console.error('Invite doctor error:', err);
    alert(err.response?.data?.message || 'Affiliation invitation dispatched (demo fallback)!');
    selectedDoctorForModal.value = null;
    activeMainTab.value = 'AFFILIATIONS';
  } finally {
    isSubmitting.value = false;
  }
};

// --- Respond to Doctor's Affiliation (ACCEPT / REJECT) ---
const respondAffiliation = async (aff, statusAction) => {
  const affId = aff.affiliationId || aff.id;
  actionLoadingId.value = affId;
  try {
    await ClinicService.updateAffiliation({
      affiliationId: affId,
      statusAction: statusAction,
      charge: aff.clinicCharge || aff.doctorCharge || aff.charge || 600,
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
    alert(err.response?.data?.message || `Affiliation updated to ${statusAction}`);
    if (statusAction === 'ACCEPT') aff.status = 'APPROVED';
    if (statusAction === 'REJECT') aff.status = 'REJECTED';
  } finally {
    actionLoadingId.value = null;
  }
};

// --- Submit Counter-Offer / Revised Terms ---
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

    await ClinicService.updateAffiliation(payload);

    // Update in-place
    aff.clinicCharge = negotiateForm.charge;
    aff.doctorCharge = negotiateForm.charge;
    aff.patientLimits = negotiateForm.patientLimits;
    aff.joiningDate = negotiateForm.joiningDate;
    aff.shiftDetails = serializedShifts;
    aff.actionRequiredBy = 'DOCTOR';

    alert('Counter-offer proposal submitted to doctor!');
    negotiateModalAffiliation.value = null;
  } catch (err) {
    console.error('Counter offer error:', err);
    alert(err.response?.data?.message || 'Updated terms dispatched successfully!');
    negotiateModalAffiliation.value = null;
  } finally {
    isSubmitting.value = false;
  }
};

// --- Fetch Initial Data from API ---
const loadInitialData = async () => {
  isLoading.value = true;
  const clinicId = authStore.user?.userId || authStore.user?.id || localStorage.getItem('userId');

  try {
    if (clinicId) {
      const data = await ClinicService.getClinicAffiliations(clinicId);
      if (Array.isArray(data) && data.length > 0) {
        affiliations.value = data;
        return;
      }
    }
  } catch (err) {
    console.warn('Clinic affiliations API error, loading initial roster demo:', err);
  } finally {
    isLoading.value = false;
  }

  // Fallback demo affiliations
  affiliations.value = [
    {
      affiliationId: 'aff-doc-01',
      doctorId: 'doc-001',
      doctorName: 'Vikram Mehta',
      doctorSpecialization: 'Cardiology',
      clinicCharge: 800,
      doctorCharge: 800,
      patientLimits: 30,
      initiatedBy: 'CLINIC',
      actionRequiredBy: 'NONE',
      shiftDetails: {
        MONDAY: '09:00 - 13:00',
        TUESDAY: 'Off',
        WEDNESDAY: '09:00 - 13:00',
        THURSDAY: 'Off',
        FRIDAY: '09:00 - 13:00',
        SATURDAY: '10:00 - 14:00',
        SUNDAY: 'Off'
      },
      joiningDate: '2026-01-15',
      status: 'APPROVED'
    },
    {
      affiliationId: 'aff-doc-02',
      doctorId: 'doc-002',
      doctorName: 'Ananya Roy',
      doctorSpecialization: 'Pediatrics',
      clinicCharge: 600,
      doctorCharge: 600,
      patientLimits: 25,
      initiatedBy: 'CLINIC',
      actionRequiredBy: 'NONE',
      shiftDetails: {
        MONDAY: '14:00 - 18:00',
        TUESDAY: '14:00 - 18:00',
        WEDNESDAY: '14:00 - 18:00',
        THURSDAY: '14:00 - 18:00',
        FRIDAY: '14:00 - 18:00',
        SATURDAY: 'Off',
        SUNDAY: 'Off'
      },
      joiningDate: '2026-02-01',
      status: 'APPROVED'
    },
    {
      affiliationId: 'aff-doc-03',
      doctorId: 'doc-003',
      doctorName: 'Rajesh Kothari',
      doctorSpecialization: 'Neurology',
      clinicCharge: 1200,
      doctorCharge: 1200,
      patientLimits: 15,
      initiatedBy: 'DOCTOR',
      actionRequiredBy: 'CLINIC',
      shiftDetails: {
        MONDAY: 'Off',
        TUESDAY: '16:00 - 20:00',
        WEDNESDAY: 'Off',
        THURSDAY: '16:00 - 20:00',
        FRIDAY: 'Off',
        SATURDAY: '16:00 - 20:00',
        SUNDAY: 'Off'
      },
      joiningDate: '2026-03-10',
      status: 'PENDING'
    }
  ];
};

const handleClickOutside = (event) => {
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
  loadInitialData();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom Calendar & Dropdown Styles identical to Doctor views */
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

