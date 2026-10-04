<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
    <!-- Frosted Top Curtain (always-on) -->
    <div class="fixed top-0 left-0 right-0 pointer-events-none z-40" style="height: 80px;">
      <div class="absolute inset-x-0 top-0" style="height: 20px; background: #f8fafc;"></div>
      <div class="absolute inset-x-0" style="top: 20px; height: 60px; background: linear-gradient(to bottom, #f8fafc 0%, rgba(248,250,252,0.85) 40%, transparent 100%);"></div>
    </div>

    <!-- Floating Island Navbar (Adapts dynamically to Logged-in vs Guest) -->
    <header 
      class="sticky top-3 sm:top-4 z-50 mx-auto max-w-[1600px] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] rounded-2xl sm:rounded-3xl transition-all duration-300 px-4 sm:px-6 flex items-center justify-between"
      :class="isScrolled 
        ? 'bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 py-2.5 ring-1 ring-slate-900/5' 
        : 'bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-900/5 py-3 ring-1 ring-slate-900/[0.03]'"
    >
      <div class="flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-300 text-xl transform group-hover:rotate-12 transition-transform cursor-pointer">K</div>
          <div>
            <span class="font-extrabold text-xl tracking-tight text-slate-800 hidden sm:block">KhojHealth</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block sm:hidden">Directory</span>
          </div>
        </router-link>

        <!-- Mode badge -->
        <span 
          v-if="authStore.isLoggedIn"
          class="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {{ userDisplayRole }} Portal Connected
        </span>
        <span 
          v-else
          class="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
        >
          Public Directory
        </span>
      </div>
      
      <!-- Unified Context-Aware Search Bar -->
      <div class="hidden md:flex flex-1 max-w-2xl mx-6 items-center bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all p-1.5 gap-0">

        <!-- DOCTORS MODE: single search field -->
        <template v-if="searchType === 'doctors'">
          <div class="flex-1 flex items-center px-3">
            <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search by doctor name..."
              class="w-full bg-transparent outline-none border-none focus:ring-0 text-sm text-slate-700 px-2 placeholder-slate-400"
            />
          </div>
        </template>

        <!-- CLINICS MODE: name + pincode + location city -->
        <template v-else>
          <!-- Clinic Name -->
          <div class="flex-1 flex items-center px-3 border-r border-slate-200">
            <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Clinic name..."
              class="w-full bg-transparent outline-none border-none focus:ring-0 text-sm text-slate-700 px-2 placeholder-slate-400"
            />
          </div>
          <!-- Pincode -->
          <div class="w-28 flex items-center px-3 border-r border-slate-200">
            <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
            <input
              v-model="searchPincode"
              @keyup.enter="handleSearch"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="Pincode"
              class="w-full bg-transparent outline-none border-none focus:ring-0 text-sm text-slate-700 px-2 placeholder-slate-400"
            />
          </div>
          <!-- City dropdown -->
          <div class="relative w-36" ref="navbarCityRef">
            <button
              type="button"
              @click="navbarCityOpen = !navbarCityOpen"
              class="w-full flex items-center gap-1.5 px-3 py-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span class="truncate">{{ searchLocation || 'City' }}</span>
              <svg :class="['w-3 h-3 text-slate-400 shrink-0 ml-auto transition-transform', navbarCityOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div
              v-if="navbarCityOpen"
              class="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up"
            >
              <div class="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                <div
                  @click="searchLocation = ''; navbarCityOpen = false; handleSearch();"
                  :class="['px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors', searchLocation === '' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50']"
                >All Cities</div>
                <div
                  v-for="city in availableLocations"
                  :key="city"
                  @click="searchLocation = city; navbarCityOpen = false; handleSearch();"
                  :class="['px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors', searchLocation === city ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50']"
                >{{ city }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- Search Button (always shown) -->
        <button @click="handleSearch" class="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors shadow-sm shadow-indigo-200 ml-1 shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </div>

      <!-- Auth State View (Distinct structure for Logged-In vs Guest) -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- Logged In Structural View: Exactly matching Dashboard layout profile icon -->
        <template v-if="authStore.isLoggedIn">
          <div class="flex items-center gap-3">
            <div class="hidden lg:block text-right">
              <p class="text-sm font-bold text-slate-800 leading-tight">{{ userDisplayName }}</p>
              <p class="text-[10px] uppercase font-black text-indigo-500 tracking-wider">{{ authStore.user?.role || authStore.userRole || 'Patient' }}</p>
            </div>
            
            <!-- Profile Avatar Icon (Routes to dashboard or acts as direct profile link) -->
            <router-link 
              :to="`/dashboard/${authStore.userRole}`" 
              class="focus:outline-none hover:ring-4 hover:ring-indigo-100 transition-all rounded-xl relative group block"
              :title="`Go to ${userDisplayRole} Dashboard`"
            >
              <img 
                class="w-10 h-10 rounded-xl object-cover shadow-sm" 
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=4f46e5&color=fff`" 
                alt="Avatar"
              />
              <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 group-hover:ring-indigo-400 transition-colors"></div>
            </router-link>
            
            <!-- Logout Button identical to dashboard -->
            <button 
              @click="showLogoutModal = true" 
              id="navbar-logout-btn" 
              class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" 
              title="Logout"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </template>

        <!-- Guest / Not Logged In View -->
        <template v-else>
          <router-link 
            to="/login/patient" 
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Sign In
          </router-link>
          <router-link 
            to="/signup/patient" 
            class="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:shadow-md"
          >
            Join Free
          </router-link>
        </template>
      </div>
    </header>

    <!-- Contextual Hero Banner: Tailored for Logged In vs Guest -->
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
      
      <!-- LOGGED-IN VIEW: Personalized Workspace Header & Quick Shortcuts -->
      <div 
        v-if="authStore.isLoggedIn"
        class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-950/10 border border-slate-800 relative overflow-hidden"
      >
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/20">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Logged in as {{ userDisplayRole }}
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {{ userDisplayName }}
            </h1>
            <p class="text-slate-300 text-sm sm:text-base mt-1 max-w-xl">
              Search verified practitioners, explore accredited clinics, and manage all your healthcare bookings in one unified portal.
            </p>
          </div>

          <!-- Quick Navigation Pills for Logged-In User -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <router-link 
              :to="`/dashboard/${authStore.userRole}`" 
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur transition-all border border-white/10"
            >
              <svg class="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              My Dashboard
            </router-link>
            <router-link 
              v-if="authStore.userRole === 'patient'"
              to="/dashboard/patient/appointments" 
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              My Appointments
            </router-link>
          </div>
        </div>
      </div>

      <!-- GUEST / LOGGED-OUT VIEW: Public Discovery Hero with Registration Call-to-Action -->
      <div 
        v-else 
        class="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div class="max-w-2xl relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-bold mb-3">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Public Care Directory
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Find Top Doctors & Clinics in Your Area
          </h1>
          <p class="text-slate-600 text-sm sm:text-base mt-1.5 leading-relaxed">
            Browse qualified specialists and facilities. To confirm an instant appointment, securely view medical prescriptions, or manage health records, please sign in.
          </p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto relative z-10 flex-shrink-0">
          <router-link 
            to="/login/patient" 
            class="flex-1 sm:flex-initial text-center px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            Sign In
          </router-link>
          <router-link 
            to="/signup/patient" 
            class="flex-1 sm:flex-initial text-center px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all"
          >
            Create Patient Account
          </router-link>
        </div>
      </div>

    </div>

    <div class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12 flex flex-col md:flex-row gap-8">
      
      <!-- Left Sidebar (Filters) -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-28">
          <h3 class="font-bold text-slate-800 mb-4">I'm looking for</h3>
          
          <!-- Entity Type Toggle -->
          <div class="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              @click="setSearchType('doctors')"
              class="flex-1 text-sm py-1.5 font-medium rounded-lg transition-colors"
              :class="searchType === 'doctors' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              Doctors
            </button>
            <button 
              @click="setSearchType('clinics')"
              class="flex-1 text-sm py-1.5 font-medium rounded-lg transition-colors"
              :class="searchType === 'clinics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              Clinics
            </button>
          </div>

          <!-- Doctor Filters -->
          <div v-if="searchType === 'doctors'" class="space-y-6">
            <div class="relative" ref="dropdownRef">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Specialization</h4>
              <div @click="dropdownSpecialization = !dropdownSpecialization" class="w-full bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 transition-all shadow-sm cursor-pointer hover:border-indigo-300 flex items-center justify-between">
                <span>{{ filterSpecialization || 'All Specialties' }}</span>
                <svg :class="['w-5 h-5 text-slate-400 transition-transform duration-200 absolute right-3', dropdownSpecialization ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              <!-- Dropdown List -->
              <div v-if="dropdownSpecialization" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up">
                <div class="max-h-[188px] overflow-y-auto p-1.5 space-y-1">
                  <div @click="selectSpecialization('')" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', filterSpecialization === '' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">All Specialties</div>
                  <div v-for="spec in specialties" :key="spec" @click="selectSpecialization(spec)" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', filterSpecialization === spec ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">{{ spec }}</div>
                </div>
              </div>
            </div>

            <!-- Location Filter for Doctors -->
            <div class="relative" ref="dropdownCityRef">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">City / Location</h4>
              <div @click="dropdownCity = !dropdownCity" class="w-full bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 transition-all shadow-sm cursor-pointer hover:border-indigo-300 flex items-center justify-between">
                <span>{{ searchLocation || 'All Locations' }}</span>
                <svg :class="['w-5 h-5 text-slate-400 transition-transform duration-200 absolute right-3', dropdownCity ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              <!-- Dropdown List -->
              <div v-if="dropdownCity" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up">
                <div class="max-h-[188px] overflow-y-auto p-1.5 space-y-1">
                  <div @click="selectLocation('')" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', searchLocation === '' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">All Locations</div>
                  <div v-for="city in availableLocations" :key="city" @click="selectLocation(city)" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', searchLocation === city ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">{{ city }}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Gender</h4>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="filterGender" value="" class="text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-slate-700">Any</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="filterGender" value="MALE" class="text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-slate-700">Male</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="filterGender" value="FEMALE" class="text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-slate-700">Female</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="filterGender" value="OTHER" class="text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-slate-700">Other</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Clinic Filters (Location / City) -->
          <div v-else class="space-y-6">
            <div class="relative" ref="dropdownCityRef">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Clinic Location / City</h4>
              <div @click="dropdownCity = !dropdownCity" class="w-full bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 transition-all shadow-sm cursor-pointer hover:border-indigo-300 flex items-center justify-between">
                <span>{{ searchLocation || 'All Locations' }}</span>
                <svg :class="['w-5 h-5 text-slate-400 transition-transform duration-200 absolute right-3', dropdownCity ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              <!-- Dropdown List -->
              <div v-if="dropdownCity" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up">
                <div class="max-h-[220px] overflow-y-auto p-1.5 space-y-1">
                  <div @click="selectLocation('')" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', searchLocation === '' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">All Locations</div>
                  <div v-for="city in availableLocations" :key="city" @click="selectLocation(city)" :class="['px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors', searchLocation === city ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']">
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Popular Cities tags -->
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Popular Cities</h4>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="city in ['Mumbai', 'Bengaluru', 'New Delhi', 'Hyderabad']"
                  :key="city"
                  @click="selectLocation(searchLocation === city ? '' : city); applyFilters();"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                  :class="searchLocation === city ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                >
                  {{ city }}
                </button>
              </div>
            </div>
          </div>

          <!-- Apply / Clear Filters -->
          <div class="mt-6 flex gap-2">
            <button @click="applyFilters" class="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-xl text-sm font-semibold transition-colors">
              Apply
            </button>
            <button @click="clearFilters" class="flex-1 bg-slate-50 text-slate-600 hover:bg-slate-100 py-2 rounded-xl text-sm font-medium transition-colors">
              Clear
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content (Results) -->
      <main class="flex-1 min-w-0">
        <div class="mb-6 flex justify-between items-end">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Search Results</h2>
            <p class="text-slate-500 text-sm mt-1">Showing {{ totalElements }} {{ searchType }} for your search.</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Results List -->
        <div v-else-if="results.length > 0" class="space-y-4">
          
          <!-- Doctor Card -->
          <template v-if="searchType === 'doctors'">
            <div v-for="doc in results" :key="doc.id" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              
              <!-- Avatar -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-2xl border border-indigo-100">
                {{ doc.firstName ? doc.firstName.charAt(0) : 'D' }}{{ doc.lastName ? doc.lastName.charAt(0) : '' }}
              </div>
              
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-slate-900 truncate">Dr. {{ doc.firstName }} {{ doc.lastName }}</h3>
                <div class="text-sm font-medium text-slate-500 mt-0.5">
                  {{ doc.specializations || 'General' }} &bull; {{ doc.yearsOfExperience || 0 }} years exp.
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  <span class="truncate">Qualifications: {{ doc.qualifications || 'N/A' }}</span>
                </div>
              </div>
              
              <!-- Action Button (Differs if Logged In as Patient vs Other Role vs Guest) -->
              <div class="w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
                <!-- If Logged In as Patient: Book Directly -->
                <router-link 
                  v-if="authStore.isLoggedIn && authStore.userRole === 'patient'"
                  :to="`/dashboard/patient/book-appointment?doctorId=${doc.id}`" 
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm shadow-sm"
                >
                  <span>Book Appointment</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </router-link>

                <!-- If Logged In as Doctor/Clinic: View Dashboard/Profile -->
                <router-link 
                  v-else-if="authStore.isLoggedIn"
                  :to="`/dashboard/${authStore.userRole}`" 
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm"
                >
                  <span>View in Portal</span>
                </router-link>

                <!-- If Guest (Not Logged In): Sign in to Book -->
                <router-link 
                  v-else
                  :to="`/login/patient?redirect=${encodeURIComponent('/search?type=doctors')}`" 
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm shadow-sm hover:shadow"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                  <span>Sign in to Book</span>
                </router-link>
              </div>
            </div>
          </template>

          <!-- Clinic Card -->
          <template v-else>
            <div v-for="clinic in results" :key="clinic.id" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              
              <!-- Icon -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 text-green-600 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center border border-green-100">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-slate-900 truncate">{{ clinic.name }}</h3>
                <div class="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  <span class="truncate">{{ formatAddress(clinic) }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Operating Hours Available</span>
                </div>
              </div>
              
              <!-- Action Button (Differs if Logged In vs Guest) -->
              <div class="w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
                <!-- If Logged In as Patient -->
                <router-link 
                  v-if="authStore.isLoggedIn && authStore.userRole === 'patient'"
                  :to="`/dashboard/patient/book-appointment?clinicId=${clinic.id}`" 
                  class="w-full sm:w-auto inline-block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-5 rounded-xl transition-colors text-sm"
                >
                  View Doctors
                </router-link>

                <!-- If Logged In as Other Role -->
                <router-link 
                  v-else-if="authStore.isLoggedIn"
                  :to="`/dashboard/${authStore.userRole}`" 
                  class="w-full sm:w-auto inline-block text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm"
                >
                  Clinic Details
                </router-link>

                <!-- If Guest (Not Logged In) -->
                <router-link 
                  v-else
                  :to="`/login/patient?redirect=${encodeURIComponent('/search?type=clinics')}`" 
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-5 rounded-xl transition-colors text-sm"
                >
                  <span>Sign in to Visit</span>
                </router-link>
              </div>
            </div>
          </template>
        </div>

        <!-- No Results -->
        <div v-else class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">No {{ searchType }} found</h3>
          <p class="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
          <button @click="clearFilters" class="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition-colors">
            Clear all filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1 && !isLoading" class="mt-8 flex justify-center gap-2">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 0"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Prev
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="changePage(page - 1)"
            class="w-8 h-8 rounded-lg border text-sm font-bold transition-colors flex items-center justify-center"
            :class="(page - 1) === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
          >
            {{ page }}
          </button>
          
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
    <LogoutModal
      :show="showLogoutModal"
      :role="authStore.userRole || 'patient'"
      :user-name="userDisplayName"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiFetch } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { formatAddress } from '@/utils/address';
import LogoutModal from '@/components/LogoutModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const showLogoutModal = ref(false);
const isScrolled = ref(false);

const handleWindowScroll = () => {
  isScrolled.value = window.scrollY > 15;
};

const confirmLogout = async () => {
  showLogoutModal.value = false;
  const role = authStore.userRole || 'patient';
  await authStore.logout();
  router.push(`/login/${role}`);
};

const userDisplayName = computed(() => {
  if (!authStore.user) return 'User';
  if (authStore.user.firstName || authStore.user.lastName) {
    return `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim();
  }
  return authStore.user.name || authStore.user.email || 'User';
});

