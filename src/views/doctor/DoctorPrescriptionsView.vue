<template>
  <div class="w-full mx-auto h-full flex flex-col p-4 md:p-8 rounded-[2.5rem] bg-indigo-50/40 font-jakarta">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
            E-Prescription Studio
          </h1>
          <span
            v-if="!isLoading"
            class="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            :class="dataSource === 'Live API' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
          >
            {{ dataSource }}
          </span>
        </div>
        <p class="text-slate-500 mt-1 font-medium text-xs sm:text-sm">Manage, prescribe, and adjust individual medications per patient with live dosing controls.</p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          Prescribe Medication
        </button>
      </div>
    </div>

    <!-- Alert / Toast Banner -->
    <div v-if="toastMessage" class="mb-4 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in-up" :class="toastType === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'">
      <div class="flex items-center gap-2">
        <svg v-if="toastType === 'error'" class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <svg v-else class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-slate-400 hover:text-slate-600">&times;</button>
    </div>

    <!-- Patient Filter Bar & Status Tabs -->
    <div class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Custom Patient Selector & Search -->
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Patient:
        </div>

        <!-- Custom Dropdown (Same style as sign-up pages) -->
        <div class="relative min-w-[220px]" ref="filterDropdownRef">
          <button
            type="button"
            @click="filterPatientDropdownVisible = !filterPatientDropdownVisible"
            class="w-full flex justify-between items-center pl-4 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-xs sm:text-sm text-slate-800 shadow-sm"
          >
            <span class="truncate">{{ activePatientObj ? `${activePatientObj.firstName} ${activePatientObj.lastName}` : `All Patients (${patients.length})` }}</span>
            <svg class="w-4 h-4 text-slate-400 transition-transform ml-2 flex-shrink-0" :class="{ 'rotate-180': filterPatientDropdownVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <ul
            v-if="filterPatientDropdownVisible"
            class="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto py-1"
          >
            <li
              @click="selectedPatientId = ''; filterPatientDropdownVisible = false; onPatientChange();"
              class="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer font-bold text-xs text-indigo-600 transition-colors border-b border-slate-100 flex items-center justify-between"
            >
              <span>All Patients</span>
              <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{{ patients.length }}</span>
            </li>
            <li
              v-for="p in patients"
              :key="p.id"
              @click="selectedPatientId = p.id; filterPatientDropdownVisible = false; onPatientChange();"
              class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer font-medium text-xs sm:text-sm text-slate-700 transition-colors flex items-center justify-between"
              :class="{ 'bg-slate-100 text-indigo-700 font-bold': selectedPatientId === p.id }"
            >
              <span>{{ p.firstName }} {{ p.lastName }}</span>
              <span v-if="p.bloodGroup" class="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-lg">{{ p.bloodGroup }}</span>
            </li>
          </ul>
        </div>

        <!-- Search in medications -->
        <div class="relative flex-1 min-w-[180px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search medicine, dosage, instructions..."
            class="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-800 placeholder:text-slate-400 font-medium transition-all shadow-sm"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <!-- Active / Inactive Tabs -->
      <div class="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
        <button
          @click="statusFilter = 'ALL'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="statusFilter === 'ALL' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
        >
          All ({{ filteredMedsCount.all }})
        </button>
        <button
          @click="statusFilter = 'ACTIVE'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="statusFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
        >
          Active ({{ filteredMedsCount.active }})
        </button>
        <button
          @click="statusFilter = 'DISCONTINUED'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="statusFilter === 'DISCONTINUED' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
        >
          Discontinued ({{ filteredMedsCount.discontinued }})
        </button>
      </div>
    </div>

    <!-- Selected Patient Summary Bar (when filtered by single patient) -->
    <div v-if="activePatientObj" class="mb-6 p-4 rounded-3xl bg-indigo-600/10 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 animate-fade-in-up">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
          {{ activePatientObj.firstName?.charAt(0) }}{{ activePatientObj.lastName?.charAt(0) }}
        </div>
        <div>
          <h3 class="font-extrabold text-sm text-slate-900">{{ activePatientObj.firstName }} {{ activePatientObj.lastName }}</h3>
          <p class="text-xs text-slate-500 font-medium">
            {{ activePatientObj.gender || 'Patient' }} &bull; {{ activePatientObj.age ? `${activePatientObj.age} yrs` : 'Adult' }}
            <span v-if="activePatientObj.bloodGroup" class="ml-2 font-bold text-rose-600">Blood Group: {{ activePatientObj.bloodGroup }}</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="selectedPatientId = ''; onPatientChange();"
          class="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-xl bg-white border border-indigo-100 shadow-sm hover:shadow transition-all"
        >
          Clear Patient Filter
        </button>
      </div>
    </div>

    <!-- Prescriptions (Individual Medicines) List -->
    <div class="space-y-4 flex-1 overflow-y-auto">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-28 bg-white/60 animate-pulse rounded-[2rem] border border-slate-100"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="displayedPrescriptions.length === 0"
        class="bg-white/80 rounded-[2rem] p-12 text-center border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3"
      >
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        </div>
        <h4 class="text-base font-bold text-slate-800">No Medications Found</h4>
        <p class="text-xs text-slate-500 max-w-sm">No prescriptions match your current patient or status filter. Click "Prescribe Medication" to issue one.</p>
        <button
          @click="openAddModal"
          class="mt-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 cursor-pointer"
        >
          + Prescribe First Medicine
        </button>
      </div>

      <!-- Individual Medication Cards -->
      <div
        v-for="rx in displayedPrescriptions"
        :key="rx.id"
        class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group hover:border-indigo-200"
      >
        <div class="flex items-start gap-4">
          <!-- Medicine Icon Badge -->
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 border shadow-sm"
            :class="rx.isActive ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-400 border-slate-200'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
          </div>

          <!-- Medicine Details -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                {{ rx.medicationName }}
              </h3>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                {{ rx.dosage }}
              </span>
              <span
                class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                :class="rx.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
              >
                {{ rx.isActive ? 'ACTIVE' : 'DISCONTINUED' }}
              </span>
            </div>

            <!-- Meta details row -->
            <p class="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-2">
              <span>Patient: <strong class="text-slate-800">{{ rx.patientName || resolvePatientName(rx.patientId) }}</strong></span>
              <span>&bull;</span>
              <span>Schedule: <strong class="text-slate-700">{{ rx.frequency }}</strong></span>
              <span>&bull;</span>
              <span>Duration: <strong class="text-slate-700">{{ formatDuration(rx) }}</strong></span>
              <span v-if="rx.startedAt">&bull;</span>
              <span v-if="rx.startedAt">Started: <strong class="text-slate-700">{{ rx.startedAt }}</strong></span>
              <span v-if="rx.endDate">&bull;</span>
              <span v-if="rx.endDate">Ends: <strong class="text-slate-700">{{ rx.endDate }}</strong></span>
            </p>

            <!-- Instructions -->
            <p v-if="rx.instructions" class="text-xs text-slate-600 mt-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 italic">
              "{{ rx.instructions }}"
            </p>
          </div>
        </div>

        <!-- Medicine Actions Toolbar -->
        <div class="flex items-center gap-2 self-end lg:self-center flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
          <!-- Edit Medicine -->
          <button
            @click="openEditModal(rx)"
            title="Edit Medication details"
            class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Edit
          </button>

          <!-- Discontinue Medicine (if active) -->
          <button
            v-if="rx.isActive"
            @click="openDiscontinueModal(rx)"
            title="Discontinue Medication"
            class="px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <svg class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Discontinue
          </button>

          <!-- Delete Medicine -->
          <button
            @click="confirmDeleteMed(rx)"
            title="Permanently remove medication"
            class="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <svg class="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- 1. ADD MEDICATION MODAL -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-jakarta" @click.self="showAddModal = false">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[92vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900">Prescribe Individual Medication</h3>
              <p class="text-xs text-slate-400 font-medium">Add a new drug entry with dosage, duration, and patient instructions.</p>
            </div>
            <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 p-1 text-2xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="submitAddMed" class="space-y-4">
            <!-- Custom Patient selection dropdown -->
            <div class="space-y-1.5 relative">
              <label class="block text-xs font-bold uppercase text-slate-600">Select Patient *</label>
              <div class="relative">
                <button
                  type="button"
                  @click="addPatientDropdownVisible = !addPatientDropdownVisible"
                  class="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-slate-800 text-sm shadow-sm"
                  :class="{ 'ring-2 ring-indigo-600': addPatientDropdownVisible }"
                >
                  <span class="truncate">{{ getPatientLabel(addForm.patientId) || 'Select a Patient' }}</span>
                  <svg class="w-4 h-4 text-slate-400 transition-transform ml-2 flex-shrink-0" :class="{ 'rotate-180': addPatientDropdownVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul
                  v-if="addPatientDropdownVisible"
                  class="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto py-1"
                >
                  <li
                    v-for="p in patients"
                    :key="p.id"
                    @click="addForm.patientId = p.id; addPatientDropdownVisible = false;"
                    class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 text-xs sm:text-sm transition-colors flex items-center justify-between"
                  >
                    <span>{{ p.firstName }} {{ p.lastName }}</span>
                    <span v-if="p.bloodGroup" class="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-lg">{{ p.bloodGroup }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Medication name & Dosage -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Medication Name *</label>
                <input
                  v-model="addForm.medicationName"
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin, Metformin"
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Dosage / Strength *</label>
                <input
                  v-model="addForm.dosage"
                  type="text"
                  required
                  placeholder="e.g. 500mg, 1 tablet"
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                />
              </div>
            </div>

            <!-- Frequency & Start Date (Custom Calendar) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Frequency *</label>
                <input
                  v-model="addForm.frequency"
                  type="text"
                  required
                  placeholder="e.g. Twice daily with meals"
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                />
              </div>

              <!-- Start Date with Sign-Up Style Calendar Component -->
              <div class="space-y-1.5 relative" ref="addCalendarRef">
                <label class="block text-xs font-bold uppercase text-slate-600">Start Date</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="isAddCalendarVisible = !isAddCalendarVisible"
                    class="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-slate-900 text-sm shadow-sm"
                    :class="{ 'ring-2 ring-indigo-600': isAddCalendarVisible }"
                  >
                    <span>{{ addForm.startedAt || 'Select Start Date' }}</span>
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </button>
                </div>

                <!-- Custom Calendar Dropdown -->
                <div v-if="isAddCalendarVisible" class="calendar-container shadow-2xl">
                  <div class="calendar-header">
                    <button type="button" @click.stop.prevent="prevAddMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors">
                      <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div class="month-year-selects">
                      <div class="custom-calendar-dropdown">
                        <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleAddCalDropdown('month')">
                          <span>{{ months[addCalMonth] }}</span>
                          <svg :class="{ active: addMonthDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                          </svg>
                        </button>
                        <ul v-if="addMonthDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                          <li v-for="(month, index) in months" :key="month" @click.stop.prevent="selectAddMonth(index)">{{ month }}</li>
                        </ul>
                      </div>
                      <div class="custom-calendar-dropdown">
                        <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleAddCalDropdown('year')">
                          <span>{{ addCalYear }}</span>
                          <svg :class="{ active: addYearDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                          </svg>
                        </button>
                        <ul v-if="addYearDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                          <li v-for="year in calYears" :key="year" @click.stop.prevent="selectAddYear(year)">{{ year }}</li>
                        </ul>
                      </div>
                    </div>
                    <button type="button" @click.stop.prevent="nextAddMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors">
                      <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  <div class="calendar-grid">
                    <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                    <div
                      class="day-cell"
                      v-for="(day, index) in addCalendarDays"
                      :key="index"
                      :class="{ 'other-month': !day.isCurrentMonth, 'selected': day.isSelected, 'today': day.isToday }"
                      @click="selectAddDate(day)"
                    >
                      {{ day.dayNumber }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duration Value & Custom Duration Unit Dropdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Duration Value</label>
                <input
                  v-model.number="addForm.durationValue"
                  type="number"
                  min="1"
                  placeholder="e.g. 14"
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-sm shadow-sm"
                />
              </div>

              <!-- Custom Duration Unit Dropdown -->
              <div class="space-y-1.5 relative">
                <label class="block text-xs font-bold uppercase text-slate-600">Duration Unit</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="addUnitDropdownVisible = !addUnitDropdownVisible"
                    class="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-slate-800 text-sm shadow-sm"
                    :class="{ 'ring-2 ring-indigo-600': addUnitDropdownVisible }"
                  >
                    <span>{{ getUnitLabel(addForm.durationUnit) }}</span>
                    <svg class="w-4 h-4 text-slate-400 transition-transform ml-2" :class="{ 'rotate-180': addUnitDropdownVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <ul
                    v-if="addUnitDropdownVisible"
                    class="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto py-1"
                  >
                    <li
                      v-for="unit in unitOptions"
                      :key="unit.value"
                      @click="addForm.durationUnit = unit.value; addUnitDropdownVisible = false;"
                      class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 text-xs sm:text-sm transition-colors"
                      :class="{ 'bg-slate-100 text-indigo-700 font-bold': addForm.durationUnit === unit.value }"
                    >
                      {{ unit.label }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold uppercase text-slate-600">Patient Instructions & Precautions</label>
              <textarea
                v-model="addForm.instructions"
                rows="2"
                placeholder="e.g. Take after breakfast. Drink warm water and avoid dairy."
                class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-sm shadow-sm"
              ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-indigo-200 cursor-pointer transition-all"
              >
                {{ isSubmitting ? 'Prescribing...' : 'Prescribe Medicine' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 2. EDIT MEDICATION MODAL -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-jakarta" @click.self="showEditModal = false">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in-up max-h-[92vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900">Update Medication</h3>
              <p class="text-xs text-slate-400 font-medium">Modify dosage, schedule, duration, or active status.</p>
            </div>
            <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600 p-1 text-2xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="submitEditMed" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Medication Name *</label>
                <input
                  v-model="editForm.medicationName"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-sm shadow-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Dosage / Strength *</label>
                <input
                  v-model="editForm.dosage"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-sm shadow-sm"
                />
              </div>
            </div>

            <!-- Frequency & Start Date (Calendar) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Frequency *</label>
                <input
                  v-model="editForm.frequency"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-sm shadow-sm"
                />
              </div>

              <!-- Edit Start Date with Sign-Up Style Calendar Component -->
              <div class="space-y-1.5 relative" ref="editCalendarRef">
                <label class="block text-xs font-bold uppercase text-slate-600">Start Date</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="isEditCalendarVisible = !isEditCalendarVisible"
                    class="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-slate-900 text-sm shadow-sm"
                    :class="{ 'ring-2 ring-indigo-600': isEditCalendarVisible }"
                  >
                    <span>{{ editForm.startedAt || 'Select Date' }}</span>
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </button>
                </div>

                <!-- Custom Calendar Dropdown -->
                <div v-if="isEditCalendarVisible" class="calendar-container shadow-2xl">
                  <div class="calendar-header">
                    <button type="button" @click.stop.prevent="prevEditMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors">
                      <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div class="month-year-selects">
                      <div class="custom-calendar-dropdown">
                        <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleEditCalDropdown('month')">
                          <span>{{ months[editCalMonth] }}</span>
                          <svg :class="{ active: editMonthDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                          </svg>
                        </button>
                        <ul v-if="editMonthDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                          <li v-for="(month, index) in months" :key="month" @click.stop.prevent="selectEditMonth(index)">{{ month }}</li>
                        </ul>
                      </div>
                      <div class="custom-calendar-dropdown">
                        <button type="button" class="calendar-dropdown-button" @click.stop.prevent="toggleEditCalDropdown('year')">
                          <span>{{ editCalYear }}</span>
                          <svg :class="{ active: editYearDropdownVisible }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                          </svg>
                        </button>
                        <ul v-if="editYearDropdownVisible" class="calendar-dropdown-menu shadow-xl">
                          <li v-for="year in calYears" :key="year" @click.stop.prevent="selectEditYear(year)">{{ year }}</li>
                        </ul>
                      </div>
                    </div>
                    <button type="button" @click.stop.prevent="nextEditMonth" class="p-1 rounded-full hover:bg-slate-100 transition-colors">
                      <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  <div class="calendar-grid">
                    <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                    <div
                      class="day-cell"
                      v-for="(day, index) in editCalendarDays"
                      :key="index"
                      :class="{ 'other-month': !day.isCurrentMonth, 'selected': day.isSelected, 'today': day.isToday }"
                      @click="selectEditDate(day)"
                    >
                      {{ day.dayNumber }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duration Value & Custom Unit Dropdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase text-slate-600">Duration Value</label>
                <input
                  v-model.number="editForm.durationValue"
                  type="number"
                  min="1"
                  class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-sm shadow-sm"
                />
              </div>

              <!-- Custom Unit Dropdown -->
              <div class="space-y-1.5 relative">
                <label class="block text-xs font-bold uppercase text-slate-600">Duration Unit</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="editUnitDropdownVisible = !editUnitDropdownVisible"
                    class="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-semibold text-slate-800 text-sm shadow-sm"
                    :class="{ 'ring-2 ring-indigo-600': editUnitDropdownVisible }"
                  >
                    <span>{{ getUnitLabel(editForm.durationUnit) }}</span>
                    <svg class="w-4 h-4 text-slate-400 transition-transform ml-2" :class="{ 'rotate-180': editUnitDropdownVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <ul
                    v-if="editUnitDropdownVisible"
                    class="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto py-1"
                  >
                    <li
                      v-for="unit in unitOptions"
                      :key="unit.value"
                      @click="editForm.durationUnit = unit.value; editUnitDropdownVisible = false;"
                      class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 text-xs sm:text-sm transition-colors"
                      :class="{ 'bg-slate-100 text-indigo-700 font-bold': editForm.durationUnit === unit.value }"
                    >
                      {{ unit.label }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold uppercase text-slate-600">Patient Instructions</label>
              <textarea
                v-model="editForm.instructions"
                rows="2"
                class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-sm shadow-sm"
              ></textarea>
            </div>

            <!-- Active Checkbox -->
            <div class="flex items-center gap-2 pt-1">
              <input
                id="editIsActive"
                v-model="editForm.isActive"
                type="checkbox"
                class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <label for="editIsActive" class="text-xs font-bold text-slate-700">Currently Active Medication</label>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-indigo-200 cursor-pointer transition-all"
              >
                {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 3. DISCONTINUE MEDICATION MODAL -->
    <Teleport to="body">
      <div v-if="showDiscontinueModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-jakarta" @click.self="showDiscontinueModal = false">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-fade-in-up">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h3 class="text-xl font-extrabold text-slate-900">Discontinue {{ selectedMed?.medicationName }}?</h3>
          <p class="text-xs text-slate-500 mt-1">This will stop this medication for the patient and mark it as discontinued in their profile.</p>

          <div class="mt-4 space-y-1.5">
            <label class="block text-xs font-bold uppercase text-slate-600">Reason for Discontinuation</label>
            <input
              v-model="discontinueReason"
              type="text"
              placeholder="e.g. Symptoms resolved / Course completed"
              class="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-semibold shadow-sm"
            />
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="showDiscontinueModal = false"
              class="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitDiscontinueMed"
              :disabled="isSubmitting"
              class="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-200 cursor-pointer transition-all"
            >
              {{ isSubmitting ? 'Stopping...' : 'Confirm Discontinue' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 4. DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-jakarta" @click.self="showDeleteModal = false">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-fade-in-up">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </div>
          <h3 class="text-xl font-extrabold text-slate-900">Delete Medication Entry?</h3>
          <p class="text-xs text-slate-500 mt-1">Are you sure you want to permanently delete <strong>{{ selectedMed?.medicationName }}</strong>? This action cannot be undone.</p>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitDeleteMed"
              :disabled="isSubmitting"
              class="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 cursor-pointer transition-all"
            >
              {{ isSubmitting ? 'Deleting...' : 'Delete Permanently' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { DoctorService } from '@/services/doctor.service';

const authStore = useAuthStore();

// State
const isLoading = ref(true);
const isSubmitting = ref(false);
const dataSource = ref('Loading...');
const toastMessage = ref('');
const toastType = ref('success');

const patients = ref([]);
const prescriptions = ref([]);

const selectedPatientId = ref('');
const searchQuery = ref('');
const statusFilter = ref('ALL'); // ALL | ACTIVE | DISCONTINUED

// Dropdown Visibility States (matching signup custom dropdowns)
const filterPatientDropdownVisible = ref(false);
const addPatientDropdownVisible = ref(false);
const addUnitDropdownVisible = ref(false);
const editUnitDropdownVisible = ref(false);

const unitOptions = [
  { value: 'DAY', label: 'Days' },
  { value: 'WEEK', label: 'Weeks' },
  { value: 'MONTH', label: 'Months' },
  { value: 'YEAR', label: 'Years' },
  { value: 'ONGOING', label: 'Ongoing' }
];

const getUnitLabel = (val) => {
  const match = unitOptions.find(u => u.value === val);
  return match ? match.label : 'Days';
};

const getPatientLabel = (id) => {
  const p = patients.value.find(item => item.id === id);
  return p ? `${p.firstName} ${p.lastName}${p.bloodGroup ? ` (${p.bloodGroup})` : ''}` : '';
};

// Calendar States & Constants (matching signup pages)
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [...Array(12).keys()].map(i => new Date(0, i).toLocaleString('default', { month: 'long' }));
const calYears = computed(() => {
  const current = new Date().getFullYear();
  return Array.from({ length: 15 }, (_, i) => current - 2 + i);
});

// Add Modal Calendar State
const isAddCalendarVisible = ref(false);
const addCalMonth = ref(new Date().getMonth());
const addCalYear = ref(new Date().getFullYear());
const addMonthDropdownVisible = ref(false);
const addYearDropdownVisible = ref(false);

const toggleAddCalDropdown = (type) => {
  if (type === 'month') {
    addMonthDropdownVisible.value = !addMonthDropdownVisible.value;
    addYearDropdownVisible.value = false;
  } else {
    addYearDropdownVisible.value = !addYearDropdownVisible.value;
    addMonthDropdownVisible.value = false;
  }
};

const selectAddMonth = (m) => {
  addCalMonth.value = m;
  addMonthDropdownVisible.value = false;
};

const selectAddYear = (y) => {
  addCalYear.value = y;
  addYearDropdownVisible.value = false;
};

const prevAddMonth = () => {
  if (addCalMonth.value === 0) {
    addCalMonth.value = 11;
    addCalYear.value--;
  } else {
    addCalMonth.value--;
  }
};

const nextAddMonth = () => {
  if (addCalMonth.value === 11) {
    addCalMonth.value = 0;
    addCalYear.value++;
  } else {
    addCalMonth.value++;
  }
};

const addCalendarDays = computed(() => {
  const year = addCalYear.value;
  const month = addCalMonth.value;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const arr = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < firstDay; i++) {
    arr.push({ dayNumber: '', isCurrentMonth: false, isToday: false, isSelected: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    arr.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dStr === todayStr,
      isSelected: addForm.startedAt === dStr,
      dateString: dStr
    });
  }
  return arr;
});

const selectAddDate = (day) => {
  if (!day.isCurrentMonth) return;
  addForm.startedAt = day.dateString;
  isAddCalendarVisible.value = false;
};

// Edit Modal Calendar State
const isEditCalendarVisible = ref(false);
const editCalMonth = ref(new Date().getMonth());
const editCalYear = ref(new Date().getFullYear());
const editMonthDropdownVisible = ref(false);
const editYearDropdownVisible = ref(false);

const toggleEditCalDropdown = (type) => {
  if (type === 'month') {
    editMonthDropdownVisible.value = !editMonthDropdownVisible.value;
    editYearDropdownVisible.value = false;
  } else {
    editYearDropdownVisible.value = !editYearDropdownVisible.value;
    editMonthDropdownVisible.value = false;
  }
};

const selectEditMonth = (m) => {
  editCalMonth.value = m;
  editMonthDropdownVisible.value = false;
};

const selectEditYear = (y) => {
  editCalYear.value = y;
  editYearDropdownVisible.value = false;
};

const prevEditMonth = () => {
  if (editCalMonth.value === 0) {
    editCalMonth.value = 11;
    editCalYear.value--;
  } else {
    editCalMonth.value--;
  }
};

const nextEditMonth = () => {
  if (editCalMonth.value === 11) {
    editCalMonth.value = 0;
    editCalYear.value++;
  } else {
    editCalMonth.value++;
  }
};

const editCalendarDays = computed(() => {
  const year = editCalYear.value;
  const month = editCalMonth.value;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const arr = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < firstDay; i++) {
    arr.push({ dayNumber: '', isCurrentMonth: false, isToday: false, isSelected: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    arr.push({
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dStr === todayStr,
      isSelected: editForm.startedAt === dStr,
      dateString: dStr
    });
  }
  return arr;
});

const selectEditDate = (day) => {
  if (!day.isCurrentMonth) return;
  editForm.startedAt = day.dateString;
  isEditCalendarVisible.value = false;
};

// Modals
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDiscontinueModal = ref(false);
const showDeleteModal = ref(false);
const selectedMed = ref(null);
const discontinueReason = ref('');

// Forms
const addForm = reactive({
  patientId: '',
  medicationName: '',
  dosage: '',
  frequency: '',
  startedAt: new Date().toISOString().split('T')[0],
  durationValue: 30,
  durationUnit: 'DAY',
  instructions: '',
  isActive: true
});

const editForm = reactive({
  id: '',
  medicationName: '',
  dosage: '',
  frequency: '',
  startedAt: '',
  durationValue: 30,
  durationUnit: 'DAY',
  instructions: '',
  isActive: true
});

// Notifications Helper
const showToast = (msg, type = 'success') => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = '';
    }
  }, 4000);
};

// Computed Active Patient Object
const activePatientObj = computed(() => {
  if (!selectedPatientId.value) return null;
  return patients.value.find(p => p.id === selectedPatientId.value) || null;
});

// Resolve patient name
const resolvePatientName = (patientId) => {
  const p = patients.value.find(item => item.id === patientId);
  return p ? `${p.firstName} ${p.lastName}` : 'Assigned Patient';
};

// Format duration
const formatDuration = (rx) => {
  if (rx.durationValue && rx.durationUnit) {
    const unit = rx.durationUnit.toLowerCase();
    return `${rx.durationValue} ${unit}${rx.durationValue > 1 ? 's' : ''}`;
  }
  return rx.duration || '30 Days';
};

// Filtered Prescriptions
const displayedPrescriptions = computed(() => {
  return prescriptions.value.filter(rx => {
    if (selectedPatientId.value && rx.patientId !== selectedPatientId.value) {
      return false;
    }
    if (statusFilter.value === 'ACTIVE' && !rx.isActive) return false;
    if (statusFilter.value === 'DISCONTINUED' && rx.isActive) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const pName = (rx.patientName || resolvePatientName(rx.patientId)).toLowerCase();
      const mName = (rx.medicationName || '').toLowerCase();
      const dosage = (rx.dosage || '').toLowerCase();
      const instr = (rx.instructions || '').toLowerCase();
      return pName.includes(q) || mName.includes(q) || dosage.includes(q) || instr.includes(q);
    }

    return true;
  });
});

// Counts for filter pills
const filteredMedsCount = computed(() => {
  const pool = selectedPatientId.value
    ? prescriptions.value.filter(rx => rx.patientId === selectedPatientId.value)
    : prescriptions.value;

  return {
    all: pool.length,
    active: pool.filter(r => r.isActive).length,
    discontinued: pool.filter(r => !r.isActive).length
  };
});

// Patient Change Handler
const onPatientChange = async () => {
  if (selectedPatientId.value) {
    try {
      const pMeds = await DoctorService.getPatientPrescriptions(selectedPatientId.value);
      if (Array.isArray(pMeds) && pMeds.length > 0) {
        const otherMeds = prescriptions.value.filter(r => r.patientId !== selectedPatientId.value);
        prescriptions.value = [...otherMeds, ...pMeds];
      }
    } catch {
      // Keep existing list
    }
  }
};

// Fetch initial data
const loadData = async () => {
  isLoading.value = true;
  const doctorId = authStore.user?.userId || authStore.user?.id;

  // 1. Fetch Patients
  try {
    if (doctorId) {
      const pList = await DoctorService.getDoctorPatients(doctorId);
      if (Array.isArray(pList) && pList.length > 0) {
        patients.value = pList;
      }
    }
  } catch (err) {
    console.warn('Patients fetch failed, using fallback clinical patients:', err);
  }

  if (patients.value.length === 0) {
    patients.value = [
      { id: 'p-1', firstName: 'Rohan', lastName: 'Chakraborty', bloodGroup: 'O+', age: 28, gender: 'Male' },
      { id: 'p-2', firstName: 'Ananya', lastName: 'Sharma', bloodGroup: 'B+', age: 34, gender: 'Female' },
      { id: 'p-3', firstName: 'Vikram', lastName: 'Patel', bloodGroup: 'A+', age: 52, gender: 'Male' },
      { id: 'p-4', firstName: 'Suresh', lastName: 'Menon', bloodGroup: 'O-', age: 60, gender: 'Male' }
    ];
  }

  // 2. Fetch Doctor Prescriptions
  try {
    if (doctorId) {
      const rxList = await DoctorService.getDoctorPrescriptions(doctorId);
      if (Array.isArray(rxList) && rxList.length > 0) {
        prescriptions.value = rxList;
        dataSource.value = 'Live API';
        isLoading.value = false;
        return;
      }
    }
  } catch (err) {
    console.warn('Doctor prescriptions API error, using structured clinical list:', err);
  }

  dataSource.value = 'Offline / Demo';
  prescriptions.value = [
    {
      id: 'rx-1',
      patientId: 'p-1',
      patientName: 'Rohan Chakraborty',
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily after meals',
      durationValue: 7,
      durationUnit: 'DAY',
      startedAt: '2026-10-01',
      endDate: '2026-10-08',
      isActive: true,
      instructions: 'Complete the entire course. Drink plenty of warm fluids.'
    },
    {
      id: 'rx-2',
      patientId: 'p-3',
      patientName: 'Vikram Patel',
      medicationName: 'Atorvastatin',
      dosage: '10mg',
      frequency: 'Once daily at bedtime',
      durationValue: 30,
      durationUnit: 'DAY',
      startedAt: '2026-09-20',
      endDate: '2026-10-20',
      isActive: true,
      instructions: 'Avoid grapefruit juice while taking this medication.'
    },
    {
      id: 'rx-3',
      patientId: 'p-2',
      patientName: 'Ananya Sharma',
      medicationName: 'Telmisartan',
      dosage: '40mg',
      frequency: 'Once daily after breakfast',
      durationValue: 60,
      durationUnit: 'DAY',
      startedAt: '2026-09-15',
      endDate: '2026-11-15',
      isActive: true,
      instructions: 'Maintain morning BP log and bring on next appointment.'
    },
    {
      id: 'rx-4',
      patientId: 'p-4',
      patientName: 'Suresh Menon',
      medicationName: 'Metformin',
      dosage: '500mg ER',
      frequency: 'Twice daily with meals',
      durationValue: 90,
      durationUnit: 'DAY',
      startedAt: '2026-08-15',
      endDate: '2026-11-15',
      isActive: false,
      instructions: 'HbA1c test required before next follow-up.'
    }
  ];
  isLoading.value = false;
};

// Modal Openers
const openAddModal = () => {
  addForm.patientId = selectedPatientId.value || (patients.value[0]?.id || '');
  addForm.medicationName = '';
  addForm.dosage = '';
  addForm.frequency = 'Once daily after breakfast';
  addForm.startedAt = new Date().toISOString().split('T')[0];
  addForm.durationValue = 30;
  addForm.durationUnit = 'DAY';
  addForm.instructions = '';
  addForm.isActive = true;
  isAddCalendarVisible.value = false;
  addPatientDropdownVisible.value = false;
  addUnitDropdownVisible.value = false;
  showAddModal.value = true;
};

const openEditModal = (rx) => {
  selectedMed.value = rx;
  editForm.id = rx.id;
  editForm.medicationName = rx.medicationName;
  editForm.dosage = rx.dosage;
  editForm.frequency = rx.frequency;
  editForm.startedAt = rx.startedAt || new Date().toISOString().split('T')[0];
  editForm.durationValue = rx.durationValue || 30;
  editForm.durationUnit = rx.durationUnit || 'DAY';
  editForm.instructions = rx.instructions || '';
  editForm.isActive = rx.isActive !== false;
  isEditCalendarVisible.value = false;
  editUnitDropdownVisible.value = false;
  showEditModal.value = true;
};

const openDiscontinueModal = (rx) => {
  selectedMed.value = rx;
  discontinueReason.value = 'Course completed / Symptoms resolved';
  showDiscontinueModal.value = true;
};

const confirmDeleteMed = (rx) => {
  selectedMed.value = rx;
  showDeleteModal.value = true;
};

// API Submissions

// 1. Submit Add
const submitAddMed = async () => {
  isSubmitting.value = true;
  const payload = {
    patientId: addForm.patientId,
    medicationName: addForm.medicationName,
    dosage: addForm.dosage,
    frequency: addForm.frequency,
    startedAt: addForm.startedAt,
    durationValue: addForm.durationValue,
    durationUnit: addForm.durationUnit,
    instructions: addForm.instructions,
    isActive: addForm.isActive
  };

  try {
    const created = await DoctorService.addPrescription(payload);
    prescriptions.value.unshift(created || {
      ...payload,
      id: 'rx-' + Date.now(),
      patientName: resolvePatientName(payload.patientId)
    });
    showToast(`Prescribed ${payload.medicationName} successfully!`);
    showAddModal.value = false;
  } catch (err) {
    console.warn('Backend add prescription failed, using optimistic state:', err);
    prescriptions.value.unshift({
      ...payload,
      id: 'rx-' + Date.now(),
      patientName: resolvePatientName(payload.patientId)
    });
    showToast(`Prescribed ${payload.medicationName} (Saved locally)`, 'success');
    showAddModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

// 2. Submit Edit
const submitEditMed = async () => {
  if (!editForm.id) return;
  isSubmitting.value = true;
  const payload = {
    medicationName: editForm.medicationName,
    dosage: editForm.dosage,
    frequency: editForm.frequency,
    startedAt: editForm.startedAt,
    durationValue: editForm.durationValue,
    durationUnit: editForm.durationUnit,
    instructions: editForm.instructions,
    isActive: editForm.isActive
  };

  try {
    const updated = await DoctorService.updatePrescription(editForm.id, payload);
    const idx = prescriptions.value.findIndex(r => r.id === editForm.id);
    if (idx !== -1) {
      prescriptions.value[idx] = { ...prescriptions.value[idx], ...(updated || payload) };
    }
    showToast(`Updated ${payload.medicationName} successfully!`);
    showEditModal.value = false;
  } catch (err) {
    console.warn('Backend update failed, updating locally:', err);
    const idx = prescriptions.value.findIndex(r => r.id === editForm.id);
    if (idx !== -1) {
      prescriptions.value[idx] = { ...prescriptions.value[idx], ...payload };
    }
    showToast(`Updated ${payload.medicationName} (Saved locally)`, 'success');
    showEditModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

// 3. Submit Discontinue
const submitDiscontinueMed = async () => {
  if (!selectedMed.value?.id) return;
  isSubmitting.value = true;
  const id = selectedMed.value.id;

  try {
    await DoctorService.discontinuePrescription(id, discontinueReason.value);
    const target = prescriptions.value.find(r => r.id === id);
    if (target) target.isActive = false;
    showToast(`Discontinued ${selectedMed.value.medicationName}`);
    showDiscontinueModal.value = false;
  } catch (err) {
    console.warn('Backend discontinue call failed, applying locally:', err);
    const target = prescriptions.value.find(r => r.id === id);
    if (target) target.isActive = false;
    showToast(`Discontinued ${selectedMed.value.medicationName} (Saved locally)`);
    showDiscontinueModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

// 4. Submit Delete
const submitDeleteMed = async () => {
  if (!selectedMed.value?.id) return;
  isSubmitting.value = true;
  const id = selectedMed.value.id;

  try {
    await DoctorService.deletePrescription(id);
    prescriptions.value = prescriptions.value.filter(r => r.id !== id);
    showToast('Medication deleted permanently');
    showDeleteModal.value = false;
  } catch (err) {
    console.warn('Backend delete call failed, removing locally:', err);
    prescriptions.value = prescriptions.value.filter(r => r.id !== id);
    showToast('Medication deleted (Removed locally)');
    showDeleteModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const addCalendarRef = ref(null);
const editCalendarRef = ref(null);

const handlePrescriptionsClickOutside = (event) => {
  if (isAddCalendarVisible.value && addCalendarRef.value) {
    const isInside = addCalendarRef.value.contains(event.target) || 
      (event.target && event.target.closest && (event.target.closest('.calendar-container') || event.target.closest('.custom-calendar-dropdown')));
    if (!isInside) {
      isAddCalendarVisible.value = false;
      addMonthDropdownVisible.value = false;
      addYearDropdownVisible.value = false;
    }
  }
  if (isEditCalendarVisible.value && editCalendarRef.value) {
    const isInside = editCalendarRef.value.contains(event.target) || 
      (event.target && event.target.closest && (event.target.closest('.calendar-container') || event.target.closest('.custom-calendar-dropdown')));
    if (!isInside) {
      isEditCalendarVisible.value = false;
      editMonthDropdownVisible.value = false;
      editYearDropdownVisible.value = false;
    }
  }
};

onMounted(() => {
  loadData();
  document.addEventListener('click', handlePrescriptionsClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handlePrescriptionsClickOutside);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-jakarta {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Custom Calendar Styles Matching Sign-Up Pages */
.calendar-container {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  margin-top: 8px;
  background-color: #fff;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  min-width: 290px;
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
  margin: 0 6px;
}

.calendar-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
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
  font-weight: 700;
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
  width: 34px;
  height: 34px;
  margin: auto;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.day-cell:not(.other-month):hover {
  background-color: #e0e7ff;
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
  font-weight: 700;
}

.day-cell.today {
  border: 1.5px solid #4f46e5;
  color: #4f46e5;
}

.custom-calendar-dropdown {
  position: relative;
  flex-grow: 1;
}

.calendar-dropdown-button {
  width: 100%;
  height: 36px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
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
  border-radius: 14px;
  z-index: 60;
  list-style: none;
  padding: 4px 0;
  max-height: 180px;
  overflow-y: auto;
}

.calendar-dropdown-menu li {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.calendar-dropdown-menu li:hover {
  background-color: #f1f5f9;
  color: #4f46e5;
}
</style>