const userDisplayRole = computed(() => {
  if (!authStore.userRole) return 'Guest';
  return authStore.userRole.charAt(0).toUpperCase() + authStore.userRole.slice(1);
});

const searchType = ref('doctors');
const searchQuery = ref('');
const searchLocation = ref('');
const searchPincode = ref('');
const filterSpecialization = ref('');
const filterGender = ref('');

const dropdownSpecialization = ref(false);
const dropdownRef = ref(null);
const dropdownCity = ref(false);
const dropdownCityRef = ref(null);
const navbarCityOpen = ref(false);
const navbarCityRef = ref(null);

const availableLocations = [
  'Bengaluru',
  'Chennai',
  'Gurugram',
  'Hyderabad',
  'Kochi',
  'Kolkata',
  'Mumbai',
  'New Delhi',
  'Pune'
];

const specialties = [
  'Cardiologist',
  'Dentist',
  'Dermatologist',
  'General Physician',
  'Neurologist',
  'Orthopedic',
  'Pediatrician'
];

const selectSpecialization = (spec) => {
  filterSpecialization.value = spec;
  dropdownSpecialization.value = false;
};

const selectLocation = (city) => {
  searchLocation.value = city;
  dropdownCity.value = false;
};

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownSpecialization.value = false;
  }
  if (dropdownCityRef.value && !dropdownCityRef.value.contains(e.target)) {
    dropdownCity.value = false;
  }
  if (navbarCityRef.value && !navbarCityRef.value.contains(e.target)) {
    navbarCityOpen.value = false;
  }
};

const results = ref([]);
const isLoading = ref(false);
const totalPages = ref(0);
const totalElements = ref(0);
const currentPage = ref(0);

const initFromUrl = () => {
  searchType.value = route.query.type === 'clinics' ? 'clinics' : 'doctors';
  searchQuery.value = route.query.q || '';
  searchLocation.value = route.query.location || '';
  searchPincode.value = route.query.pincode || '';
  filterSpecialization.value = route.query.specialization || '';
  filterGender.value = route.query.gender || '';
  currentPage.value = parseInt(route.query.page) || 0;
};

const updateUrlParams = () => {
  const query = {
    type: searchType.value
  };
  if (searchQuery.value) query.q = searchQuery.value;
  if (searchLocation.value) query.location = searchLocation.value;
  if (searchPincode.value) query.pincode = searchPincode.value;
  if (filterSpecialization.value) query.specialization = filterSpecialization.value;
  if (filterGender.value) query.gender = filterGender.value;
  if (currentPage.value > 0) query.page = currentPage.value;

  router.replace({ path: '/search', query });
};

const fetchResults = async () => {
  isLoading.value = true;
  try {
    let url = '';
    const params = new URLSearchParams();
    
    if (searchQuery.value) params.append('query', searchQuery.value);
    params.append('page', currentPage.value);
    params.append('size', 10);

    if (searchType.value === 'doctors') {
      url = '/doctors/search';
      if (filterSpecialization.value) params.append('specialization', filterSpecialization.value);
      if (filterGender.value) params.append('gender', filterGender.value);
      if (searchLocation.value) params.append('city', searchLocation.value);
    } else {
      url = '/clinics/search';
      // Use dedicated pincode field first, then fall back to location
      if (searchPincode.value && /^\d{6}$/.test(searchPincode.value)) {
        params.append('pinCode', searchPincode.value);
      }
      if (searchLocation.value) {
        params.append('city', searchLocation.value);
      }
    }

    let searchSucceeded = false;
    try {
      const qs = params.toString();
      const { data } = await apiFetch(`${url}${qs ? '?' + qs : ''}`);
      if (data && (Array.isArray(data.content) || Array.isArray(data))) {
        const list = Array.isArray(data) ? data : data.content;
        results.value = list;
        totalPages.value = data.totalPages !== undefined ? data.totalPages : Math.ceil(list.length / 10);
        totalElements.value = data.totalElements !== undefined ? data.totalElements : list.length;
        searchSucceeded = true;
      }
    } catch (err) {
      console.warn(`Search endpoint ${url} failed or returned error, attempting fallback to full directory list:`, err);
    }

    // Fallback: If backend search endpoint fails (e.g. 500), fetch from standard /doctors or /clinics
    if (!searchSucceeded) {
      const fallbackUrl = searchType.value === 'doctors' ? '/doctors' : '/clinics';
      const { data } = await apiFetch(fallbackUrl);
      let list = Array.isArray(data) ? data : (data?.content || []);

      const q = (searchQuery.value || '').trim().toLowerCase();
      const loc = (searchLocation.value || '').trim().toLowerCase();

      if (searchType.value === 'doctors') {
        if (q) {
          list = list.filter(d => 
            `${d.firstName || ''} ${d.lastName || ''}`.toLowerCase().includes(q) ||
            (d.specializations || '').toLowerCase().includes(q) ||
            (d.qualifications || '').toLowerCase().includes(q)
          );
        }
        if (filterSpecialization.value) {
          list = list.filter(d => (d.specializations || '').toLowerCase().includes(filterSpecialization.value.toLowerCase()));
        }
        if (filterGender.value) {
          list = list.filter(d => (d.gender || '').toUpperCase() === filterGender.value.toUpperCase());
        }
        if (loc) {
          list = list.filter(d => (d.city || '').toLowerCase().includes(loc));
        }
      } else {
        if (q) {
          list = list.filter(c => 
            (c.name || '').toLowerCase().includes(q) ||
            (c.city || '').toLowerCase().includes(q) ||
            (c.street || '').toLowerCase().includes(q)
          );
        }
        if (loc) {
          list = list.filter(c => 
            (c.city || '').toLowerCase().includes(loc) ||
            (c.pinCode || '').toLowerCase().includes(loc)
          );
        }
      }

      totalElements.value = list.length;
      totalPages.value = Math.ceil(list.length / 10) || 1;
      const startIndex = currentPage.value * 10;
      results.value = list.slice(startIndex, startIndex + 10);
    }
  } catch (error) {
    console.error('Failed to fetch search results', error);
    results.value = [];
    totalPages.value = 0;
    totalElements.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 0;
  updateUrlParams();
  fetchResults();
};

const applyFilters = () => {
  currentPage.value = 0;
  updateUrlParams();
  fetchResults();
};

const clearFilters = () => {
  filterSpecialization.value = '';
  filterGender.value = '';
  searchQuery.value = '';
  searchLocation.value = '';
  searchPincode.value = '';
  currentPage.value = 0;
  updateUrlParams();
  fetchResults();
};

const setSearchType = (type) => {
  searchType.value = type;
  // Clear filters that don't apply to the new mode
  filterSpecialization.value = '';
  filterGender.value = '';
  searchPincode.value = '';
  searchLocation.value = '';
  currentPage.value = 0;
  updateUrlParams();
  fetchResults();
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    updateUrlParams();
    fetchResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Initial load
onMounted(() => {
  initFromUrl();
  fetchResults();
  document.addEventListener('click', closeDropdown);
  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  handleWindowScroll();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  window.removeEventListener('scroll', handleWindowScroll);
});

// Watch for route changes to reload data (e.g. user hits back button)
watch(() => route.query, () => {
  initFromUrl();
  fetchResults();
}, { deep: true });

</script>
